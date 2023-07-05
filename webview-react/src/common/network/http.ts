/*
 * @Author: zdd
 * @Date: 2023-05-19 12:07:53
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 16:14:23
 * @FilePath: /vg-vscode-extension/webview-react/src/common/network/http.ts
 * @Description:
 */

import { request } from '@umijs/max';

function download(url: string, params?: Record<string, any>) {
  return request(url, {
    responseType: 'blob',
    params,
  });
}

const http = {
  get: (url: string, params?: any) => request(url, { params }),
  post: (url: string, data?: Record<string, any>) =>
    request(url, { data, method: 'POST' }),
  put: (url: string, data?: Record<string, any>) =>
    request(url, { data, method: 'PUT' }),
  delete: (url: string, data?: Record<string, any>) =>
    request(url, { method: 'DELETE', data }),
  download,
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload/file', { method: 'POST', data: formData });
  },
};

export default http;

export function createHttpService(options: { getUrl: (v: string) => string }) {
  const { getUrl } = options;

  const doReq = (url: string, o: any) => {
    return request(getUrl(url), o);
  };

  const downloadReq = (url: string, params?: Record<string, any>) => {
    return http.download(getUrl(url), params);
  };

  const instance = {
    get: (url: string, params?: any) => doReq(url, { params }),
    post: (url: string, data?: Record<string, any>) =>
      doReq(url, { data, method: 'POST' }),
    put: (url: string, data?: Record<string, any>) =>
      doReq(url, { data, method: 'PUT' }),
    delete: (url: string, data?: Record<string, any>) =>
      doReq(url, { data, method: 'DELETE' }),
    download: downloadReq,
    upload: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return doReq('/upload/file', { method: 'POST', data: formData });
    },
  };

  return instance;
}

export interface Response {
  data: string;
  status: number;
  success: boolean;
}

export * from './vscode'