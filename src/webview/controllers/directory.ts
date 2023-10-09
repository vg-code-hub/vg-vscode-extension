/*
 * @Author: jimmyZhao
 * @Date: 2023-07-28 10:27:11
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-08 21:02:53
 * @FilePath: /vg-vscode-extension/src/webview/controllers/directory.ts
 * @Description:
 */
import * as dirTree from 'directory-tree';
import { rootPath } from '@root/utils';

export const getDirectoryTree = () => {
  const filteredTree = dirTree(rootPath, {
    exclude: /node_modules|\.umi|\.git/,
  });
  return filteredTree;
};
