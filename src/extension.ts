/*
 * @Author: zdd
 * @Date: 2023-05-30 17:42:04
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-02 23:25:06
 * @FilePath: /vg-vscode-extension/src/extension.ts
 * @Description: 
 */
import * as vscode from 'vscode';
import { imageGenerate } from './commands/image-generate';
import { newGetxCommonDirectory } from './commands/new-getx-create-common-directory.command';
import { newGetxGetBuilderPage } from './commands/new-getx-getbuilder-page.command';
import { newGetxPage } from './commands/new-getx-page.command';
import { newGetxStatefulWidgetGetBuilderPage } from './commands/new-getx-stateful-getbuilder-page.command';
import { routersGenerate } from './commands/routers-generate';
import { genSwaggerConfig, genWebapiForDart, genWebapiForTypescript } from './swagger-generator';

export function activate(context: vscode.ExtensionContext) {

	console.log('恭喜，您的扩展“vg-vscode-extension”已被激活！');

	context.subscriptions.push(
		vscode.commands.registerCommand(
			"extension.new-getx-routers-generate",
			routersGenerate
		),
		vscode.commands.registerCommand(
			"extension.assets-generate",
			imageGenerate
		),
		vscode.commands.registerCommand(
			"extension.new-getx-create-directory",
			newGetxCommonDirectory
		),
		vscode.commands.registerCommand("extension.new-getx-page", newGetxPage),
		vscode.commands.registerCommand(
			"extension.new-getx-getbuilder-page",
			newGetxGetBuilderPage
		),
		vscode.commands.registerCommand(
			"extension.new-getx-stateful-getbuilder-page",
			newGetxStatefulWidgetGetBuilderPage
		),
		vscode.commands.registerCommand(
			"extension.swagger-config-init",
			genSwaggerConfig
		),
		vscode.commands.registerCommand(
			"extension.swagger-2-dart",
			genWebapiForDart
		),
		vscode.commands.registerCommand(
			"extension.swagger-2-ts",
			genWebapiForTypescript
		)
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('您的扩展“vg-vscode-extension”已被释放！');
}
