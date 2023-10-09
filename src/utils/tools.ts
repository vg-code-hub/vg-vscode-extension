/*
 * @Author: jimmyZhao
 * @Date: 2023-07-28 10:27:11
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-08 21:00:52
 * @FilePath: /vg-vscode-extension/src/utils/tools.ts
 * @Description:
 */
import * as vscode from 'vscode';
import * as fs from 'fs';
import { camelCase, isEmpty, isNil, upperFirst } from 'lodash';
import type { PageType } from '../type.d';

/**
 * @description: getRootPath(undefined) 获取根路径
 * @param {vscode} resource
 * @return {*}
 */
export function getRootPath(resource?: vscode.Uri): string {
  let path: string | undefined;
  let workspace = vscode.workspace;
  if (!workspace.workspaceFolders) {
    path = workspace.rootPath;
  } else {
    let root: vscode.WorkspaceFolder | undefined;
    if (workspace.workspaceFolders.length === 1) root = workspace.workspaceFolders[0];
    else if (resource !== null) root = workspace.getWorkspaceFolder(resource!);

    path = root?.uri.fsPath;
  }
  if (!path) throw Error('请打开工作目录');
  return path;
}

export function readFileSyncToObj(uri: string): Record<string, any> {
  try {
    let file = fs.readFileSync(uri);
    return JSON.parse(file.toString());
  } catch (error) {
    return {};
  }
}

export const writeFile = (file: fs.PathOrFileDescriptor, data: string | NodeJS.ArrayBufferView, options: fs.WriteFileOptions) =>
  fs.writeFile(file, data, options, () => {});

export function promptForPageName(): Thenable<string | undefined> {
  const namePromptOptions: vscode.InputBoxOptions = {
    prompt: 'Input Page Name',
    // placeHolder: "counter",
  };
  return vscode.window.showInputBox(namePromptOptions);
}

export async function promptForPageTypePick(): Promise<PageType> {
  const options: vscode.QuickPickOptions = {
    title: 'Select page type',
    canPickMany: false,
  };

  const items = ['normal', 'refresh list', 'form'];

  return vscode.window.showQuickPick(items, options).then((value) => {
    if (isNil(value) || isEmpty(value)) return 'normal';

    return value as PageType;
  });
}

async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: vscode.OpenDialogOptions = {
    canSelectMany: false,
    openLabel: 'Select a folder to create the page in',
    canSelectFolders: true,
  };

  return vscode.window.showOpenDialog(options).then((uri) => {
    if (isNil(uri) || isEmpty(uri)) return undefined;

    return uri[0].fsPath;
  });
}

export const formatPath = (path: string = '') => {
  const isWin32 = path.startsWith('/') && process.platform.toLowerCase().includes('win32');
  if (isWin32) path = path.substring(1);
  return path;
};

export { join, resolve } from 'path';
export { mkdirpSync, mkdirp } from 'mkdirp';
export { existsSync, writeFileSync, readFileSync, readdirSync, statSync, readFile, unlinkSync, readdir, stat, appendFileSync, rmSync, rmdirSync } from 'fs';
export { find, first, isEmpty, isNil, isRegExp, camelCase, kebabCase, snakeCase, upperFirst, upperCase, lowerCase, lowerFirst } from 'lodash';

export const pascalCase = (str: string) => upperFirst(camelCase(str));
