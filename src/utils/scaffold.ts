/*
 * @Author: zdd
 * @Date: 2023-06-17 18:09:03
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 14:12:13
 * @FilePath: /vg-vscode-extension/src/utils/scaffold.ts
 * @Description:
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import * as execa from 'execa';
import { parse } from 'yaml';

import { renderEjsTemplates } from './ejs';
import { tempGlobalDir } from './env';
import { rootPath } from './vscodeEnv';
import { camelCase, snakeCase } from './tools';

export const downloadScaffoldFromGit = async (remote: string, tag?: string) => {
  fs.removeSync(tempGlobalDir.scaffold);
  execa.execaSync('git', ['clone', ...remote.split(' '), tempGlobalDir.scaffold]);
  if (tag) execa.execaSync('git', ['checkout', `tags/${tag}`], { cwd: tempGlobalDir.scaffold });

  // config gitmodules
  if (fs.existsSync(path.join(tempGlobalDir.scaffold, '.gitmodules'))) {
    const { stdout } = await execa.execa('git', ['submodule', 'status'], { cwd: tempGlobalDir.scaffold });
    const map: Record<string, any> = {};
    stdout.split('\n').forEach((line) => {
      const [value, key] = line.trim().split(' ');
      map[key] = { commit: value.startsWith('-') ? value.substring(1) : value };
    });
    const contentArr = fs.readFileSync(path.join(tempGlobalDir.scaffold, '.gitmodules'), 'utf8').trim().split('\n');
    for (let i = 0; i < contentArr.length; i += 3) {
      const key = contentArr[i + 1].split('=')[1].trim();
      const url = contentArr[i + 2].split('=')[1].trim();
      map[key] = { ...map[key], url };
    }
    fs.removeSync(path.join(tempGlobalDir.scaffold, '.git'));
    await execa.execa('git', ['init'], { cwd: tempGlobalDir.scaffold });
    for (const key in map) {
      fs.removeSync(path.join(tempGlobalDir.scaffold, key));
      console.log(map[key]);
      await execa.execa('git', ['submodule', 'add', map[key].url, key], { cwd: tempGlobalDir.scaffold });
      await execa.execa('git', ['checkout', map[key].commit], { cwd: path.join(tempGlobalDir.scaffold, key) });
    }
  }

  if (fs.existsSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json')))
    return fs.readJSONSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'));

  return {};
};

export const copyLocalScaffoldToTemp = (localScaffoldPath?: string) => {
  if (!localScaffoldPath) localScaffoldPath = rootPath;

  if (!localScaffoldPath) throw new Error('当前没有打开项目，请选择本地项目');

  fs.removeSync(tempGlobalDir.scaffold);
  fs.copySync(localScaffoldPath, tempGlobalDir.scaffold, {
    filter: (src: string, dest: string) => {
      if (src.includes('.git') || src.includes('node_modules')) return false;

      return true;
    },
  });
  fs.removeSync(path.join(tempGlobalDir.scaffold, '.git'));
  if (fs.existsSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json')))
    return fs.readJSONSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'));

  return {};
};

export const compileScaffold = async (model: any, createDir: string) => {
  if (fs.existsSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'))) {
    const config = fs.readJSONSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'));
    const excludeCompile: string[] = config.excludeCompile || [];
    if (config.conditionFiles)
      Object.keys(model).map((key) => {
        if (config.conditionFiles[key] && config.conditionFiles[key].value === model[key] && Array.isArray(config.conditionFiles[key].exclude))
          config.conditionFiles[key].exclude.map((exclude: string) => {
            fs.removeSync(path.join(tempGlobalDir.scaffold, exclude));
          });
      });

    await renderEjsTemplates(model, tempGlobalDir.scaffold, excludeCompile);
    fs.removeSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'));
  }
  const dirs = createDir.split('/');
  const snakeName = snakeCase(dirs.pop());
  const camelName = camelCase(snakeName);
  const lastDir = createDir.substring(0, createDir.lastIndexOf('/')) + '/' + snakeName;
  fs.copySync(tempGlobalDir.scaffold, lastDir);

  let name = '';
  // flutter
  if (fs.existsSync(path.join(lastDir, 'pubspec.yaml'))) {
    const config = parse(fs.readFileSync(path.join(lastDir, 'pubspec.yaml'), 'utf8'));
    name = config.name;
    const originCamelName = camelCase(name);
    function cleanGStr(str: string) {
      if (str.startsWith('"')) str = str.substring(1, str.length - 1);
      if (str.endsWith('"')) str = str.substring(0, str.length - 1);
      return str;
    }
    const g2js = require('gradlejs');
    const { android } = await g2js.parseFile(path.join(lastDir, 'android/app/build.gradle'));
    const [_, groupName] = cleanGStr(android.namespace).split('.');

    const arrSnake = [
      'README.md',
      'pubspec.yaml',
      '.vscode/launch.json',
      'test/widget_test.dart',
      `android/app/src/main/java/com/${groupName}/${name}/MyApplication.java`,
      'android/app/build.gradle',
      `android/app/src/main/java/com/${groupName}/${name}/MapActivity.java`,
      'android/app/src/main/AndroidManifest.xml',
    ];
    const camelArr = ['ios/Runner/Info.plist', 'ios/Runner.xcodeproj/project.pbxproj'];

    arrSnake.forEach((item) => {
      let content = fs.readFileSync(path.join(lastDir, item), 'utf-8');
      content = content.replaceAll(name, snakeName);
      fs.writeFileSync(path.join(lastDir, item), content);
    });
    camelArr.forEach((item) => {
      let content = fs.readFileSync(path.join(lastDir, item), 'utf-8');
      content = content.replaceAll(originCamelName, camelName);
      fs.writeFileSync(path.join(lastDir, item), content);
    });

    fs.copySync(
      path.join(lastDir, `android/app/src/main/java/com/${groupName}/${name}`),
      path.join(lastDir, `android/app/src/main/java/com/${groupName}/${snakeName}`)
    );
    fs.removeSync(path.join(lastDir, `android/app/src/main/java/com/${groupName}/${name}`));
    execa.execaSync('flutter', ['pub', 'get'], { cwd: lastDir });
  }
};
