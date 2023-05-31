/*
 * @Author: zdd
 * @Date: 2023-05-30 21:42:57
 * @LastEditors: zdd
 * @LastEditTime: 2023-05-31 11:05:51
 * @FilePath: /vg-vscode-extension/src/provider/jump-to-definition_copy.ts
 * @Description: 
 */
/**
 * 跳转到定义示例，本示例支持`package.json`中`dependencies`、`devDependencies`跳转到对应依赖包。
 */
import * as vscode from 'vscode';

function buildLinkFromPattern(line: vscode.TextLine, lineIndex: number, packageName: string) {
    const startCharacter = line.text.indexOf(packageName);
    const endCharacter = startCharacter + packageName.length;
    const linkRange = new vscode.Range(lineIndex, startCharacter, lineIndex, endCharacter);
    const registryUrlPattern = vscode.workspace.getConfiguration('vgVscodeExtension').registryUrlPattern;
    const registryUrl = registryUrlPattern.replace('{{pkg}}', packageName);
    const linkUri = vscode.Uri.parse(registryUrl);

    return new vscode.DocumentLink(linkRange, linkUri);
}

function shouldUseUrlPattern() {
    return !!vscode.workspace.getConfiguration('vgVscodeExtension').registryUrlPattern;
}

function buildLink(line: vscode.TextLine, lineIndex: number, packageName: string) {
    if (shouldUseUrlPattern())
        return buildLinkFromPattern(line, lineIndex, packageName);


    const startCharacter = line.text.indexOf(packageName);
    const endCharacter = startCharacter + packageName.length;
    const linkRange = new vscode.Range(lineIndex, startCharacter, lineIndex, endCharacter);
    const registryUrl = vscode.workspace.getConfiguration('vgVscodeExtension').registryUrl;
    const linkUri = vscode.Uri.parse(`${registryUrl}${packageName}`);
    return new vscode.DocumentLink(linkRange, linkUri);
}

function provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken) {
    let links = [];
    let lineIndex = 0;
    let shouldCheckForDependency = false;

    while (lineIndex < document.lineCount) {
        const line = document.lineAt(lineIndex);

        if (shouldCheckForDependency)
            // no need to check for dependencies if block ended
            if (line.text.includes('}')) { shouldCheckForDependency = false; }
            else {
                // find dependency
                const matches = line.text.match(/"(.*?)"/);

                if (matches)
                    links.push(buildLink(line, lineIndex, matches[1]));

            }

        else
            // check if we are in a dependencies block
            shouldCheckForDependency = /"(.*?)dependencies"/i.test(line.text);


        lineIndex += 1;
    }

    return links;
}

export function jumpToNpmDependencyLinks(context: vscode.ExtensionContext) {
    const disposable = vscode.languages.registerDocumentLinkProvider(['javascript', { pattern: '**/package.json' }], {
        provideDocumentLinks,
    });
    // 注册如何实现跳转到定义，第一个参数表示仅对json文件生效
    context.subscriptions.push(disposable);
};

