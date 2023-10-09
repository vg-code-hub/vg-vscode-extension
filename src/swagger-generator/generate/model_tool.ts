/*
 * @Author: zdd
 * @Date: 2023-05-31 22:05:06
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-08 21:39:59
 * @FilePath: /vg-vscode-extension/src/swagger-generator/generate/model_tool.ts
 * @Description:
 */
import { pascalCase } from '@root/utils';
import type { SwaggerHttpEndpoint, JSONSchema, FilesMapModel } from '../index.d';
import { SwaggerGenTool, getClassName } from '../utils';
import ModelGenerate from './model';

export class MM {
  static gen = new ModelGenerate();
}

export function getModelClassContent(name: string, value: SwaggerHttpEndpoint, content: FilesMapModel) {
  content = getParamContent(value.parameters, content, getClassName(name));
  content = getReturnTypeContent(value.successResponse, content, getClassName(name, false));
  return content;
}

function getParamContent(parameters: SwaggerHttpEndpoint['parameters'], content: FilesMapModel, name: string) {
  if (!parameters) return content;
  for (const p of parameters) {
    if (p['in'] === 'path') continue;
    if (p['in'] === 'header') continue;
    if (p['in'] === 'formData') continue;

    const schema = p.schema;
    if (!schema) continue;
    var resClass;

    if (typeof schema === 'object') {
      resClass = SwaggerGenTool.implementor.getSchameType({ param: p, key: name });
      if (!SwaggerGenTool.implementor.baseTypes.includes(resClass)) content = MM.gen.generateModel(pascalCase(resClass), content, p.schema);
    }
  }
  return content;
}

function getReturnTypeContent(responses: JSONSchema | undefined, content: FilesMapModel, name: string) {
  const { baseTypes } = SwaggerGenTool.implementor;
  let resClass = SwaggerGenTool.implementor.getSimpleReturnType(responses, name);
  if (baseTypes.includes(resClass as string)) return content;

  let standardRes: JSONSchema | undefined = SwaggerGenTool.getStandardResponse(responses);
  content = MM.gen.generateModel(pascalCase(resClass), content, standardRes) ?? '';
  return content;
}
