/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-17 20:17:59
 * @FilePath: /vg-vscode-extension/src/webview/controllers/generate.ts
 * @Description:
 */
import { genCodeByBlock, genCodeBySnippet } from '../../utils/generate';
import { IMessage } from '../type';

export const genCodeByBlockMaterial = async (
  message: IMessage<{
    material: string;
    model: object;
    path: string;
    createPath: string[];
  }>
) => {
  await genCodeByBlock(message.data);
  return '生成成功';
};
export const genCodeBySnippetMaterial = async (message: IMessage<{ model: any; template: string; name: string }>) => {
  await genCodeBySnippet(message.data);
  return '生成成功';
};
