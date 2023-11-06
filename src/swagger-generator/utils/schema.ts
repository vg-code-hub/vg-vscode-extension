/*
 * @Author: zdd
 * @Date: 2023-07-20 11:44:45
 * @LastEditors: zdd
 * @LastEditTime: 2023-11-06 14:44:48
 * @FilePath: /vg-vscode-extension/src/swagger-generator/utils/schema.ts
 * @Description:
 */
import { camelCase, find, first, isRegExp, rootPath } from '@root/utils';
import { SwaggerGenTool, getDirPath, METHOD_MAP, filterPathName, getClassName, getDartType, getParamObj, DART_TYPE, getResSchema } from '../utils';
import type { JSONSchema, Method, ProjectType, SwaggerHttpEndpoint, SwaggerPath } from '@root/swagger-generator/index.d';

export class SwaggerSchema {
  data: Record<string, JSONSchema>;
  paths: SwaggerPath;
  rootName: ProjectType = 'requests';

  constructor(data: Record<string, JSONSchema>, paths: SwaggerPath) {
    this.data = data;
    this.paths = paths;
  }

  static async fromTargetDirectory() {
    const { data, paths } = await SwaggerGenTool.reqSwaggerData(true);
    return new SwaggerSchema(data, paths);
  }

  getLocalSchemas() {
    const filesMap: Record<string, [api: Request[], model: Model[]]> = {};
    const { customPathFolder } = SwaggerGenTool.config;

    for (let key in this.paths)
      for (let method in this.paths[key]) {
        const value = this.paths[key][method as Method];
        let folder;
        if (customPathFolder)
          for (const customKey of customPathFolder.keys())
            if (isRegExp(customKey) && customKey.test(key)) {
              folder = customPathFolder.get(customKey);
              break;
            } else if (!isRegExp(customKey) && key.startsWith(customKey)) {
              folder = customPathFolder.get(customKey);
              break;
            }

        if (!folder) {
          folder = value['x-apifox-folder'];
          if (!folder && value.tags && value.tags.length > 0) folder = value.tags[0];
          if (!SwaggerGenTool.testFolder(folder ?? '')) return;
          folder = SwaggerGenTool.exchangeConfigMap(folder);
        }
        let { dirPath } = getDirPath(folder);
        dirPath = dirPath.replace(SwaggerGenTool.targetDirectory, '');
        const _temp = key
          .split('/')
          .map((e) => camelCase(e))
          .filter((e) => !['create', 'delete', 'update', 'v1', ''].includes(e));
        const keyLast = _temp.join('_');
        if (!keyLast) return;

        const methodName = camelCase(METHOD_MAP[method as Method] + '_' + keyLast);
        if (!filesMap[dirPath]) filesMap[dirPath] = [[], []];
        var _name = filterPathName(_temp);
        const reqClassName = getClassName(_name);
        const returnType = this.getReturnType(value.successResponse, getClassName(_name, false));
        const { pathParams, body, formData, queryParams } = this.getParams(value.parameters, reqClassName);
        const { summary, description } = value;
        // 暂时只处理 returnType 和 bodyType
        this.calcModelArr(filesMap[dirPath][1], returnType?.type, returnType?.schema);
        this.calcModelArr(filesMap[dirPath][1], body?.type, body?.schema);

        delete returnType?.schema;
        delete body?.schema;
        filesMap[dirPath][0].push({ path: key, methodName, pathParams, queryParams, body, formData, returnType, summary, description });
      }

    console.log(filesMap);

    return filesMap;
  }

  private calcModelArr(arr: Model[], modelName?: string, schema?: JSONSchema) {
    if (!modelName || DART_TYPE.includes(modelName)) return;
    if (find(arr, { name: modelName })) return;
    if (this.data[modelName]) {
      arr.push({
        name: modelName,
        schema: this.data[modelName],
      });
      this.checkSubGen(arr, this.data[modelName]['properties']);
    } else if (schema) {
      arr.push({
        name: modelName,
        schema: schema,
      });
      this.checkSubGen(arr, schema['properties']);
    }
  }

  private checkSubGen(arr: Model[], properties: JSONSchema['properties']) {
    if (!properties) return;
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const dartType = getDartType({ key: propertyName, property });
      if (dartType.startsWith('List')) {
        var subType = dartType.substring(5, dartType.length - 1);
        if (!DART_TYPE.includes(subType)) this.calcModelArr(arr, subType, property.items);
      } else if (!DART_TYPE.includes(dartType)) {
        this.calcModelArr(arr, dartType, property);
      }
    }
  }

  private getReturnType(responses: JSONSchema | undefined, resClassName: string) {
    if (!responses) return undefined;
    let resClass: string | undefined,
      schema = responses;
    let [standardRes, isPagination] = SwaggerGenTool.getStandardResponse(responses);
    if (standardRes) {
      if (standardRes['anyOf']) standardRes = find(standardRes['anyOf'], (item) => item.type !== 'null');
      resClass = standardRes ? getDartType({ property: standardRes, key: resClassName }) : undefined;
    } else {
      resClass = 'dynamic';
    }

    if (!resClass) return undefined;
    return { type: SwaggerGenTool.implementor.arraySubClass(resClass), isPagination, isList: resClass.startsWith('List<'), schema: getResSchema(schema) };
  }

  private getParams(parameters: SwaggerHttpEndpoint['parameters'], reqClassName: string) {
    const data = getParamObj(parameters);
    if (!data) return {};
    const { pathParams, queryParams, formDataParams, bodyParams } = data;

    const _pathParams = pathParams.map((p) => {
      const name = camelCase(p.name);
      const type = getDartType({ param: p });

      const description = p?.description;
      return {
        name,
        type,
        description,
        require: true,
      };
    });

    const _queryParams = queryParams.map((p) => {
      const name = camelCase(p.name);
      const type = getDartType({ param: p });
      const require = p['required'];
      const description = p?.description;
      return {
        name,
        type,
        description,
        require,
      };
    });

    let formData;
    if (formDataParams.length > 0) {
      const description = formDataParams[0]?.description;
      formData = {
        name: 'body',
        type: 'FormData',
        require: true,
        description,
      };
    }

    let body;
    if (bodyParams.length > 0) {
      const p = first(bodyParams)!;
      const type = getDartType({ param: p, key: reqClassName });
      const require = p['required'];
      const description = formDataParams[0]?.description;
      const schema = p.schema;
      body = {
        name: 'body',
        type,
        require,
        description,
        schema,
      };
    }

    return { formData, body, pathParams: _pathParams, queryParams: _queryParams };
  }
}

interface Model {
  name: string;
  schema: JSONSchema;
}

interface Params {
  name: string;
  type: string;
  require: boolean;
  description?: string;
  schema?: JSONSchema;
}

interface Request {
  summary?: string;
  description?: string;
  path: string;
  methodName: string;
  pathParams?: Params[];
  queryParams?: Params[];
  body?: Params;
  formData?: Params;
  returnType?: {
    type: string;
    isPagination: boolean;
    isList: boolean;
    schema?: JSONSchema;
  };
}
