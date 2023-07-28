/*
 * @Author: zdd
 * @Date: 2023-05-31 16:13:02
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 09:42:10
 * @FilePath: /vg-vscode-extension/src/commands/new-getx-full-page.ts
 * @Description: 
 */

import { Uri, window } from "vscode";
import { bindingsTemplate, controllerTemplate, viewTemplate } from "../templates/getx-full-page.template";
import { mkdirp, existsSync, isNil, pascalCase, promptForPageTypePick, promptForPageName, snakeCase } from "../utils";
import type { PageType } from "@root/type.d";


export const newGetxFullPage = async (uri: Uri) => {
  const pageName = await promptForPageName();
  if (isNil(pageName) || pageName.trim() === "") {
    window.showErrorMessage("The name must not be empty");
    return;
  }
  const pascalCasepageName = pascalCase(pageName);
  const pageType = await promptForPageTypePick();
  let targetDirectory = uri.fsPath;
  try {
    await generateCode(pageName, targetDirectory, pageType);
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

async function generateCode(pageName: string, targetDirectory: string, pageType: PageType) {
  const snakeCaseName = snakeCase(pageName);
  const pageFile = `${targetDirectory}/${snakeCaseName}_page.dart`;
  if (!existsSync(pageFile)) {
    await Promise.all((pageType === 'refresh list' ? ['bindings', 'controllers', 'widgets'] : ['bindings', 'controllers']).map(async item => {
      const directoryPath = `${targetDirectory}/${item}`;
      if (!existsSync(directoryPath)) await mkdirp(directoryPath);
    }));

    await Promise.all([
      controllerTemplate(pageName, targetDirectory, pageType),
      bindingsTemplate(pageName, targetDirectory),
      viewTemplate(pageName, targetDirectory, pageType),
    ]);
  }
}
