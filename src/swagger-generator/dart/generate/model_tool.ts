
/*
 * @Author: zdd
 * @Date: 2023-05-31 22:05:06
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-19 18:43:02
 * @FilePath: /vg-vscode-extension/src/swagger-generator/dart/generate/model.ts
 * @Description: 
 */
import { find, pascalCase } from "@root/utils";
import type { SwaggerPropertyDefinition, SwaggerHttpEndpoint, Responses } from "../../index.d";
import { BASE_TYPE, SwaggerConfig, getDartParamType, getDartSchemaType } from "../../utils";
import ModelGenerate from "./model";


export class MM {
  static gen: ModelGenerate;
}

export function getModelClassContent(name: string, value: any, content: string) {
  content = getParamContent(value.parameters, content);
  content = getReturnTypeContent(value.responses, content, name);
  return content;
}

function getParamContent(parameters: SwaggerHttpEndpoint['parameters'], content: string) {
  if (!parameters) return content;
  for (const p of parameters) {
    if (p['in'] === 'path') continue;
    if (p['in'] === 'header') continue;

    const schema = p.schema;
    if (!schema) continue;
    var resClass;

    if (typeof schema === 'string' && schema.startsWith('#')) {
      // 从 swagger.data 中获取
      resClass = schema.split('/').pop();
      if (resClass) content = MM.gen.generateModel(pascalCase(resClass), content);
    } else if (typeof schema === 'object') {
      resClass = getDartParamType(p);
    }
  }
  return content;
}

function getReturnTypeContent(responses: Responses, content: string, name: string) {
  if (!responses || !responses['200'] || !responses['200'].schema) return content;

  let resClass: string | undefined;
  const schema = responses['200'].schema;
  if (schema.type === 'object' && schema.properties && Object.keys(schema.properties).includes('data')) {
    let rawData: SwaggerPropertyDefinition | undefined = schema.properties['data'];
    if (rawData['anyOf'])
      rawData = find(rawData['anyOf'], item => item.type !== 'null');
    resClass = rawData ? getDartSchemaType(rawData) : undefined;
  } else if (schema.allOf && schema.allOf.length > 1 && schema.allOf[0].$ref?.includes('utils.Result')) {
    // 包装对象返回值
    let rawData: SwaggerPropertyDefinition | undefined = schema.allOf[1].properties['data'];
    if (rawData.allOf && rawData.allOf.length > 1 && rawData.allOf[0].$ref?.includes('utils.PageData')) {
      // 包装分页对象返回值
      rawData = rawData.allOf[1].properties['data'];
      if (rawData.type === 'array')
        rawData = rawData.items;

    }

    if (rawData['anyOf'])
      rawData = find(rawData['anyOf'], item => item.type !== 'null');

    if (rawData && !Array.isArray(rawData))
      resClass = getDartSchemaType(rawData);

  }

  if ((!resClass || BASE_TYPE.includes(resClass as string)) && resClass !== 'Map<String, dynamic>') return content;

  if (resClass.startsWith('List'))
    resClass = resClass.substring(5, resClass.length - 1);

  let _val;
  if (resClass === 'Map<String, dynamic>') {
    resClass = name + 'Resp';
    _val = responses['200'].schema.properties.data;
    if (_val.type === 'array') _val = _val.items;
  }
  try {
    content = MM.gen.generateModel(pascalCase(resClass), content, _val) ?? '';
  } catch (error) {
    SwaggerConfig.addException(`error: [class ${resClass}] generate error, please check orginal swagger.json`);
  }

  return content;
}
