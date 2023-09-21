/*
 * @Author: zdd
 * @Date: 2023-05-31 22:05:06
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-16 08:57:18
 * @FilePath: /vg-vscode-extension/src/swagger-generator/dart/generate/model_tool.ts
 * @Description:
 */
import { find, pascalCase } from '@root/utils';
import type { SwaggerHttpEndpoint, JSONSchema } from '../../index.d';
import { DART_TYPE, SwaggerGenTool, getClassName, getDartType, getResSchema } from '../../utils';
import ModelGenerate from './model';

export class MM {
  static gen = new ModelGenerate();
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

  let resClass: string | undefined;
  let standardRes: JSONSchema | undefined = SwaggerGenTool.getStandardResponse(responses);
  if (standardRes) {
    const pageData = SwaggerGenTool.getPageResponse(standardRes);
    if (pageData) standardRes = pageData;

    if (standardRes['anyOf']) standardRes = find(standardRes['anyOf'], (item) => item.type !== 'null');
    resClass = standardRes ? getDartType({ property: standardRes, key: name }) : undefined;
  } else {
    resClass = 'any';
  }
  resClass = arrayClass(resClass!);

  if (!resClass || DART_TYPE.includes(resClass as string)) return content;
  content = MM.gen.generateModel(pascalCase(resClass), content, standardRes) ?? '';

  return content;
}

export function arrayClass(name: string) {
  return name.startsWith('List<') ? name.substring(5, name.length - 1) : name;
}
