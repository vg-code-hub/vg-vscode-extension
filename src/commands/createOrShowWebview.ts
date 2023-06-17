/*
 * @Author: zdd
 * @Date: 2023-06-17 09:25:29
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 19:07:09
 * @FilePath: /vg-vscode-extension/src/commands/createOrShowWebview.ts
 * @Description: 
 */
import * as vscode from 'vscode';
import { formatPath } from '../utils';
import { showWebView } from '../webview';

// (context: vscode.ExtensionContext) => {
//   context.subscriptions.push(
//     vscode.commands.registerCommand(
//       'extension.generateCodeByWebview',
export const createOrShowWebview = (context: vscode.ExtensionContext, args: vscode.Uri) => {
  const path = formatPath(args?.path);
  showWebView(context, {
    key: 'main',
    viewColumn: vscode.ViewColumn.Two,
    task: path
      ? {
        task: 'updateSelectedFolder',
        data: { selectedFolder: path },
      }
      : undefined,
  });
};