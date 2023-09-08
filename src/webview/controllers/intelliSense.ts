/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 18:01:41
 * @FilePath: /vg-vscode-extension/src/webview/controllers/intelliSense.ts
 * @Description:
 */
import { registerCompletion } from '@root/commands/registerCompletion';
import { getExtensionContext } from '../../context';

export const refreshIntelliSense = () => {
  const context = getExtensionContext();
  if (context) {
    registerCompletion(context);
    return '刷新成功';
  }
  throw new Error('刷新失败');
};
