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

import { renderEjsTemplates } from './ejs';
import { tempGlobalDir } from './env';
import { rootPath } from './vscodeEnv';
import { camelCase, snakeCase } from './tools';
import { execSync } from 'child_process';


export const downloadScaffoldFromGit = (remote: string, tag?: string) => {
  fs.removeSync(tempGlobalDir.scaffold);
  execa.execaSync('git', ['clone', ...remote.split(' '), tempGlobalDir.scaffold]);
  execa.execaCommandSync(`cd ${tempGlobalDir.scaffold} | git checkout tags/${tag}`);
  fs.removeSync(path.join(tempGlobalDir.scaffold, '.git'));
  if (
    fs.existsSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'))
  )
    return fs.readJSONSync(
      path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'),
    );

  return {};
};

export const copyLocalScaffoldToTemp = (localScaffoldPath?: string) => {
  if (!localScaffoldPath)
    localScaffoldPath = rootPath;

  if (!localScaffoldPath)
    throw new Error('当前没有打开项目，请选择本地项目');

  fs.removeSync(tempGlobalDir.scaffold);
  fs.copySync(localScaffoldPath, tempGlobalDir.scaffold, {
    filter: (src: string, dest: string) => {
      if (src.includes('.git') || src.includes('node_modules'))
        return false;

      return true;
    },
  });
  fs.removeSync(path.join(tempGlobalDir.scaffold, '.git'));
  if (
    fs.existsSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'))
  )
    return fs.readJSONSync(
      path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'),
    );

  return {};
};

export const compileScaffold = async (model: any, createDir: string, type?: 'flutter' | 'react' | 'vue') => {
  if (
    fs.existsSync(path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'))
  ) {
    const config = fs.readJSONSync(
      path.join(tempGlobalDir.scaffold, 'lowcode.scaffold.config.json'),
    );
    const excludeCompile: string[] = config.excludeCompile || [];
    if (config.conditionFiles)
      Object.keys(model).map((key) => {
        if (
          config.conditionFiles[key] &&
          config.conditionFiles[key].value === model[key] &&
          Array.isArray(config.conditionFiles[key].exclude)
        )
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

  if (type && type === 'flutter') {
    const arrSnake = ['README.md', 'pubspec.yaml', '.vscode/launch.json', 'test/widget_test.dart'];
    const camelArr = ['ios/Runner/Info.plist', 'android/app/src/main/java/com/grizzlychina/xt_app/MyApplication.java', 'android/app/src/main/java/com/grizzlychina/xt_app/MapActivity.java', 'test/widget_test.dart', 'android/app/src/main/AndroidManifest.xml', 'android/app/build.gradle'];

    arrSnake.forEach((item) => {
      let content = fs.readFileSync(path.join(lastDir, item), 'utf-8');
      content = content.replaceAll('xt_app', snakeName);
      fs.writeFileSync(path.join(lastDir, item), content);
    });
    camelArr.forEach((item) => {
      let content = fs.readFileSync(path.join(lastDir, item), 'utf-8');
      content = content.replaceAll('xt_app', camelName);
      fs.writeFileSync(path.join(lastDir, item), content);
    });

    const iosPath = path.join(lastDir, 'ios/Runner.xcodeproj/project.pbxproj');
    let content = fs.readFileSync(iosPath, 'utf-8');
    content = content.replaceAll('xtApp', camelName);
    fs.writeFileSync(iosPath, content);
  }
};
