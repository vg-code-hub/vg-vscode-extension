/*
 * @Author: zdd
 * @Date: 2023-06-28 18:20:12
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 10:44:05
 * @FilePath: /vg-vscode-extension/webview-react/src/global.d.ts
 * @Description: 
 */
interface IVscode {
  postMessage(message: any): void;
}
// declare function acquireVsCodeApi(): vscode;
declare let vscode: IVscode;

declare interface Window {
  vscode: IVscode;
}