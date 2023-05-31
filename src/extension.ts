/*
 * @Author: zdd
 * @Date: 2023-05-30 17:42:04
 * @LastEditors: zdd
 * @LastEditTime: 2023-05-31 15:22:42
 * @FilePath: /vg-vscode-extension/src/extension.ts
 * @Description: 
 */
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('恭喜，您的扩展“vg-vscode-extension”已被激活！');

	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vg-vscode-extension!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('您的扩展“vg-vscode-extension”已被释放！');
}
