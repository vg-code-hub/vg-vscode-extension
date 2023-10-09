/*
 * @Author: zdd
 * @Date: 2023-06-17 09:45:05
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-08 20:54:44
 * @FilePath: /vg-vscode-extension/src/context.ts
 * @Description:
 */
import { ExtensionContext, window } from 'vscode';

const data: {
  extensionContext?: ExtensionContext;
  extensionPath: string;
  activeTextEditorId: string;
} = {
  extensionContext: undefined, // 插件 context
  extensionPath: '', // 插件安装目录
  activeTextEditorId: '', // 激活的 tab id
};

export const getExtensionContext = () => data.extensionContext;

export const setLastActiveTextEditorId = (activeTextEditorId: string) => {
  data.activeTextEditorId = activeTextEditorId;
};

export const getLastAcitveTextEditor = () => {
  const { visibleTextEditors } = window;
  const activeTextEditor = visibleTextEditors.find((item: any) => item.id === data.activeTextEditorId);
  return window.activeTextEditor || activeTextEditor;
};

export const getExtensionPath = () => data.extensionPath;

export const init = (options: { extensionContext?: ExtensionContext; extensionPath?: string }) => {
  if (options.extensionPath) data.extensionPath = options.extensionPath;

  if (options.extensionContext) data.extensionContext = options.extensionContext;
};
