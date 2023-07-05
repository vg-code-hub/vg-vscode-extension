/*
 * @Author: zdd
 * @Date: 2023-06-17 09:26:40
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 17:20:23
 * @FilePath: /vg-vscode-extension/src/commands/common.ts
 * @Description: 
 */
import * as vscode from 'vscode';
import { refreshIntelliSense } from '../webview/controllers/intelliSense';
import { showWebView } from '../webview';

export const commonCommands = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.refreshIntelliSense', () => {
      // 刷新代码智能提示
      refreshIntelliSense();
    }),
    vscode.commands.registerCommand(
      "extension.generateCodeByWebview",
      (args) => {
        showWebView(context, {
          key: 'main',
          viewColumn: vscode.ViewColumn.Two,
        });
      }
    ),
    vscode.commands.registerCommand('extension.openScaffold', () => {
      showWebView(context, {
        key: 'createApp',
        title: '创建应用',
        viewColumn: vscode.ViewColumn.One,
        task: { task: 'route', data: { path: '/scaffold' } },
      });
    }),
    vscode.commands.registerCommand('extension.openConfig', () => {
      showWebView(context, {
        key: 'main',
        title: '项目配置',
        task: { task: 'route', data: { path: '/config' } },
      });
    }),
  );
};
