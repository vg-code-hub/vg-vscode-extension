/*
 * @Author: zdd
 * @Date: 2023-06-01 15:12:03
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-02 15:15:25
 * @FilePath: /vg-vscode-extension/src/swagger-generator/dart/index.ts
 * @Description: 
 */

import * as changeCase from "change-case";
import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { existsSync, writeFile } from "fs";
import { createDirectory } from "../../util";
import { isEmpty, isNil } from "lodash";
import { getSimpleData } from "../http";
import { collectChinese } from "../utils";
import { getTranslateInfo } from "../translation";
import ModelGenerate from "./generate/model";
import RequestGenerate from "./generate/request";

export const genWebapiForDart = async (uri: Uri) => {

  let jsonUrl = await promptForJsonUrl();
  // if (isNil(jsonUrl) || jsonUrl.trim() === "") {
  //   window.showErrorMessage("The name must not be empty");
  //   return;
  // }

  let targetDirectory = uri.fsPath;

  // jsonUrl = 'http://127.0.0.1:4523/export/openapi?projectId=2540665&version=2.0'; // done
  jsonUrl = 'http://127.0.0.1:4523/export/openapi?projectId=2540665&version=3.1';

  const pascalCasepageName = changeCase.pascalCase(jsonUrl.toLowerCase());
  try {
    await generateCode(jsonUrl, targetDirectory);
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


async function generateCode(jsonUrl: string, targetDirectory: string) {
  const directoryPath = `${targetDirectory}/api`;
  if (!existsSync(directoryPath)) await createDirectory(directoryPath);

  const values = await getSimpleData(jsonUrl);

  writeFile(
    directoryPath.concat(`/swagger.json`),
    JSON.stringify(values, null, 4),
    'utf-8',
    () => { }
  );

  //收集所有中文
  let chineseList = collectChinese(values);

  const translationPath = directoryPath.concat(`/translation.json`);
  // 拿到所有中英文映射对象
  let translateJson = await getTranslateInfo(chineseList, translationPath);

  // 把翻译的内容写入
  writeFile(
    translationPath,
    JSON.stringify(translateJson, null, 4),
    'utf-8',
    (error: any) => {
      // if (error)
      //   reject(error);
      // else
      //   resolve("写入成功");
    }
  );

  // 生成 model
  await new ModelGenerate(values.data, { translateJson, rootPath: directoryPath }).generateAllModel();
  await new RequestGenerate(values.paths, { translateJson, rootPath: directoryPath, swaggerVersion: values.swagger }).generateAllRequest();

  // await completePathAll(el.paths, {
  //   name: el.serviceName,
  //   rootPath: path.resolve(outputPath),
  // });

}
