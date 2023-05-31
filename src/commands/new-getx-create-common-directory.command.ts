/*
 * @Author: zdd
 * @Date: 2023-05-31 16:13:02
 * @LastEditors: zdd
 * @LastEditTime: 2023-05-31 18:11:43
 * @FilePath: /vg-vscode-extension/src/commands/new-getx-create-common-directory.command.ts
 * @Description: 
 */

import { Uri, window } from "vscode";
import { existsSync } from "fs";
import {
  indexTemplate,
  commonIndexTemplate,
  viewIndexTemplate,
} from "../templates/getx-create-common-directory.template";
import { createDirectory } from "../util";


export const newGetxCommonDirectory = async (uri: Uri) => {
  console.log(uri);

  let targetDirectory = uri.fsPath;
  console.log(targetDirectory);

  // const pascalCasepageName = changeCase.pascalCase(pageName.toLowerCase());
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
      await createDirectory(`${targetDirectory}/${item}`);
      indexTemplate(item, targetDirectory);
    });

    // fview
    const fviewPath = `${targetDirectory}/fview`;
    await createDirectory(`${targetDirectory}/fview`);
    ['components', 'utils', 'vendors', 'widgets'].forEach(async item => {
      await createDirectory(`${fviewPath}/${item}`);
      indexTemplate(item, fviewPath);
    });
    viewIndexTemplate(fviewPath);

    // common
    await createDirectory(commonDirectoryPath);
    ['extension', 'l10n', 'models', 'network', 'services', 'style', 'theme', 'utils', 'values'].forEach(async item => {
      await createDirectory(`${commonDirectoryPath}/${item}`);
      indexTemplate(item, commonDirectoryPath);
    });
    commonIndexTemplate(commonDirectoryPath);
  }
}
