/*
 * @Author: zdd
 * @Date: 2023-06-01 16:31:38
 * @LastEditors: zdd dongdong@grizzlychina.com
 * @LastEditTime: 2024-09-13 15:13:03
 * @FilePath: index.ts
 * @Description:
 */
import axios from 'axios';

import { Swagger } from '../index.d';
import { pascalCase } from '@root/utils';
import { getModelName } from '../utils';

export async function getSimpleData(url: string): Promise<Swagger> {
  try {
    const { data } = await axios.get(url);
    if (data.swagger?.split('.')[0] - 0 !== 2) swagger3to2(data);

    return {
      jsonUrl: url,
      info: data.info,
      tags: data.tags,
      paths: data.paths,
      data: data.definitions,
    };
  } catch (error) {
    const info = `服务地址可能错误，导致未能正确获取信息。（${url}）`;
    console.log(`\x1B[31m${info}\x1B[39m`);
    throw Error(info);
  }
}

export const swagger3to2 = (data: any) => {
  let schemas = data.components.schemas;
  let paths = data.paths;

  if (schemas)
    for (let key in schemas) {
      let className = getModelName(key);
      delete schemas[key]['x-apifox-orders'];
      delete schemas[key]['x-apifox-ignore-properties'];
      if (className !== key) {
        schemas[className] = Object.assign({}, schemas[key]);
        delete schemas[key];
      }
    }

  data.definitions = schemas;
  if (paths)
    for (let key in paths) {
      let pathData = paths[key];
      for (let method in pathData) {
        let methodData = pathData[method];
        methodData.parameters = methodData.parameters || [];
        if (methodData.requestBody) {
          const { content } = methodData.requestBody;
          for (let contentType in content)
            if (contentType === 'application/json')
              methodData.parameters.push({
                in: 'body',
                contentType,
                required: true,
                schema: content[contentType].schema,
              });
            else if (contentType === 'multipart/form-data')
              methodData.parameters.push({
                in: 'formData',
                contentType,
                required: true,
                schema: content[contentType].schema,
              });
            else if (contentType === 'application/x-www-form-urlencoded')
              methodData.parameters.push({
                in: 'formData',
                contentType,
                required: true,
                schema: content[contentType].schema,
              });
        }
        if (methodData.responses) {
          let keys = Object.keys(methodData.responses['200']?.content || {});
          if (keys.includes('application/json')) {
            methodData.successResponse = methodData.responses['200']?.content['application/json'].schema;
            delete methodData.responses;
            delete methodData.successResponse['x-apifox-orders'];
            delete methodData.successResponse['x-apifox-ignore-properties'];
          } else if (keys.includes('*/*')) {
            methodData.successResponse = methodData.responses['200']?.content['*/*'].schema;
            delete methodData.responses;
            delete methodData.successResponse['x-apifox-orders'];
            delete methodData.successResponse['x-apifox-ignore-properties'];
          }
        }
      }
    }

  data.components && delete data.components;
};
