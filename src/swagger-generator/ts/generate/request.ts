import { isRegExp, find, first, join, mkdirpSync, existsSync, writeFileSync, writeFile, snakeCase, camelCase, upperFirst, pascalCase } from '@root/utils';
import type { JSONSchema, SwaggerPath, Method, SwaggerHttpEndpoint } from '../../index.d';
import {
  TS_TYPE,
  INDENT,
  SwaggerConfig,
  getDirPath,
  getTsType,
  getClassName,
  filterPathName,
  isStandardResponse,
  isPaginationResponse,
  getParamObj,
} from '../../utils';
import { getModelClassContent } from './model_tool';

const METHOD_MAP = {
  get: 'get',
  post: 'create',
  put: 'update',
  delete: 'delete',
};

const rootName = 'requests';

const getReturnType = (resClass?: string, isPagination = false) => {
  if (!resClass) return undefined;
  if (resClass.endsWith('[]')) {
    const subType = resClass.substring(0, resClass.length - 2);
    const type = TS_TYPE.includes(subType) ? `${subType}` : `models.${subType}`;
    return isPagination ? `PageResp<${type}>` : `${type}[]`;
  }

  return (resClass = TS_TYPE.includes(resClass) ? resClass : `models.${resClass}`);
};

class RequestGenerate {
  paths: SwaggerPath;
  filesMap: Record<string, [api: string, model: string]>;
  overwrite = SwaggerConfig.config.overwrite ?? false;

  get modelHeader(): string {
    return `// This file is generated by the VG SwaggerGenerator.
// ${
      this.overwrite
        ? 'Do not edit, next time generation will overwrite it!'
        : 'Next time generation will not overwrite it, but instead generate a suffix of (.vg) file with the same name.'
    }`;
  }
  constructor(paths: SwaggerPath) {
    this.paths = paths;
    this.filesMap = {};
  }

  async generateAllRequest() {
    for (let key in this.paths) for (let method in this.paths[key]) this.generateRequest(key, method as Method, this.paths[key][method as Method]) + '\n';

    let str = '';
    const requestsDir = join(SwaggerConfig.config.rootPath);

    // request内容写入
    for (let key in this.filesMap) {
      let modelEmpty = false;
      let [apiContent, modelContent] = this.filesMap[key];
      if (modelContent === this.modelHeader) modelEmpty = true;
      str += `export * from '.${key.replace(requestsDir, '')}/request.g';\n`;
      if (!modelEmpty) str += `export * from '.${key.replace(requestsDir, '')}/model.g';\n`;

      if (!this.overwrite) {
        writeFile(join(key, 'request.g.vg'), apiContent + '}', 'utf-8');
        if (!modelEmpty) writeFile(join(key, 'model.g.vg'), modelContent, 'utf-8');
      }
      if (modelEmpty) apiContent = apiContent.replace(`import * as models from './model.g';\n`, '');
      if (apiContent.includes('PageResp<')) apiContent = apiContent.replace('import { http } from ', 'import { http, PageResp } from ');
      if (!existsSync(join(key, 'request.g.ts')) || this.overwrite) {
        writeFile(join(key, 'request.g.ts'), apiContent, 'utf-8');
        if (!modelEmpty) writeFile(join(key, 'model.g.ts'), modelContent, 'utf-8');
      }
    }

    // 内容写入 index.ts
    if (!existsSync(join(requestsDir, 'index.ts'))) writeFileSync(join(requestsDir, 'index.ts'), str, 'utf-8');
    writeFileSync(join(requestsDir, 'index.text'), str, 'utf-8');

    // 内容写入 base_connect.ts
    if (!existsSync(join(requestsDir, 'base_http.ts')))
      writeFileSync(
        join(requestsDir, 'base_http.ts'),
        `interface Http {
  get: (url: string, params?: any) => Promise<any>;
  post: (url: string, data?: Record<string, any>) => Promise<any>;
  put: (url: string, data?: Record<string, any>) => Promise<any>;
  delete: (url: string, data?: Record<string, any>) => Promise<any>;
  download: (url: string, params?: Record<string, any> | undefined) => Promise<any>;
  upload: (file: File) => Promise<any>;
}
export let http: Http;
export interface PageResp<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
}
/**
 * umi
 * 
import { request } from '@umijs/max';

function download(url: string, params?: Record<string, any>) {
  return request(url, {
    responseType: 'blob',
    params,
  });
}

export const http = {
  get: (url: string, params?: any) => request(url, { params }),
  post: (url: string, data?: Record<string, any>) =>
    request(url, { data, method: 'POST' }),
  put: (url: string, data?: Record<string, any>) =>
    request(url, { data, method: 'PUT' }),
  delete: (url: string, data?: Record<string, any>) =>
    request(url, { method: 'DELETE', data }),
  download,
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload/file', { method: 'POST', data: formData });
  },
};
 */ 
`,
        'utf-8'
      );
    SwaggerConfig.writeExceptionToFile(requestsDir);
  }

