/*
 * @Author: zdd
 * @Date: 2023-06-01 15:12:03
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-21 10:18:36
 * @FilePath: /vg-vscode-extension/src/swagger-generator/dart/index.ts
 * @Description:
 */

import { Uri, window } from 'vscode';
import { join, mkdirp, getRootPath, existsSync, writeFile } from '@root/utils';
import { getSimpleData } from '../http';
import { SwaggerGenTool, collectChinese } from '../utils';
import RequestGenerate from './generate/request';

export const genWebapiForDart = async (uri: Uri) => {
  try {
    let rootPath = getRootPath(undefined);
    if (!rootPath) throw Error('no root path');

    const { jsonUrl, outputDir } = await SwaggerGenTool.instance.initConfig(rootPath);
    if (!jsonUrl) throw Error('no swagger jsonUrl');

    const absPath = outputDir.startsWith('/') ? join(rootPath, outputDir) : join(rootPath, 'lib', outputDir);

    await generateCode(jsonUrl, absPath);
    window.showInformationMessage(`Successfully Generated api directory`);
  } catch (error) {
    console.error(error);
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

async function generateCode(jsonUrl: string, targetDirectory: string) {
  if (!existsSync(targetDirectory)) await mkdirp(targetDirectory);

  const values = await getSimpleData(jsonUrl);

  writeFile(targetDirectory.concat(`/swagger.json`), JSON.stringify(values, null, 4), 'utf-8');

  //收集所有中文
  let chineseList = collectChinese(values);

  const translationPath = targetDirectory.concat(`/translation.json`);
  // 拿到所有中英文映射对象
  await SwaggerGenTool.getTranslateInfo(chineseList, translationPath);

  SwaggerGenTool.addConfig({ rootPath: targetDirectory });
  SwaggerGenTool.dataModels = values.data;

  await new RequestGenerate(values.paths).generateAllRequest();
  SwaggerGenTool.reset();
}
