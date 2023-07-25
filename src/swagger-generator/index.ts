/*
 * @Author: zdd
 * @Date: 2023-05-31 21:58:23
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 09:42:45
 * @FilePath: /vg-vscode-extension/src/swagger-generator/index.ts
 * @Description: 
 */
import { Uri, window } from "vscode";
import { existsSync, writeFile } from "fs";
import { getConfig, getRootPath, saveConfig } from '@root/utils';
export * from "./dart";
export * from "./ts";

const values = `# swagger 配置文件
# http://127.0.0.1:4523/export/openapi?projectId=2540665&version=2.0
# http://127.0.0.1:4523/export/openapi?projectId=2540665&version=3.1
# http://127.0.0.1:4523/export/openapi?projectId=2540665&version=3.0
# https://petstore.swagger.io/v2/swagger.json
jsonUrl: https://petstore.swagger.io/v2/swagger.json
outputDir: api
overwrite: true # 是否覆盖requests和entitys
# 1、首先过滤需要的文件夹[folderFilter]， 2、然后根据 customPathFolder ｜ customModelFolder 自定义 Folder
# 3、最后如果没有第二步，folderMap 转换 folder path
folderFilter:
  - app接口
  # - /^app接口/
  # - /^app接口模型/
customPathFolder:
  /v1/app/login: test/login
  # string startsWith
  /v1/common/upload: test/upload
  # reg match
  /v1/driver.*/: test/driver
customModelFolder:
  DeviceListResp: test
  DeviceHistoryNewResp: test/history
folderMap:
  app接口: app
  app接口模型: app
  app模型: app
  "驾驶员:driver": driver
  "项目:project": project
`;
export const genVgcodeConfig = async (uri: Uri) => {
  try {
    let rootPath = getRootPath(undefined);
    if (!rootPath) throw Error('no root path');

    if (!existsSync(rootPath.concat(`/vgcode.yaml`)))
      saveConfig(getConfig());

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
