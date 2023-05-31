/*
 * @Author: zdd
 * @Date: 2023-05-30 22:16:12
 * @LastEditors: zdd
 * @LastEditTime: 2023-05-31 14:58:28
 * @FilePath: /vg-vscode-extension/src/provider/completion.ts
 * @Description: 
 */
import * as vscode from 'vscode';
import util from "../util";

/**
 * 自动提示实现，这里模拟一个很简单的操作
 * 当输入 this.dependencies.xxx时自动把package.json中的依赖带出来
 * 当然这个例子没啥实际意义，仅仅是为了演示如何实现功能
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 * @param {*} context 
 */
function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
    const line = document.lineAt(position);
    const projectPath = util.getProjectPath(document);
    console.log('== provideCompletionItems');

    // 只截取到光标位置为止，防止一些特殊情况
    const lineText = line.text.substring(0, position.character);
    // 简单匹配，只要当前光标前的字符串为`this.dependencies.`都自动带出所有的依赖
    if (/(^|=| )\w+\.dependencies\.$/g.test(lineText)) {
        const json = require(`${projectPath}/package.json`);
        const dependencies = Object.keys(json.dependencies || {}).concat(Object.keys(json.devDependencies || {}));
        return dependencies.map(dep => {
            // vscode.CompletionItemKind 表示提示的类型
            return new vscode.CompletionItem(dep, vscode.CompletionItemKind.Field);
        });
    }
}

/**
 * 光标选中当前自动补全item时触发动作，一般情况下无需处理
 * @param {*} item 
 * @param {*} token 
 */
function resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken) {
    return null;
}

module.exports = function (context: vscode.ExtensionContext) {
    // 注册代码建议提示，只有当按下“.”时才触发
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems,
        resolveCompletionItem
    }, '.'));
};