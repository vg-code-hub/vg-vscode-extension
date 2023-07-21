/*
 * @Author: zdd
 * @Date: 2023-06-17 09:26:40
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-19 20:08:08
 * @FilePath: /vg-vscode-extension/src/commands/common.ts
 * @Description: 
 */
import * as vscode from 'vscode';
import { TextEditor, TextEditorEdit } from 'vscode';
import { getClipboardText, pasteToEditor } from '../utils/editor';
import { jsonIsValid, jsonParse } from '../utils/json';
import { compile } from '../utils/ejs';
import { refreshIntelliSense } from '../webview/controllers/intelliSense';
import { showWebView } from '../webview';

export const commonCommands = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.refreshIntelliSense', () => {
      // 刷新代码智能提示
      refreshIntelliSense();
    }),
    vscode.commands.registerCommand(
      "extension.generateCodeByWebview",
      (args) => {
        showWebView(context, {
          key: 'main',
          viewColumn: vscode.ViewColumn.One,
        });
      }
    ),
    vscode.commands.registerTextEditorCommand(
      'extension.openSnippetByWebview',
      (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => {
        const name = args[0];
        const template = args[1];

        const rawClipboardText = getClipboardText();
        let clipboardText = rawClipboardText.trim();
        clipboardText = JSON.stringify(jsonParse(clipboardText));

        const validJson = jsonIsValid(clipboardText);
        if (validJson)
          try {
            const code = compile(template, JSON.parse(clipboardText));
            pasteToEditor(code);
          } catch {
            showWebView(context, {
              key: 'main',
              task: {
                task: 'openSnippet',
                data: { name },
              },
            });
          }
        else
          showWebView(context, {
            key: 'main',
            task: {
              task: 'openSnippet',
              data: { name },
            },
          });

      },
    ),
    vscode.commands.registerCommand('extension.openScaffold', () => {
      showWebView(context, {
        key: 'createApp',
        title: '创建应用',
        viewColumn: vscode.ViewColumn.One,
        task: { task: 'route', data: { path: '/scaffold' } },
      });
    }),
    vscode.commands.registerCommand('extension.openConfig', () => {
      showWebView(context, {
        key: 'main',
        title: '项目配置',
        task: { task: 'route', data: { path: '/config' } },
      });
    }),
  );
};
