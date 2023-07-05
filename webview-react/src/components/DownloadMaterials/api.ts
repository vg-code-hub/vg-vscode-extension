/*
 * @Author: zdd
 * @Date: 2023-07-04 17:31:47
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 17:32:23
 * @FilePath: /vg-vscode-extension/webview-react/src/components/DownloadMaterials/api.ts
 * @Description: 
 */
import { request } from '@umijs/max';

export interface IFetchMaterialRepositoryListResult {
  git: {
    title: string;
    repository: string;
  }[];
  npm: {
    title: string;
    repository: string;
  }[];
}

export function fetchMaterialRepositoryList() {
  return request<IFetchMaterialRepositoryListResult>(
    `https://fastly.jsdelivr.net/gh/lowcoding/material@latest/index.json`,
    {
      method: 'GET',
      skipErrorHandler: true,
    },
  );
}
