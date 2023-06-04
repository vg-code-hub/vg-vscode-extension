/*
 * @Author: zdd
 * @Date: 2023-05-31 16:13:02
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-04 20:20:47
 * @FilePath: /vg-vscode-extension/src/commands/new-getx-stateful-getbuilder-page.command.ts
 * @Description: 
 */

import * as changeCase from "change-case";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { controllerTemplate, viewTemplate } from "../templates/getx-stateful-getbuilder-page.template";
import { mkdirp, existsSync, isEmpty, isNil } from "../util";

export const newGetxStatefulWidgetGetBuilderPage = async (uri: Uri) => {
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
      if (!existsSync(directoryPath)) await mkdirp(directoryPath);
    }));

    await Promise.all([
      controllerTemplate(pageName, targetDirectory),
      viewTemplate(pageName, targetDirectory),
    ]);
  }
}
