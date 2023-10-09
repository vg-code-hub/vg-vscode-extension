/*
 * @Author: zdd
 * @Date: 2023-06-17 17:58:06
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-08 20:56:00
 * @FilePath: /vg-vscode-extension/src/commands/registerCompletion.ts
 * @Description:
 */
import * as vscode from 'vscode';
import { compile as compileEjs, getLocalMaterials, rootPath, tempGlobalDir } from '../utils';

let provider: vscode.Disposable;

export const registerCompletion = (context: vscode.ExtensionContext) => {
  if (!rootPath) return;

  if (provider) provider.dispose();

  const snippets = getLocalMaterials(tempGlobalDir.snippetMaterials).filter((s) => !s.preview.notShowInintellisense);
  provider = vscode.languages.registerCompletionItemProvider(
    { pattern: '**', scheme: 'file' },
    {
      provideCompletionItems() {
        const completionItems: vscode.CompletionItem[] = [];
        snippets.map((s) => {
          const title = s.name.replace('.ejs', '');
          const completionItem = new vscode.CompletionItem(title);
          completionItem.kind = vscode.CompletionItemKind.Class;
          completionItem.documentation = s.template || 'vgcode';
          try {
            const code = compileEjs(s.template, {} as any);
            // 支持 vscode 本身 Snippet 语法
            completionItem.insertText = new vscode.SnippetString(code);
          } catch {
            // 无法直接通过 ejs 编译，说明模板中需要额外的数据，触发命令打开 webview
            completionItem.insertText = '';
            completionItem.command = {
              command: 'extension.openSnippetByWebview',
              title,
              arguments: [s.name, s.template],
            };
          }
          completionItems.push(completionItem);
        });
        return completionItems;
      },
    }
  );
  context.subscriptions.push(provider);
};
