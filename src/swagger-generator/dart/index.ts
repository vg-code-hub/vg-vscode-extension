/*
 * @Author: zdd
 * @Date: 2023-06-01 15:12:03
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-02 23:47:30
 * @FilePath: /vg-vscode-extension/src/swagger-generator/dart/index.ts
 * @Description: 
 */

import { parse } from 'yaml';
import { Uri, commands, window } from "vscode";
import { existsSync, readFileSync, writeFile } from "fs";
import { createDirectory, getRootPath } from "@root/util";
import { getSimpleData } from "../http";
import { collectChinese } from "../utils";
import { getTranslateInfo } from "../translation";
import ModelGenerate from "./generate/model";
import RequestGenerate from "./generate/request";
import { join } from "path";

export const genWebapiForDart = async (uri: Uri) => {
  let rootPath = getRootPath(undefined);
  if (!rootPath) throw Error('no root path');
  if (!existsSync(rootPath.concat(`/swagger.yaml`))) {
    await new Promise<void>((resolve) => {
      commands.executeCommand('extension.swagger-config-init').then(() => {
        setTimeout(resolve, 100);
      });
    });
    throw Error('config your swagger.yaml then  try again');
  }

  // let targetDirectory = uri.fsPath;

  const file = readFileSync(rootPath.concat(`/swagger.yaml`), 'utf8');
  const { jsonUrl, outputDir, language, requestClass } = parse(file);
  if (!jsonUrl) throw Error('no swagger jsonUrl');

  try {
    await generateCode(jsonUrl, join(rootPath, 'lib', outputDir ?? 'api'));
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

async function generateCode(jsonUrl: string, targetDirectory: string) {

  if (!existsSync(targetDirectory)) await createDirectory(targetDirectory);

  const values = await getSimpleData(jsonUrl);

  writeFile(
    targetDirectory.concat(`/swagger.json`),
    JSON.stringify(values, null, 4),
    'utf-8',
    () => { }
  );

  //收集所有中文
  let chineseList = collectChinese(values);

  const translationPath = targetDirectory.concat(`/translation.json`);
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
  await new ModelGenerate(values.data, { translateJson, rootPath: targetDirectory }).generateAllModel();
  await new RequestGenerate(values.paths, { translateJson, rootPath: targetDirectory, swaggerVersion: values.swagger }).generateAllRequest();
}
