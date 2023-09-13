/*
 * @Author: zdd
 * @Date: 2023-06-01 16:59:31
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-13 17:14:52
 * @FilePath: /vg-vscode-extension/src/swagger-generator/utils/common.ts
 * @Description:
 */
import { JSONSchema, SwaggerHttpEndpoint, SwaggerParameter } from '../index.d';
import { exchangeZhToEn } from './helper';
import { first, join, snakeCase, pascalCase, camelCase } from '@root/utils';

/** tab 空格数 */
export const INDENT = '  ';

export const DART_TYPE = ['String', 'int', 'double', 'bool', 'num', 'DateTime', 'dynamic', 'Map<String, dynamic>', 'List'];
export const TS_TYPE = ['string', 'number', 'boolean', 'null', 'undefined', 'File', 'Record<string, any>', 'any', 'any[]'];

export const METHOD_MAP = {
  get: 'get',
  post: 'create',
  put: 'update',
  delete: 'delete',
};
interface TypeParam {
  key?: string;
  property?: JSONSchema;
  param?: SwaggerParameter;
}

export function getClassName(name: string, isReq = true) {
  return pascalCase(name + (isReq ? '_req' : '_res'));
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
      const items = property!['items'];
      if (!items) return 'any[]';
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
    case 'file':
      return 'File';
    case 'object':
      if (!subClass) return 'dynamic';
      return subClass;
    case 'array':
      const items = property!['items'];
      if (!items) return 'List';
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

export const getDirPath = (folder: string | undefined, { translationObj, rootPath }: any) => {
  let dirPath: string,
    deeps = 1,
    className: string;
  if (folder) {
    const { str: path } = exchangeZhToEn(folder, translationObj);
    dirPath = join(
      rootPath,
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
    dirPath = join(rootPath);
    className = pascalCase('request');
  }

  return {
    className,
    dirPath,
    deeps,
  };
};

export const isStandardResponse = (response?: JSONSchema) => {
  if (typeof response !== 'object') return undefined;
  if (response.allOf && response.allOf.length > 1 && response.allOf[0].$ref?.endsWith('utils.Result')) return response.allOf[1].properties!['data'];
  if (typeof response === 'object' && response.type === 'object' && response.properties && Object.keys(response.properties).includes('data'))
    return response.properties!['data'];
  return undefined;
};

export const isPaginationResponse = (standardResponse: JSONSchema) => {
  if (standardResponse.properties && Object.keys(standardResponse.properties).includes('list') && standardResponse.properties['list'].type === 'array')
    return standardResponse!['properties']!['list'];
  if (standardResponse.allOf && standardResponse.allOf.length > 1 && standardResponse.allOf[0].$ref?.endsWith('utils.PageData'))
    return standardResponse.allOf[1].properties!['data'];
  return undefined;
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
