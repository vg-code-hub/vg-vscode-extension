/*
 * @Author: zdd
 * @Date: 2023-06-01 15:12:03
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-04 20:14:28
 * @FilePath: /vg-vscode-extension/src/swagger-generator/ts/index.ts
 * @Description: 
 */

import * as changeCase from "change-case";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { existsSync } from "fs";
import { mkdirp } from "../../util";
import { isEmpty, isNil } from "lodash";

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

function promptForJsonUrl(): Thenable<string | undefined> {
  const namePromptOptions: InputBoxOptions = {
    prompt: "Input swagger json url",
  };
  return window.showInputBox(namePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the page in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (isNil(uri) || isEmpty(uri))
      return undefined;

    return uri[0].fsPath;
  });
}
