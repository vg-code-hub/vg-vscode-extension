/*
 * @Author: zdd
 * @Date: 2023-06-27 22:01:26
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 16:09:39
 * @FilePath: /vg-vscode-extension/src/utils/request.ts
 * @Description:
 */
import axios from 'axios';
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: true,
});

https.globalAgent.options.rejectUnauthorized = false;

interface IApiDetailInfo {
  data: {
    query_path: { path: string };
    path: string;
    method: string;
    title: string;
    project_id: number;
    req_params: {
      name: string;
      desc: string;
    }[];
    _id: number;
    req_query: { required: '0' | '1'; name: string }[];
    res_body_type: 'raw' | 'json';
    res_body: string;
    req_body_other: string;
    username: string;
  };
}

export const fetchApiDetailInfo = (domain: string, id: string, token: string) => {
  const url = domain.endsWith('/') ? `${domain}api/interface/get?id=${id}&token=${token}` : `${domain}/api/interface/get?id=${id}&token=${token}`;
  return axios.get<IApiDetailInfo>(url, { httpsAgent: agent });
};

export const fetchScaffolds = (url: string) => axios.get(url);
