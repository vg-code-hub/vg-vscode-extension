/*
 * @Author: jimmyZhao
 * @Date: 2023-10-01 21:06:52
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-08 21:26:26
 * @FilePath: /vg-vscode-extension/src/swagger-generator/generate/index.ts
 * @Description:
 */
import { Uri, window } from 'vscode';
import { getRootPath, VGConfig } from '@root/utils';
import { SwaggerGenTool } from '../utils';
import RequestGenerate from './request';
export * from './bridge';

export const genRestapi = async (uri: Uri) => {
  try {
    let rootPath = getRootPath(undefined);
    if (!rootPath) throw Error('no root path');
    await VGConfig.instance.initConfig(rootPath);
    await generateCode();
    window.showInformationMessage(`Successfully Generated api directory`);
  } catch (error) {
    console.error(error);
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

async function generateCode() {
  const values = await SwaggerGenTool.reqSwaggerData();
  await new RequestGenerate(values.paths).generateAllRequest();
  SwaggerGenTool.reset();
}