  generateRequest(key: string, method: Method, value: SwaggerHttpEndpoint) {
    const { rootPath, customPathFolder } = SwaggerConfig.config;
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
      if (!SwaggerConfig.testFolder(folder ?? '')) return;
      folder = SwaggerConfig.exchangeConfigMap(folder);
    }

    const translationObj = SwaggerConfig.translationObj;
    let { dirPath, deeps } = getDirPath(folder, rootName, { translationObj, rootPath }) as {
      dirPath: string;
      deeps: number;
    };
    if (!existsSync(dirPath)) mkdirpSync(dirPath);
    const _temp = key
      .split('/')
      .map((e) => camelCase(e))
      .filter((e) => !['create', 'delete', 'update', 'v1', ''].includes(e));
    const keyLast = _temp.join('_');
    if (!keyLast) return;

    const methodName = camelCase(METHOD_MAP[method] + '_' + keyLast);

    // 写入 class 头
    if (!this.filesMap[dirPath]) {
      const apiHeader = `${this.modelHeader}
import * as models from './model.g';
import { http } from '${join(...Array(deeps - 1).fill('..'), 'base_http')}';\n`;
      this.filesMap[dirPath] = [apiHeader, this.modelHeader];
    }

    var _name = filterPathName(_temp);
    // if (key === '/work/enter_exit/{id}') {
    //   console.log(key);
    //   console.log(key);
    // }
    // ModelContent
    this.filesMap[dirPath][1] = getModelClassContent(_name, value, this.filesMap[dirPath][1]);
    const reqClassName = getClassName(_name);

    // requestContent
    const { params, desc } = this.getParams(value.parameters, reqClassName);
    let returnType = this.getReturnType(value.successResponse, getClassName(_name, false));

