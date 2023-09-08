/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 17:54:59
 * @FilePath: /vg-vscode-extension/src/webview/controllers/command.ts
 * @Description:
 */
import { commands } from 'vscode';
import { IMessage } from '../type';

const command = {
  executeVscodeCommand: (message: IMessage<{ command: string }>) => {
    commands.executeCommand(message.data.command);
  },
};

export default command;
