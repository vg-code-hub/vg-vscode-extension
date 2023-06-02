import { existsSync, writeFile } from "fs";
import type { SwaggerPropertyDefinition, Swagger, SwaggerHttpEndpoint } from "../../index.d";
import { BASE_TYPE, INDENT, exchangeZhToEn, getDartParamType, getDartSchemaType, getDartType } from "../../utils";
import * as changeCase from "change-case";
import { mkdirpSync } from "mkdirp";
import { join } from "path";
import { find, first, last } from "lodash";

type SwaggerPath = Swagger['paths'];
type Method = keyof SwaggerPath[''];

const METHOD_MAP = {
  get: 'get',
  post: 'create',
  put: 'update',
  delete: 'delete',
};

class RequestGenerate {
  paths: SwaggerPath;
  options: { rootPath: string, translateJson: Record<string, string>, swaggerVersion: number };
  filesMap: Record<string, string>;

  constructor(paths: SwaggerPath, options: { rootPath: string, translateJson: Record<string, string>, swaggerVersion: number }) {
    this.options = options;
    this.paths = paths;
    this.filesMap = {};
  }


  async generateAllRequest() {
    for (let key in this.paths)
      for (let method in this.paths[key])
        this.generateRequest(key, method as Method, this.paths[key][method as Method]) + "\n";


    let str = `library requests;\n\n`;
    const requestsDir = join(this.options.rootPath, 'requests');
    for (let key in this.filesMap) {
      str += `export '.${key.replace(requestsDir, '')}/request.g.dart';\n`;
      if (!existsSync(join(key, 'request.g.dart')))
        // request内容写入
        writeFile(
          join(key, 'request.g.dart'),
          this.filesMap[key] + '}',
          'utf-8',
          (error: any) => {
            // if (error)
            //   reject(error);
            // else
            //   resolve("写入成功");
          }
        );
      else
        writeFile(
          join(key, 'request.g.vg'),
          this.filesMap[key] + '}',
          'utf-8',
          (error: any) => {
            // if (error)
            //   reject(error);
            // else
            //   resolve("写入成功");
          }
        );
    }
    if (!existsSync(join(requestsDir, 'index.dart')))
      writeFile(
        join(requestsDir, 'index.dart'),
        str,
        'utf-8',
        (error: any) => {
          // if (error)
          //   reject(error);
          // else
          //   resolve("写入成功");
        }
      );
    if (!existsSync(join(requestsDir, 'base_connect.dart')))
      writeFile(
        join(requestsDir, 'base_connect.dart'),
        `abstract class BaseConnect {
  get(path, {query}) {}
  onInit() {}
  post(path, body) {}
  put(path, body) {}
  delete(path, {query}) {}
}
`,
        'utf-8',
        (error: any) => {
          // if (error)
          //   reject(error);
          // else
          //   resolve("写入成功");
        }
      );
    writeFile(
      join(requestsDir, 'index.text'),
      str,
      'utf-8',
      (error: any) => {
        // if (error)
        //   reject(error);
        // else
        //   resolve("写入成功");
      }
    );
  }

