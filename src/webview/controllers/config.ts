/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 16:31:08
 * @FilePath: /vg-vscode-extension/src/webview/controllers/config.ts
 * @Description: 
 */
import { Config, getConfig, saveConfig } from '@root/utils';
import { IMessage } from '../type';

export const getPluginConfig = () => getConfig();

export const savePluginConfig = (message: IMessage<Config>) => {
  saveConfig(message.data);
  return '保存成功';
};