    const functionArgs = this.getFunctionArgs(key, method, value.parameters, reqClassName);
    const functionDesc = `
/** 
 * @description: ${value.summary}${value.description ? `\n * ${value.description}` : ''}${value.operationId ? `\n * @operationID: ${value.operationId}` : ''}
 * ${desc}
 * @return {${returnType}}
 */`;
    // 写入请求
    this.filesMap[dirPath][0] += `${functionDesc}
export async function ${methodName}(${params}): Promise<${returnType}> {
  ${returnType !== 'void' ? 'const res = ' : ''}await http.${method.toLowerCase()}(${functionArgs});${this.getReturnContent(
      value.successResponse,
      getClassName(_name, false)
    )}
}
`;
  }

  getReturnType(responses: JSONSchema | undefined, resClassName: string) {
    if (!responses) return 'any';
    let resClass: string | undefined,
      isPagination = false;
    let standardRes: JSONSchema | undefined = isStandardResponse(responses);
    if (standardRes) {
      const pageData = isPaginationResponse(standardRes);
      if (pageData) {
        standardRes = pageData;
        isPagination = true;
      }
      if (standardRes['anyOf']) standardRes = find(standardRes['anyOf'], (item) => item.type !== 'null');
      resClass = standardRes ? getTsType({ property: standardRes, key: resClassName }) : undefined;
    } else {
      resClass = 'any';
    }
    resClass = getReturnType(resClass, isPagination);
    return resClass !== undefined ? `${resClass}` : 'void';
  }

  /**
   *
   * @param parameters
   * @param reqClassName
   * @returns
   */
  getParams(parameters: SwaggerHttpEndpoint['parameters'], reqClassName: string) {
    const data = getParamObj(parameters);
    if (!data) return { params: '', desc: '' };
    const { pathParams, queryParams, formDataParams, bodyParams } = data;

    let str = '';
    let desc = '';

    pathParams.forEach((param) => {
      const name = camelCase(param.name);
      let type = getTsType({ param });
      if (type?.endsWith('[]')) {
        const subType = type.substring(0, type.length - 2);
        type = TS_TYPE.includes(subType) ? type : `models.${subType}[]`;
      } else {
        type = TS_TYPE.includes(type!) ? type : `models.${type}`;
      }
      str += `${name}: ${type}`;
      const description = param?.description;
      desc += `\n * @pathParam {${type}} ${name}:  ${description ?? ''}`;
    });

    let queryType = queryParams.length > 0 ? '{\n' : '';
    queryParams.forEach((param) => {
      let type = getTsType({ param });
      const require = param['required'];
      if (type?.endsWith('[]')) {
        const subType = type.substring(0, type.length - 2);
        type = TS_TYPE.includes(subType) ? type : `models.${subType}[]`;
      } else {
        type = TS_TYPE.includes(type!) ? type : `models.${type}`;
      }
      queryType += `${INDENT}${param.name}${require === true ? '' : '?'}: ${type},\n`;

      const description = param?.description;
      desc += `\n * @queryParam {${type}${require === true ? '' : '?'}} ${param.name}: ${description ?? ''}`;
    });

    if (queryParams.length > 0) queryType += '}';

    if (queryType.length > 0) str += `${str.length > 0 ? ', ' : ''}query: ${queryType}`;

    if (formDataParams.length > 0) {
      str += `${str.length > 0 ? ', ' : ''}body: FormData`;
      const description = formDataParams[0]?.description;
      desc += `\n * @formDataParam {FormData} body: ${description ?? ''}`;
    }
    if (bodyParams.length > 0) {
      const param = first(bodyParams)!;
      let type = getTsType({ param, key: reqClassName });
      const require = param['required'];
      if (type?.endsWith('[]')) {
        const subType = type.substring(0, type.length - 2);
        type = TS_TYPE.includes(subType) ? type : `models.${subType}[]`;
      } else {
        type = TS_TYPE.includes(type!) ? type : `models.${type}`;
      }
      str += `${str.length > 0 ? ', ' : ''}body${require === true ? '' : '?'}: ${type}`;

      const description = formDataParams[0]?.description;
      desc += `\n * @bodyParam {${type}${require === true ? '' : '?'}} body: ${description ?? ''}`;
    }

    return { params: str, desc };
  }

  getFunctionArgs(key: string, method: Method, parameters: SwaggerHttpEndpoint['parameters'], reqClassName: string) {
    const data = getParamObj(parameters);
    if (!data) return `'${key}'`;
    let str = '',
      reqPath = key;
    const { pathParams, queryParams, formDataParams, bodyParams } = data;
    pathParams.forEach((p) => {
      const name = camelCase(p.name);
      if (reqPath.includes(`{${p.name}}`)) reqPath = reqPath.replace(`{${p.name}}`, `\${${name}}`);
      else reqPath += reqPath.endsWith('/') ? `\${${name}}` : `/\${${name}}`;
    });
    str += `'${reqPath}'`;
    if (str.includes('${')) str = `\`${str.substring(1, str.length - 1)}\``;

    if (bodyParams.length > 0 && ['put', 'post', 'delete'].includes(method)) {
      const param = first(bodyParams)!;
      let type = getTsType({ param });
      if (type?.endsWith('[]')) {
        const subType = type.substring(0, type.length - 2);
        str += TS_TYPE.includes(subType) ? ', body' : `, body.map((e) => (new models.${subType}(e)).toJson())`;
      } else {
        str += TS_TYPE.includes(type!) ? ', body' : `, body.toJson()`;
      }
    }
    if (formDataParams.length > 0 && !str.includes(', body') && ['put', 'post', 'delete'].includes(method)) str += ', body';
    if (queryParams.length > 0) str += `, query`;
    return str;
  }

  getReturnContent(responses: JSONSchema | undefined, resClassName: string) {
    const returnType = this.getReturnType(responses, resClassName);
    if (returnType === 'void') return '';
    if (!isStandardResponse(responses)) return `\n${INDENT}return res;`;

    if (returnType.startsWith('PageResp<')) {
      var subType = returnType.substring(9, returnType.length - 1);
      return `\n${INDENT}return { ...res.data, list: res.data.list ? ${
        TS_TYPE.includes(subType) ? 'res.data.list' : `(res.data.list as any[]).map<${subType}>((v: any) => ${subType}.fromJson(v))`
      } : [] };`;
    }
    if (returnType.endsWith('[]')) {
      var subType = returnType.substring(0, returnType.length - 2);
      return `\n${INDENT}return res.data ? ${
        TS_TYPE.includes(subType) ? 'res.data' : `(res.data as any[]).map<${subType}>((v: any) => ${subType}.fromJson(v))`
      } : [];`;
    }
    if (!TS_TYPE.includes(returnType)) return `\n${INDENT}return ${returnType}.fromJson(res.data);`;

    return `\n${INDENT}return res.data;`;
  }
}

export default RequestGenerate;
