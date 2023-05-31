import * as vscode from 'vscode';

export function getCurrentFilePath(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.demo.getCurrentFilePath', (uri) => {
        vscode.window.showInformationMessage(`当前文件(夹)路径是：${uri ? uri.path : '空'}`);
    }));
};