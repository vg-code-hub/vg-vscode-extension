/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 17:52:39
 * @FilePath: /vg-vscode-extension/src/webview/controllers/alert.ts
 * @Description:
 */
import { window } from 'vscode';
import { IMessage } from '../type';

const alert = {
  alert: (message: IMessage<string>) => {
    window.showErrorMessage(message.data);
    return '来自vscode的响应';
  },
};

export default alert;
