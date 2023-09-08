/*
 * @Author: zdd
 * @Date: 2023-05-31 22:05:06
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-07 11:35:03
 * @FilePath: /vg-vscode-extension/src/swagger-generator/dart/generate/model_tool.ts
 * @Description:
 */
import { find, pascalCase } from '@root/utils';
import type { SwaggerHttpEndpoint, JSONSchema } from '../../index.d';
import { DART_TYPE, getClassName, getDartType, getResSchema, isPaginationResponse, isStandardResponse } from '../../utils';
import ModelGenerate from './model';

export class MM {
  static gen: ModelGenerate;
}

export function getModelClassContent(name: string, value: SwaggerHttpEndpoint, content: string) {
  content = getParamContent(value.parameters, content, getClassName(name));
  content = getReturnTypeContent(value.successResponse, content, getClassName(name, false));
  return content;
}

function getParamContent(parameters: SwaggerHttpEndpoint['parameters'], content: string, name: string) {
  if (!parameters) return content;
  for (const p of parameters) {
    if (p['in'] === 'path') continue;
    if (p['in'] === 'header') continue;
    if (p['in'] === 'formData') continue;

    const schema = p.schema;
    if (!schema) continue;
    var resClass;

    if (typeof schema === 'object') {
      resClass = getDartType({ param: p, key: name });
      if (resClass && !DART_TYPE.includes(resClass)) content = MM.gen.generateModel(pascalCase(resClass), content, p.schema);
    }
  }
  return content;
}

function getReturnTypeContent(responses: JSONSchema | undefined, content: string, name: string) {
  if (!responses) return content;

  let resClass: string | undefined,
    isPagination = false;
  const schema = responses!;
  let standardRes: JSONSchema | undefined = isStandardResponse(responses);
  if (standardRes) {
    const pageData = isPaginationResponse(standardRes);
    if (pageData) {
      standardRes = pageData;
      isPagination = true;
    }

    if (standardRes['anyOf']) standardRes = find(standardRes['anyOf'], (item) => item.type !== 'null');
    resClass = standardRes ? getDartType({ property: standardRes, key: name }) : undefined;
  } else {
    resClass = 'any';
  }
  resClass = arrayClass(resClass!);

  if (!resClass || DART_TYPE.includes(resClass as string)) return content;
  content = MM.gen.generateModel(pascalCase(resClass), content, getResSchema(schema as JSONSchema)) ?? '';

  return content;
}

export function arrayClass(name: string) {
  return name.startsWith('List<') ? name.substring(5, name.length - 1) : name;
}
