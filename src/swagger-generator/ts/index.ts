/*
 * @Author: zdd
 * @Date: 2023-06-01 15:12:03
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-05 17:19:10
 * @FilePath: /vg-vscode-extension/src/swagger-generator/ts/index.ts
 * @Description: 
 */

import { Uri, window } from "vscode";

export const genWebapiForTypescript = async (uri: Uri) => {
  try {

    window.showInformationMessage(
      `Successfully Generated api directory`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};
