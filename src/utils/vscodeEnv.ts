/*
 * @Author: zdd
 * @Date: 2023-06-27 22:01:26
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 10:53:36
 * @FilePath: /vg-vscode-extension/src/utils/vscodeEnv.ts
 * @Description: 
 */
import * as path from 'path';
import { workspace } from 'vscode';

export const rootPath = path.join(workspace.rootPath || '');

export const tempWorkPath = path.join(rootPath, '.vgcode');

export const materialsPath = path.join(rootPath, 'materials');

export const blockMaterialsPath = path.join(rootPath, 'materials', 'blocks');

export const snippetMaterialsPath = path.join(rootPath, 'materials', 'snippets');

export const getEnv = () => ({
  rootPath,
  tempWorkPath,
  materialsPath,
  blockMaterialsPath,
  snippetMaterialsPath,
});

export const checkRootPath = () => {
  if (!rootPath)
    throw new Error('请打开工作目录');

};
