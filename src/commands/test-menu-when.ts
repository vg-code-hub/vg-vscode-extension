/*
 * @Author: zdd
 * @Date: 2023-05-30 18:21:07
 * @LastEditors: zdd
 * @LastEditTime: 2023-05-30 18:21:35
 * @FilePath: /vg-vscode-extension/src/commands/test-menu-when.ts
 * @Description: 
 */
import * as vscode from 'vscode';

export function testMenuShow(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.demo.testMenuShow', () => {
        vscode.window.showInformationMessage(`你点我干啥，我长得很帅吗？`);
    }));
};