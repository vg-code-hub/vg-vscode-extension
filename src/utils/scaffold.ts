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

export const downloadScaffoldFromGit = (remote: string) => {
  fs.removeSync(tempGlobalDir.scaffold);
  execa.execaSync('git', ['clone', ...remote.split(' '), tempGlobalDir.scaffold]);
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

export const compileScaffold = async (model: any, createDir: string) => {
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
  fs.copySync(tempGlobalDir.scaffold, createDir);
};