  generateRequest(key: string, method: Method, value: SwaggerHttpEndpoint) {
    let that = this;
    const folder = value["x-apifox-folder"];
    let dirPath: string, deeps = 1, className: string;
    if (folder) {
      const { str: path } = exchangeZhToEn(folder, this.options.translateJson);
      dirPath = join(this.options.rootPath, 'requests', path.split('/').map(e => changeCase.snakeCase(e)).join('/'));
      deeps += path.split('/').length;
      className = changeCase.pascalCase(path.split('/').map(e => changeCase.snakeCase(e)).join('_') + '_request');
    } else {
      dirPath = join(this.options.rootPath, 'requests');
      className = changeCase.pascalCase('request');
    }
    if (!existsSync(dirPath)) mkdirpSync(dirPath);
    const keyLast = key.split('/').map(e => changeCase.snakeCase(e)).filter(e => !['create', 'delete', 'update', 'v1'].includes(e)).join('_');
    if (!keyLast) return;
    const methodName = changeCase.camelCase(METHOD_MAP[method] + '_' + keyLast);

    function getReturnType() {
      let resClass: string | undefined;
      if (!['post', 'put', 'delete'].includes(method) && value.responses && value.responses['200'] && value.responses['200'].schema) {
        const schema = value.responses['200'].schema;
        if (schema.type === 'object' && Object.keys(schema.properties).includes('data')) {
          let rawData: SwaggerPropertyDefinition | undefined = schema.properties['data'];
          if (rawData['anyOf'])
            rawData = find(rawData['anyOf'], item => item.type !== 'null');
          resClass = rawData ? getDartSchemaType(rawData) : undefined;
        }
      }

      return resClass !== undefined ? `Future<${resClass}>` : 'Future';
    }

    function getParamObj() {
      const parameters = value.parameters;
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

    function getParams() {
      const data = getParamObj();
      if (!data) return '';
      const { pathParams, queryParams, formDataParams, bodyParams } = data;
      let str = '';
      pathParams.forEach(p => {
        const name = changeCase.camelCase(p.name);
        const type = getDartParamType(p, that.options.swaggerVersion);
        str += `${type} ${name}, `;
      });
      if (queryParams.length > 0) str += '{\n';

      queryParams.forEach(p => {
        const name = changeCase.camelCase(p.name);
        const type = getDartParamType(p, that.options.swaggerVersion);
        const require = p['required'];
        str += `${INDENT}${INDENT}${require === true ? 'required ' : ''}${type}${require === true ? '' : '?'} ${name},\n`;
      });
      if (formDataParams.length > 0) {
        if (!str.includes('{'))
          str += '{\n';
        str += `${INDENT}${INDENT}required Map<String, dynamic> body,\n`;
      }
      if (bodyParams.length > 0) {

        if (!str.includes('{\n'))
          str += '{\n';
        const p = first(bodyParams)!;
        const type = getDartParamType(p, that.options.swaggerVersion);
        const require = p['required'];
        str += `${INDENT}${INDENT}${require === true ? 'required ' : ''}${type}${require === true ? '' : '?'} body,\n`;
      }

      if (str.includes('{')) str += `${INDENT}}`;

      return str;
    }

    function getParamsDescription() {
      let str = `///\n${INDENT}/// parameters`;
      const data = getParamObj();
      if (!data) return str;
      const { pathParams, queryParams, formDataParams, bodyParams } = data;
      str += '\n';
      pathParams.forEach(p => {
        const name = changeCase.camelCase(p.name);
        const type = getDartParamType(p, that.options.swaggerVersion);
        const description = p?.description;
        str += `${INDENT}/// [pathParam] ${type} ${name}:  ${description ?? ''}\n`;
      });
      queryParams.forEach(p => {
        const name = changeCase.camelCase(p.name);
        const type = getDartParamType(p, that.options.swaggerVersion);
        const description = p?.description;
        const require = p['required'];
        str += `${INDENT}/// [queryParam] ${type}${require === true ? '' : '?'} ${name}: ${description ?? ''}\n`;
      });
      if (formDataParams.length > 0) {
        const description = formDataParams[0]?.description;
        str += `${INDENT}/// [formDataParam] Map<String, dynamic> body: ${description ?? ''}\n`;
      }
      if (bodyParams.length > 0) {
        const p = first(bodyParams)!;
        const type = getDartParamType(p, that.options.swaggerVersion);
        const require = p['required'];
        const description = formDataParams[0]?.description;
        str += `${INDENT}/// [formDataParam] ${type}${require === true ? '' : '?'} body: ${description ?? ''}\n`;
      }
      return str.substring(0, str.length - 1);
    }

    function getFunctionArgs() {
      const data = getParamObj();
      if (!data) return `'${key}'`;
      let str = '', reqPath = key, queryStr = '';
      const { pathParams, queryParams, formDataParams, bodyParams } = data;
      pathParams.forEach(p => {
        const name = changeCase.camelCase(p.name);
        if (reqPath.includes('{$name}'))
          reqPath = reqPath.replace(`{${name}}`, `\${${name}}`);
        else
          reqPath += reqPath.endsWith('/') ? `\${${name}}` : `/\${${name}}`;
      });
      str += `'${reqPath}'`;
      if (bodyParams.length > 0 && ['put', 'post'].includes(method)) str += ', body';
      if (formDataParams.length > 0 && !str.includes(', body') && ['put', 'post'].includes(method)) str += ', body';

      if (queryParams.length > 0) {
        queryStr += '{';
        queryParams.forEach(p => {
          const name = changeCase.camelCase(p.name);
          queryStr += (`\'${name}\': ${name},`);

        });
        queryStr += '}';
      }
      if (queryStr.length !== 0) str += `, query: ${queryStr}`;
      return str;
    }

    function getReturnContent() {
      const returnType = getReturnType();
      if (returnType === 'Future') return '';
      let type = returnType.substring(7, returnType.length - 1);
      if (BASE_TYPE.includes(type) || type === 'List<Map<String, dynamic>>' || type === 'Map<String, dynamic>') {
        return `\n${INDENT}${INDENT}return res.body['data'];`;
      } else if (type.startsWith('List')) {
        const subType = type.substring(5, type.length - 1);
        return `\n${INDENT}${INDENT}return res.body['data'].map((e) => ${subType}.fromJson(e)).toList() as ${type};`;
      } else {
        return `\n${INDENT}${INDENT}return ${type}.fromJson(res.body['data']);`;
      }
    }

    if (!this.filesMap[dirPath]) this.filesMap[dirPath] = `// @format
// This file is generated by the VG SwaggerGenerator.
// Do not edit.
import '${join(...Array(deeps).fill('..'), 'entitys', 'index.dart')}';
import '${join(...Array(deeps - 1).fill('..'), 'base_connect.dart')}';

class ${className} extends BaseConnect {`;
    this.filesMap[dirPath] += `
  /// ${value.summary}${value.description ? `\n/// ${value.description}` : ''}${value.operationId ? `\n/// Operation ID: ${value.operationId}` : ''}
  ${getParamsDescription()}
  ${getReturnType()} ${methodName}(${getParams()}) async {
    ${getReturnType() !== 'Future' ? 'final res = ' : ''}await ${method.toLowerCase()}(${getFunctionArgs()});${getReturnContent()}
  }
`;
  }
}

export default RequestGenerate;