/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 18:06:50
 * @FilePath: /vg-vscode-extension/src/webview/controllers/request.ts
 * @Description: 
 */
import axios, { AxiosRequestConfig } from 'axios';
import { IMessage } from '../type';

export const axiosRequest = async (
  message: IMessage<{
    config: AxiosRequestConfig;
  }>,
) => {
  const res = await axios.request(message.data.config);
  return res.data;
};
