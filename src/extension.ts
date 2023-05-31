/*
 * @Author: zdd
 * @Date: 2023-05-30 17:42:04
 * @LastEditors: zdd
 * @LastEditTime: 2023-05-31 10:41:21
 * @FilePath: /vg-vscode-extension/src/extension.ts
 * @Description: 
 */
import * as vscode from 'vscode';
import { getCurrentFilePath } from './commands/test-command-params';
import { testMenuShow } from './commands/test-menu-when';
import { showWelcome } from './commands/welcome';
import { openWebview } from './commands/webview';
import { jumpToDefinition } from './provider/jump-to-definition';
import { jumpToNpmDependencyLinks } from './provider/jump_to_npm_dependency_links';

export function activate(context: vscode.ExtensionContext) {

	console.log('恭喜，您的扩展“vg-vscode-extension”已被激活！');

	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from vg-vscode-extension!');
	});

	context.subscriptions.push(disposable);

	getCurrentFilePath(context);
	testMenuShow(context);
	openWebview(context);
	showWelcome(context);
	// jumpToDefinition(context);
	jumpToNpmDependencyLinks(context);
	require('./provider/completion')(context); // 自动补全
	require('./provider/hover')(context); // 悬停提示

}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('您的扩展“vg-vscode-extension”已被释放！');
}
