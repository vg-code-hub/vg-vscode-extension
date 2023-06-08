import { isRegExp, find, first, join, mkdirpSync, existsSync, writeFileSync, writeFile, snakeCase, camelCase } from "@root/util";
import type { SwaggerPropertyDefinition, SwaggerPath, Method, SwaggerHttpEndpoint, Responses } from "../../index.d";
import { BASE_TYPE, INDENT, SwaggerConfig, getTsParamType, getTsSchemaType, getDirPath } from "../../utils";

const METHOD_MAP = {
  get: 'get',
  post: 'create',
  put: 'update',
  delete: 'delete',
};

const rootName = 'requests';

class RequestGenerate {
  paths: SwaggerPath;
  filesMap: Record<string, string>;

  constructor(paths: SwaggerPath) {
    this.paths = paths;
    this.filesMap = {};
  }

  async generateAllRequest() {
    for (let key in this.paths)
      for (let method in this.paths[key])
        this.generateRequest(key, method as Method, this.paths[key][method as Method]) + "\n";

    let str = '';
    const requestsDir = join(SwaggerConfig.config.rootPath, rootName);

    // request内容写入
    for (let key in this.filesMap) {
      str += `export * from '.${key.replace(requestsDir, '')}/request.g';\n`;
      if (!existsSync(join(key, 'request.g.ts')))
        writeFile(
          join(key, 'request.g.ts'),
          this.filesMap[key],
          'utf-8',
        );
      else
        writeFile(
          join(key, 'request.g.vg'),
          this.filesMap[key],
          'utf-8',
        );
    }

    // 内容写入 index.ts
    if (!existsSync(join(requestsDir, 'index.ts')))
      writeFileSync(
        join(requestsDir, 'index.ts'),
        str,
        'utf-8',
      );
    writeFileSync(
      join(requestsDir, 'index.text'),
      str,
      'utf-8',
    );

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
/**
 * umi
 * 
import { request } from 'umi';

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
        'utf-8',
      );
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
      folder = value["x-apifox-folder"];
      if (!folder && value.tags && value.tags.length > 0) folder = value.tags[0];
      if (!SwaggerConfig.testFolder(folder ?? '')) return;
      folder = SwaggerConfig.exchangeConfigMap(folder);
    }

    const translationObj = SwaggerConfig.translationObj;
    let { dirPath, deeps } = getDirPath(folder, rootName, { translationObj, rootPath }) as {
      dirPath: string,
      deeps: number
    };
    if (!existsSync(dirPath)) mkdirpSync(dirPath);
    const keyLast = key.split('/').map(e => snakeCase(e)).filter(e => !['create', 'delete', 'update', 'v1'].includes(e)).join('_');
    if (!keyLast) return;

    const methodName = camelCase(METHOD_MAP[method] + '_' + keyLast);

    // 写入 class 头
    if (!this.filesMap[dirPath])
      this.filesMap[dirPath] = `// This file is generated by the VG SwaggerGenerator.
// You can modify it so that the next generation will not overwrite it, but instead generate a suffix file with the same name [.vg].
import * as models from '${join(...Array(deeps).fill('..'), 'entitys')}';
import { http } from '${join(...Array(deeps - 1).fill('..'), 'base_http')}';
\n`;

    const { params, desc } = this.getParams(value.parameters);
    const returnType = this.getReturnType(value.responses, method);
    const functionArgs = this.getFunctionArgs(key, method, value.parameters);
    const functionDesc = `
/** 
 * @description: ${value.summary}${value.description ? `\n * ${value.description}` : ''}${value.operationId ? `\n * @operationID: ${value.operationId}` : ''}
 * ${desc}
 * @return {${returnType}}
 */`;
    // 写入请求
    this.filesMap[dirPath] += `${functionDesc}
export async function ${methodName}(${params}): Promise<${returnType}> {
  ${returnType !== 'void' ? 'const res = ' : ''}await http.${method.toLowerCase()}(${functionArgs});${this.getReturnContent(value.responses, method)}
}
`;
  }

  getParamObj(parameters: SwaggerHttpEndpoint['parameters']) {
    if (!parameters) return undefined;
    const pathParams =
      parameters.filter((p) => p['in'] === 'path');
    const queryParams =
      parameters.filter((p) => p['in'] === 'query');
    const formDataParams =
      parameters.filter((p) => p['in'] === 'formData');
    const bodyParams =
      parameters.filter((p) => p['in'] === 'body');

    return {
      pathParams,
      queryParams,
      formDataParams,
      bodyParams
    };
  }

  getReturnType(responses: Responses, method: Method) {
    let resClass: string | undefined;
    if (!['post', 'put', 'delete'].includes(method) && responses && responses['200'] && responses['200'].schema) {
      const schema = responses['200'].schema;
      if (schema.type === 'object' && schema.properties && Object.keys(schema.properties).includes('data')) {
        let rawData: SwaggerPropertyDefinition | undefined = schema.properties['data'];
        if (rawData['anyOf'])
          rawData = find(rawData['anyOf'], item => item.type !== 'null');
        resClass = rawData ? getTsSchemaType(rawData) : undefined;
      } else if (schema.$ref || schema.type) {
        resClass = getTsSchemaType(schema);
      }
    }
    if (resClass?.endsWith('[]')) {
      const subType = resClass.substring(0, resClass.length - 2);
      resClass = BASE_TYPE.includes(subType) ? resClass : `models.${subType}[]`;
    } else if (resClass) {
      resClass = BASE_TYPE.includes(resClass) ? resClass : `models.${resClass}`;
    }

    return resClass !== undefined ? `${resClass}` : 'void';
  }

  getParams(parameters: SwaggerHttpEndpoint['parameters']) {
    const data = this.getParamObj(parameters);
    if (!data) return { params: '', desc: '' };
    const { pathParams, queryParams, formDataParams, bodyParams } = data;
    const swaggerVersion = SwaggerConfig.config.swaggerVersion;
    let str = '';
    let desc = '';

    pathParams.forEach(p => {
      const name = camelCase(p.name);
      let type = getTsParamType(p, swaggerVersion);
      if (type?.endsWith('[]')) {
        const subType = type.substring(0, type.length - 2);
        type = BASE_TYPE.includes(subType) ? type : `models.${subType}[]`;
      } else {
        type = BASE_TYPE.includes(type!) ? type : `models.${type}`;
      }
      str += `${name}: ${type}`;
      const description = p?.description;
      desc += `\n * @pathParam {${type}} ${name}:  ${description ?? ''}`;
    });

    let queryType = queryParams.length > 0 ? '{\n' : '';
    queryParams.forEach(p => {
      let type = getTsParamType(p, swaggerVersion);
      const require = p['required'];
      if (type?.endsWith('[]')) {
        const subType = type.substring(0, type.length - 2);
        type = BASE_TYPE.includes(subType) ? type : `models.${subType}[]`;
      } else {
        type = BASE_TYPE.includes(type!) ? type : `models.${type}`;
      }
      queryType += `${INDENT}${p.name}${require === true ? '' : '?'}: ${type},\n`;

      const description = p?.description;
      desc += `\n * @queryParam {${type}${require === true ? '' : '?'}} ${p.name}: ${description ?? ''}`;
    });

    if (queryParams.length > 0) queryType += '}';

    if (queryType.length > 0) str += `${str.length > 0 ? ', ' : ''}query: ${queryType}`;

    if (formDataParams.length > 0) {
      str += `${str.length > 0 ? ', ' : ''}body: Record<string, any>`;

      const description = formDataParams[0]?.description;
      desc += `\n * @formDataParam {Record<string, any>} body: ${description ?? ''}`;
    }
    if (bodyParams.length > 0) {
      const p = first(bodyParams)!;
      let type = getTsParamType(p, swaggerVersion);
      const require = p['required'];
      if (type?.endsWith('[]')) {
        const subType = type.substring(0, type.length - 2);
        type = BASE_TYPE.includes(subType) ? type : `models.${subType}[]`;
      } else {
        type = BASE_TYPE.includes(type!) ? type : `models.${type}`;
      }
      str += `${str.length > 0 ? ', ' : ''}body${require === true ? '' : '?'}: ${type}`;

      const description = formDataParams[0]?.description;
      desc += `\n * @formDataParam {${type}${require === true ? '' : '?'}} body: ${description ?? ''}`;
    }

    return { params: str, desc };
  }

  getFunctionArgs(key: string, method: Method, parameters: SwaggerHttpEndpoint['parameters']) {
    const data = this.getParamObj(parameters);
    const swaggerVersion = SwaggerConfig.config.swaggerVersion;
    if (!data) return `'${key}'`;
    let str = '', reqPath = key;
    const { pathParams, queryParams, formDataParams, bodyParams } = data;
    pathParams.forEach(p => {
      const name = camelCase(p.name);
      if (reqPath.includes(`{${p.name}}`))
        reqPath = reqPath.replace(`{${p.name}}`, `\${${name}}`);
      else
        reqPath += reqPath.endsWith('/') ? `\${${name}}` : `/\${${name}}`;
    });
    str += `'${reqPath}'`;
    // TODO: body 对象类型 case 转换
    if (bodyParams.length > 0 && ['put', 'post'].includes(method)) {
      const p = first(bodyParams)!;
      let type = getTsParamType(p, swaggerVersion);
      if (type?.endsWith('[]')) {
        const subType = type.substring(0, type.length - 2);
        str += BASE_TYPE.includes(subType) ? ', body' : `, body.map((e) => e.toJson())`;
      } else {
        str += BASE_TYPE.includes(type!) ? ', body' : ', body.toJson()';
      }
    }
    if (formDataParams.length > 0 && !str.includes(', body') && ['put', 'post'].includes(method)) str += ', body';
    if (queryParams.length > 0) str += `, query`;
    return str;
  }

  getReturnContent(responses: SwaggerHttpEndpoint['responses'], method: Method) {
    const returnType = this.getReturnType(responses, method);
    if (returnType === 'void') return '';
    if (returnType.endsWith('[]')) {
      var subType = returnType.substring(0, returnType.length - 2);
      return `\n${INDENT}return res.data ? ${BASE_TYPE.includes(subType) ? 'res.data' : `(res.data as any[]).map<${subType}>((v: any) => ${subType}.fromJson(v))`} : [];`;
    } else if (!BASE_TYPE.includes(returnType)) {
      return `\n${INDENT}return ${returnType}.fromJson(res.data);`;
    } else {
      return `\n${INDENT}return res.data;`;
    }
  }
}

export default RequestGenerate;