/*
 * @Author: zdd
 * @Date: 2023-06-17 09:26:40
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 19:05:39
 * @FilePath: /vg-vscode-extension/src/commands/common.ts
 * @Description: 
 */
import * as vscode from 'vscode';
import { commands } from '../utils';
import { showWebView } from '../webview';

export const commonCommands = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('lowcode.openFolderForceNewWindow', () => {
      vscode.commands.executeCommand('_files.pickFolderAndOpen', {
        forceNewWindow: true,
      });
    }),
    vscode.commands.registerCommand('lowcode.openScaffold', () => {
      showWebView(context, {
        key: 'createApp',
        title: '创建应用',
        viewColumn: vscode.ViewColumn.One,
        task: { task: 'route', data: { path: '/scaffold' } },
      });
    }),
    vscode.commands.registerCommand('lowcode.openConfig', () => {
      showWebView(context, {
        key: 'main',
        task: { task: 'route', data: { path: '/config' } },
      });
    }),
    vscode.commands.registerCommand(commands.openDownloadMaterials, () => {
      showWebView(context, {
        key: 'downloadMaterials',
        title: '下载物料',
        viewColumn: vscode.ViewColumn.One,
        task: { task: 'route', data: { path: '/downloadMaterials' } },
      });
    }),
  );
};
