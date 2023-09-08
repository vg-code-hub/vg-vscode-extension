/*
 * @Author: zdd
 * @Date: 2023-07-20 11:44:45
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-20 11:50:23
 * @FilePath: /vg-vscode-extension/src/utils/schema.ts
 * @Description:
 */
import * as path from 'path';
import * as fs from 'fs';
import { getFileContent } from './file';
import { pascalCase } from './tools';
import { SwaggerConfig, getDirPath } from '@root/swagger-generator/utils';
import { getConfig } from './config';
import { rootPath } from './vscodeEnv';

/**
 * 获取本地 Schemas
 *
 */
export const getLocalSchemas = async (targetDirectory: string) => {
  var schemaFullPath = path.join(targetDirectory, 'swagger.json');
  if (!fs.existsSync(schemaFullPath)) throw new Error('schema不存在');
  const data = JSON.parse(getFileContent(schemaFullPath, true) || '{data:{}}').data;
  targetDirectory.concat(`/translation.json`);
  var filesMap: Record<string, any[]> = {};
  const { customModelFolder } = getConfig().swagger;
  await SwaggerConfig.instance.getConfig(rootPath);

  try {
    for (let key in data) {
      var value = data[key];
      const className = pascalCase(key);

      let folder;
      if (customModelFolder && customModelFolder[className]) {
        folder = customModelFolder[className];
      } else {
        folder = value['x-apifox-folder'];
        if (!SwaggerConfig.testFolder(folder ?? '')) continue;
        folder = SwaggerConfig.exchangeConfigMap(folder);
      }

      var translationPath = path.join(targetDirectory, 'translation.json');
      var translationObj = JSON.parse(getFileContent(translationPath, true));

      let dirPath: string = (getDirPath(folder, 'entitys', { translationObj, rootPath: targetDirectory }) as string).replace(targetDirectory, '');

      if (!filesMap[dirPath]) filesMap[dirPath] = [];
      filesMap[dirPath].push({
        key,
        value,
      });
    }

    return filesMap;
  } catch (error) {
    console.error(error);

    return [];
  }
};
