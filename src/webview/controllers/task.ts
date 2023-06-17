/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 18:11:01
 * @FilePath: /vg-vscode-extension/src/webview/controllers/task.ts
 * @Description: 
 */
import * as vscode from 'vscode';
import { IMessage } from '../type';

export const getTask = async (
  message: IMessage,
  context: {
    webview: vscode.Webview;
    task: { task: string; data?: any };
  },
) => context.task;
