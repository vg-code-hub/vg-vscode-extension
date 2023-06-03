/*
 * @Author: zdd
 * @Date: 2023-05-31 16:13:02
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-03 16:50:01
 * @FilePath: /vg-vscode-extension/src/commands/new-getx-page.command.ts
 * @Description: 
 */

import * as changeCase from "change-case";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { existsSync } from "fs";
import {
  bindingsTemplate,
  controllerTemplate,
  indexTemplate,
  stateTemplate,
  viewTemplate,
  widgetsHelloTemplate,
  widgetsTemplate,
} from "../templates/getx-page.template";
import { createDirectory } from "../util";
import { isEmpty, isNil } from "lodash";

export const newGetxPage = async (uri: Uri) => {
  const pageName = await promptForPageName();
  if (isNil(pageName) || pageName.trim() === "") {
    window.showErrorMessage("The name must not be empty");
    return;
  }

  let targetDirectory = uri.fsPath;

  const pascalCasepageName = changeCase.pascalCase(pageName.toLowerCase());
  try {
    await generateCode(pageName, targetDirectory);
    window.showInformationMessage(
      `Successfully Generated ${pascalCasepageName} Getx Page`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function promptForPageName(): Thenable<string | undefined> {
  const namePromptOptions: InputBoxOptions = {
    prompt: "Input Page Name",
    // placeHolder: "counter",
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


async function generateCode(pageName: string, targetDirectory: string) {
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const pageFile = `${targetDirectory}/${snakeCaseName}_page.dart`;
  if (!existsSync(pageFile)) {
    await Promise.all(['bindings', 'controllers', 'widgets'].map(async item => {
      const directoryPath = `${targetDirectory}/${item}`;
      if (!existsSync(directoryPath)) await createDirectory(directoryPath);
    }));

    await Promise.all([
      controllerTemplate(pageName, targetDirectory),
      bindingsTemplate(pageName, targetDirectory),
      viewTemplate(pageName, targetDirectory),
      // widgetsTemplate(pageName, targetDirectory),
      // widgetsHelloTemplate(pageName, targetDirectory),
    ]);
  }
}
