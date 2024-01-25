/*
 * @Author: zdd
 * @Date: 2023-06-01 16:59:31
 * @LastEditors: zdd dongdong@grizzlychina.com
 * @LastEditTime: 2024-01-25 18:33:20
 * @FilePath: common.ts
 * @Description:
 */
import { JSONSchema, SwaggerHttpEndpoint, SwaggerParameter } from '../index.d';
import SwaggerGenTool from './gen_tool';
import { exchangeZhToEn } from './helper';
import { first, join, snakeCase, pascalCase, camelCase, rootPath } from '@root/utils';

/** tab 空格数 */
export const INDENT = '  ';
export const LIST_KEY = 'items';

export const DART_TYPE = ['String', 'int', 'double', 'bool', 'num', 'DateTime', 'dynamic', 'null', 'FormData', 'Map<String, dynamic>', 'List'];
export const TS_TYPE = ['string', 'number', 'boolean', 'null', 'undefined', 'File', 'Record<string, any>', 'any', 'any[]'];

export const METHOD_MAP = {
  get: 'get',
  post: 'create',
  put: 'update',
  delete: 'delete',
};
export interface TypeParam {
  key?: string;
  property?: JSONSchema;
  param?: SwaggerParameter;
}

export function getClassName(name: string, isReq = true) {
  return pascalCase(name.replace(/^(v1|v2|\d+)/, '') + (isReq ? '_req' : '_res'));
}

export function filterPathName(strs: string[]) {
  let res: string = '';
  for (let i = strs.length - 1; i >= 0; i--) {
    if (res.includes(camelCase(strs[i]))) continue;
    res = camelCase(strs[i]) + '_' + res;
  }

  return pascalCase(res);
}

function getRef({ property, param }: TypeParam) {
  let ref: string | undefined = '';
  if (property && property['$ref']) ref = property['$ref'];
  if (param && param.schema && Object.prototype.hasOwnProperty.call(param.schema, '$ref')) ref = (param.schema as JSONSchema)['$ref'];

  if (ref) {
    const parts = ref.split('/');
    const typeName = parts[parts.length - 1];
    return getModelName(typeName);
  }
  return undefined;
}

function calcTypeParam({ key, property, param }: TypeParam) {
  const subClass = key ? pascalCase(key) : undefined;
  function getCuncrrentType(type: JSONSchema['type']) {
    if (!type) return undefined;
    return Array.isArray(type) ? first(type) : type;
  }

  let type: string | undefined;
  if (property) {
    //TODO: allOf property 获取第一项
    if (property.allOf) property = property.allOf[0];
    type = getCuncrrentType(property.type);
  } else if (param) {
    const schema = param.schema;
    property = schema;
    if (param.type) type = getCuncrrentType(param.type);
    else if (!schema) type = '';
    else type = typeof schema === 'string' ? schema : getCuncrrentType(schema.type);
  }
  return { type, property, subClass };
}

export function getTsType({ key, property, param }: TypeParam): string {
  const { type, property: _property, subClass } = calcTypeParam({ key, property, param });
  property = _property;
  switch (type) {
    case 'integer':
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'file':
      return 'File';
    case 'object':
      if (!subClass) return 'any';
      return subClass;
    case 'array':
      if (!property) return 'any[]';

      const items = property!['items'];
      if (!items || items.type === 'array') return 'any[]';
      let item = items;
      //TODO: 目前仅支持单一类型
      if (Array.isArray(items) && items.length > 0) item = items[0];
      var itemType = getTsType({ key: key, property: item as JSONSchema });
      return `${itemType}[]`;
    default:
      const ref = getRef({ param, property });
      if (ref) return ref;
  }

  return 'any';
}

export function getDartType({ key, property, param }: TypeParam): string {
  const { type, property: _property, subClass } = calcTypeParam({ key, property, param });
  property = _property;

  switch (type) {
    case 'integer':
      return 'int';
    case 'number':
      return 'num';
    case 'string':
      return 'String';
    case 'boolean':
      return 'bool';
    case 'null':
      return 'null';
    case 'file':
      return 'File';
    case 'object':
      if (!subClass) return 'dynamic';
      return subClass;
    case 'array':
      const items = property!['items'];
      if (!items || items.type === 'array') return 'List';
      let item = items;
      /// 目前仅支持单一类型
      if (Array.isArray(items) && items.length > 0) item = items[0];
      var itemType = getDartType({ key: key, property: item as JSONSchema });
      return `List<${itemType}>`;
    default:
      const ref = getRef({ param, property });
      if (ref) return ref;
  }

  return 'dynamic';
}

export const getDirPath = (folder: string | undefined) => {
  let dirPath: string,
    deeps = 1,
    className: string;
  const translationObj = SwaggerGenTool.translationObj;
  const targetDir = SwaggerGenTool.targetDirectory;
  if (folder) {
    const { str: path } = exchangeZhToEn(folder, translationObj);
    dirPath = join(
      targetDir,
      path
        .split('/')
        .map((e) => snakeCase(e))
        .join('/')
    );
    deeps += path.split('/').length;
    className = pascalCase(
      path
        .split('/')
        .map((e) => snakeCase(e))
        .join('_') + '_request'
    );
  } else {
    dirPath = join(targetDir);
    className = pascalCase('request');
  }

  return {
    className,
    dirPath,
    deeps,
  };
};

export function getParamObj(parameters: SwaggerHttpEndpoint['parameters']) {
  if (!parameters) return undefined;
  const pathParams = parameters.filter((p) => p['in'] === 'path');
  const queryParams = parameters.filter((p) => p['in'] === 'query');
  const formDataParams = parameters.filter((p) => p['in'] === 'formData');
  const bodyParams = parameters.filter((p) => p['in'] === 'body');

  return {
    pathParams,
    queryParams,
    formDataParams,
    bodyParams,
  };
}

export function getResSchema(schema: JSONSchema) {
  let _val = (schema as JSONSchema).properties?.data;
  if (_val && _val.type === 'array') _val = _val.items;
  return _val;
}

export function getModelName(key: string) {
  let className;
  if (!key.includes('.')) {
    className = pascalCase(key);
  } else {
    const [a, b] = key.split('.');
    if (/^v\d+$/i.test(a) || ['api'].includes(a) || RegExp(`^${a}`, 'i').test(b)) className = pascalCase(b);
    else className = pascalCase(a + '_' + b);
  }
  return className;
}
