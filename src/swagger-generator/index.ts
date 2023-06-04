/*
 * @Author: zdd
 * @Date: 2023-05-31 21:58:23
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-04 20:11:05
 * @FilePath: /vg-vscode-extension/src/swagger-generator/index.ts
 * @Description: 
 */
import { Uri, window } from "vscode";
import { existsSync, writeFile } from "fs";
import { getRootPath } from '@root/util';
export * from "./dart";
export * from "./ts";

const values = `# swagger 配置文件
# http://127.0.0.1:4523/export/openapi?projectId=2540665&version=2.0
# http://127.0.0.1:4523/export/openapi?projectId=2540665&version=3.1
# http://127.0.0.1:4523/export/openapi?projectId=2540665&version=3.0
# https://petstore.swagger.io/v2/swagger.json
jsonUrl: http://127.0.0.1:4523/export/openapi?projectId=2540665&version=3.1
outputDir: api
# language: dart | typescript
language: dart
# GetConnect | dio | axios
requestClass: GetConnect
`;
export const genSwaggerConfig = async (uri: Uri) => {
  try {
    let rootPath = getRootPath(undefined);
    if (!rootPath) throw Error('no root path');

    if (!existsSync(rootPath.concat(`/swagger.yaml`)))
      writeFile(
        rootPath.concat(`/swagger.yaml`),
        values,
        'utf-8',
        () => { }
      );
    window.showInformationMessage(
      `Successfully Generated api yaml`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};
