/*
 * @Author: zdd
 * @Date: 2023-05-30 22:15:24
 * @LastEditors: zdd
 * @LastEditTime: 2023-05-31 14:36:17
 * @FilePath: /vg-vscode-extension/src/provider/hover.ts
 * @Description: 
 */
import * as vscode from 'vscode';
const path = require('path');
const fs = require('fs');

/**
 * 鼠标悬停提示，当鼠标停在package.json的dependencies或者devDependencies时，
 * 自动显示对应包的名称、版本号和许可协议
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 */
function provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
    console.log('==进入provideHover方法');

    const fileName = document.fileName;
    const workDir = path.dirname(fileName);
    const word = document.getText(document.getWordRangeAtPosition(position));

    if (/\/package\.json$/.test(fileName)) {
        console.log('进入provideHover方法');
        const json = document.getText();
        if (new RegExp(`"(dependencies|devDependencies)":\\s*?\\{[\\s\\S]*?${word.replace(/\//g, '\\/')}[\\s\\S]*?\\}`, 'gm').test(json)) {
            let destPath = `${workDir}/node_modules/${word.replace(/"/g, '')}/package.json`;
            if (fs.existsSync(destPath)) {
                const content = require(destPath);
                console.log('hover已生效');
                // hover内容支持markdown语法
                return new vscode.Hover(`* **名称**：${content.name}\n* **版本**：${content.version}\n* **许可协议**：${content.license}`);
            }
        }
    }
}

module.exports = function (context: vscode.ExtensionContext) {
    // 注册鼠标悬停提示
    context.subscriptions.push(vscode.languages.registerHoverProvider([{ pattern: '**/package.json' }, 'javascript'], {
        provideHover
    }));
};