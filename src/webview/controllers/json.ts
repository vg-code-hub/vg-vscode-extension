/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 18:03:15
 * @FilePath: /vg-vscode-extension/src/webview/controllers/json.ts
 * @Description: 
 */
import { json2Ts } from '@root/utils';
import { IMessage } from '../type';

export const jsonToTs = async (
  message: IMessage<{ json: object; typeName: string }>,
) => {
  const type = await json2Ts(message.data.json, message.data.typeName);
  return type;
};
