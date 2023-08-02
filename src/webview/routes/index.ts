/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-20 11:47:16
 * @FilePath: /vg-vscode-extension/src/webview/routes/index.ts
 * @Description: 
 */
import alert from '../controllers/alert';
import material from '../controllers/material';
import schema from '../controllers/schema';
import command from '../controllers/command';
import * as scaffold from '../controllers/scaffold';
import * as directory from '../controllers/directory';
import * as yapi from '../controllers/yapi';
import * as generate from '../controllers/generate';
import * as snippet from '../controllers/snippet';
import * as block from '../controllers/block';
import * as json from '../controllers/json';
import * as config from '../controllers/config';
import * as intelliSense from '../controllers/intelliSense';
import * as reqeust from '../controllers/request';
import * as task from '../controllers/task';

export const routes: Record<string, any> = {
  alert: alert.alert,

  downloadMaterials: material.downloadMaterials,
  getLocalMaterials: material.getLocalMaterials,
  saveDownloadMaterials: material.saveDownloadMaterials,
  deleteMaterialTemplate: material.deleteMaterialTemplate,
  getLocalSchemas: schema.getLocalSchemas,
  genPagesCode: schema.genPagesCode,

  insertSnippet: snippet.insertSnippet,
  addSnippets: snippet.addSnippets,

  createBlockTemplate: block.createBlock,

  executeVscodeCommand: command.executeVscodeCommand,

  getScaffolds: scaffold.getScaffolds,
  downloadScaffold: scaffold.downloadScaffold,
  selectDirectory: scaffold.selectDirectory,
  createProject: scaffold.createProject,
  useLocalScaffold: scaffold.useLocalScaffold,

  getDirectoryTree: directory.getDirectoryTree,

  getYapiDomain: yapi.getYapiDomain,
  getYapiProjects: yapi.getYapiProjects,

  genTemplateModelByYapi: generate.genTemplateModelByYapi,
  genCodeByBlockMaterial: generate.genCodeByBlockMaterial,
  genCodeBySnippetMaterial: generate.genCodeBySnippetMaterial,

  jsonToTs: json.jsonToTs,

  getPluginConfig: config.getPluginConfig,
  getPluginScaffoldJsonUrl: config.getPluginScaffoldJsonUrl,
  savePluginConfig: config.savePluginConfig,

  refreshIntelliSense: intelliSense.refreshIntelliSense,
  request: reqeust.axiosRequest,
  getTask: task.getTask,
};
