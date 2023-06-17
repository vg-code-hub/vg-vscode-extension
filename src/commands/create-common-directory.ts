/*
 * @Author: zdd
 * @Date: 2023-05-31 16:13:02
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 17:52:17
 * @FilePath: /vg-vscode-extension/src/commands/create-common-directory.ts
 * @Description: 
 */

import { Uri, window } from "vscode";
import { indexTemplate, commonIndexTemplate, viewIndexTemplate } from "../templates/create-common-directory.template";
import { mkdirp, existsSync } from "../utils";


export const newGetxCommonDirectory = async (uri: Uri) => {
  let targetDirectory = uri.fsPath;

  try {
    await generateCode("common", targetDirectory);
    window.showInformationMessage(`Successfully Generated Common Directory`);
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};


async function generateCode(pageName: string, targetDirectory: string) {
  const commonDirectoryPath = `${targetDirectory}/${pageName}`;
  if (!existsSync(commonDirectoryPath)) {

    ['pages', 'routers', 'middleware', 'domains'].forEach(async item => {
      await mkdirp(`${targetDirectory}/${item}`);
      indexTemplate(item, targetDirectory);
    });

    // fview
    const fviewPath = `${targetDirectory}/fview`;
    await mkdirp(`${targetDirectory}/fview`);
    ['components', 'utils', 'vendors', 'widgets'].forEach(async item => {
      await mkdirp(`${fviewPath}/${item}`);
      indexTemplate(item, fviewPath);
    });
    viewIndexTemplate(fviewPath);

    // common
    await mkdirp(commonDirectoryPath);
    ['extension', 'l10n', 'models', 'network', 'services', 'style', 'theme', 'utils', 'values'].forEach(async item => {
      await mkdirp(`${commonDirectoryPath}/${item}`);
      indexTemplate(item, commonDirectoryPath);
    });
    commonIndexTemplate(commonDirectoryPath);
  }
}
