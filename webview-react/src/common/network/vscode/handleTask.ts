/*
 * @Author: zdd
 * @Date: 2023-06-28 18:00:57
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-06 12:34:59
 * @FilePath: /vg-vscode-extension/webview-react/src/common/network/vscode/handleTask.ts
 * @Description: 
 */

import { history } from "@umijs/max";

export const taskHandler: {
  [propName: string]: (data: any) => void;
} = {
  addSnippets: (data?: { content?: string }) => {
    localStorage.setItem('addSnippets', data?.content || '');
    history.push(`/material-create`);
  },
  openSnippet: (data: { name: string }) => {
    history.push(`/material-detail/${data.name}`);
  },
  route: (data: { path: string }) => {
    history.push(data.path);
  },
  updateSelectedFolder: (data: { selectedFolder: string }) => {
    localStorage.setItem('selectedFolder', data.selectedFolder || '');
    history.push('/snippets');
  },
};
