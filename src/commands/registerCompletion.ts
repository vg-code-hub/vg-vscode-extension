/*
 * @Author: zdd
 * @Date: 2023-06-17 17:58:06
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 18:00:44
 * @FilePath: /vg-vscode-extension/src/commands/registerCompletion.ts
 * @Description: 
 */
import * as vscode from 'vscode';
import { compile as compileEjs, getSnippets } from '@root/utils';

let provider: vscode.Disposable;

export const registerCompletion = (context: vscode.ExtensionContext) => {
  if (!vscode.workspace.rootPath) {
    return;
  }
  if (provider) {
    provider.dispose();
  }

  const snippets = getSnippets().filter(
    (s) => !s.preview.notShowInintellisense,
  );
  provider = vscode.languages.registerCompletionItemProvider(
    { pattern: '**', scheme: 'file' },
    {
      provideCompletionItems() {
        const completionItems: vscode.CompletionItem[] = [];
        snippets.map((s) => {
          const completionItem = new vscode.CompletionItem(
            s.name.replace('.ejs', ''),
          );
          completionItem.kind = vscode.CompletionItemKind.Class;
          completionItem.documentation = s.template || 'lowcode';
          try {
            const code = compileEjs(s.template, {} as any);
            // 支持 vscode 本身 Snippet 语法
            completionItem.insertText = new vscode.SnippetString(code);
          } catch {
            // 无法直接通过 ejs 编译，说明模板中需要额外的数据，触发命令打开 webview
            completionItem.insertText = '';
            completionItem.command = {
              command: 'yapi-code.openSnippetByWebview',
              title: '',
              arguments: [s.name, s.template],
            };
          }
          completionItems.push(completionItem);
        });
        return completionItems;
      },
    },
  );
  context.subscriptions.push(provider);
};