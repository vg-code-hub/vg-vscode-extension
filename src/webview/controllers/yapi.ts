/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 18:11:07
 * @FilePath: /vg-vscode-extension/src/webview/controllers/yapi.ts
 * @Description: 
 */
import { getConfig } from '@root/utils';

const config = getConfig();

export const getYapiDomain = () => {
  const domian = config.swagger?.jsonUrl;
  return domian;
};

export const getYapiProjects = () => {
  const projects = config.swagger?.folderFilter || [];
  return projects;
};
