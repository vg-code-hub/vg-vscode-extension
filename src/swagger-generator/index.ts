/*
 * @Author: zdd
 * @Date: 2023-05-31 21:58:23
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-02 23:29:49
 * @FilePath: /vg-vscode-extension/src/swagger-generator/index.ts
 * @Description: 
 */
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { getRootPath } from '@root/util';
import { existsSync, writeFile } from "fs";
export * from "./dart";
export * from "./ts";

const values = `# swagger 配置文件
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
