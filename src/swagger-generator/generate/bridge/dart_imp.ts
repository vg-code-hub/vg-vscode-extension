import { Material, camelCase, existsSync, find, join, writeFile } from '@root/utils';
import { DART_TYPE, INDENT, SwaggerGenTool, getDartType } from '../../utils';
import { IDescriptionOption, JSONSchema, Method, SwaggerParameter } from '../../index.d';
import { PlatformImplementor } from '.';
import { filter } from 'lodash';

const rootName = 'requests';
// 具体实现角色
export class DartPlatformImplementor implements PlatformImplementor {
  swagger2apiMaterialPath = join(Material.getDirPath('swagger2api'), 'dart');
  fileExtension = 'dart';
  baseTypes = DART_TYPE;
  formDataType = 'FormData';
  getSchameType = getDartType;
  isArrPropType = (propType: string) => propType.startsWith('List');

  /**
   * Generates the request header for a specific file.
   *
   * @param {string} fileHeader - The file header string.
   * @param {number} deeps - The number of deeps.
   * @param {string} className - The name of the class.
   * @return {string} The generated request header.
   */
  public getReqHeader(fileHeader: string, deeps: number, className: string) {
    return `${fileHeader}
import 'model.g.dart';
import '${join(...Array(deeps - 1).fill('..'), 'base_http.dart')}';

class ${className} {\n`;
  }

  private getArrReturnType(resClass?: string, isPagination = false) {
    if (!resClass) return undefined;
    if (resClass.startsWith('List<')) {
      const subType = this.arraySubClass(resClass);
      const [pageName] = SwaggerGenTool.pageResName;
      return isPagination ? `${pageName}<${subType}>` : resClass;
    }
    return resClass;
  }

  public arraySubClass(name: string) {
    return name.startsWith('List<') ? name.substring(5, name.length - 1) : name;
  }

  public getIndexFileContnet(path?: string, modelEmpty?: boolean) {
    if (!path) return `library ${rootName};\n\n`;
    let str = `export '.${path}/request.g.dart';\n`;
    if (!modelEmpty) str += `export '.${path}/model.g.dart';\n`;
    return str;
  }

  public wirtFile(overwrite: boolean, dirPath: string, options: { sharedModelNames: string[]; apiContent: string; modelContent: string; deeps: number }) {
    let { apiContent, modelContent, sharedModelNames, deeps } = options;
    const modelEmpty = modelContent.length === 0;
    if (!overwrite) {
      writeFile(join(dirPath, 'request.g.vg'), apiContent + '}', 'utf-8');
      if (!modelEmpty) writeFile(join(dirPath, 'model.g.vg'), modelContent, 'utf-8');
    }
    if (modelEmpty) apiContent = apiContent.replace(`import 'model.g.dart';\n`, '');
    if (!existsSync(join(dirPath, 'request.g.dart')) || overwrite) writeFile(join(dirPath, 'request.g.dart'), apiContent + '}', 'utf-8');

    const filterModelNames = filter(sharedModelNames, (value) => modelContent.includes(`${value} `) || modelContent.includes(`<${value}>`));
    let shared = '\n\n';
    if (filterModelNames.length > 0) shared += `import '${join(...Array(deeps - 1).fill('..'), 'shared_model.g.dart')}';`;
    if (sharedModelNames.length > 0) shared += `${shared !== '\n\n' ? '\n' : ''}export '${join(...Array(deeps - 1).fill('..'), 'shared_model.g.dart')}';`;
    if (shared !== '\n\n') shared += '\n\n';

    modelContent = SwaggerGenTool.modelHeader + shared + modelContent;

    if ((!existsSync(join(dirPath, 'model.g.dart')) || overwrite) && !modelEmpty) writeFile(join(dirPath, 'model.g.dart'), modelContent, 'utf-8');
  }

  public pathParam(p: SwaggerParameter) {
    const name = camelCase(p.name);
    const type = getDartType({ param: p });
    const description = p.description;
    const require = p.required;

    return { name, orgKey: p.name, type, description, require };
  }

  /**
   * A description of the entire function.
   *
   * @param {IDescriptionOption} options - The options object containing the function parameters.
   * @param {string} options.summary - The summary of the function.
   * @param {string} options.description - The description of the function.
   * @param {string} options.operationId - The operation id of the function.
   * @param {string} options.returnType - The return type of the function.
   * @param {Array<{type: string, require: boolean, name: string, description: string}>} options.paths - The array of path parameters.
   * @param {Array<{type: string, require: boolean, name: string, description: string}>} options.querys - The array of query parameters.
   * @param {{type: string, name: string, description: string}} options.formData - The form data parameter.
   * @param {{type: string, name: string, description: string}} options.body - The body parameter.
   * @returns {string} The function description.
   */
  public getDescription(options: IDescriptionOption) {
    const { summary, description, operationId } = options;
    let desc = summary ? `\n${INDENT}/// ${summary}` : '';
    desc += description ? `\n${INDENT}/// @description ${description}` : '';
    desc += operationId ? `\n${INDENT}/// @operationId ${operationId}` : '';
    const { returnType, paths, querys, formData, body } = options;
    if (paths.length > 0 || querys.length > 0 || formData || body) desc += `\n${INDENT}///\n${INDENT}/// parameters`;

    paths.forEach(({ type, require, name, description }) => {
      desc += `\n${INDENT}/// @pathParam [${type}${require ? '' : '?'}] ${name}${description ? `: ${description}` : ''}`;
    });

    querys.forEach(({ type, require, name, description }) => {
      desc += `\n${INDENT}/// @queryParam [${type}${require ? '' : '?'}] ${name}${description ? `: ${description}` : ''}`;
    });

    if (formData) {
      const { type, name, description } = formData;
      desc += `\n${INDENT}/// @formDataParam [${type}] ${name}${description ? `: ${description}` : ''}`;
    }
    if (body) {
      const { type, name, description } = body;
      desc += `\n${INDENT}/// @bodyParam [${type}] ${name}${description ? `: ${description}` : ''}`;
    }

    desc += `\n${INDENT}/// @return [${returnType}]`;

    return desc;
  }

  public getFunctionArgs(options: Pick<IDescriptionOption, 'formData' | 'body' | 'paths' | 'querys'>) {
    const { paths, querys, formData, body } = options;
    let str = '';
    paths.forEach((p) => {
      str += `${p.type} ${p.name}, `;
    });
    if (querys.length > 0) str += '{\n';
    querys.forEach((p) => {
      str += `${INDENT}${INDENT}${p.require ? 'required ' : ''}${p.type}${p.require ? '' : '?'} ${p.name},\n`;
    });
    if (formData) {
      if (!str.includes('{')) str += '{\n';
      str += `${INDENT}${INDENT}required ${formData.type} ${formData.name},\n`;
    }
    if (body) {
      if (!str.includes('{')) str += '{\n';
      str += `${INDENT}${INDENT}required ${body.type} ${body.name},\n`;
    }
    if (str.includes('{')) str += `${INDENT}}`;
    return str;
  }

  getSimpleReturnType(responses: JSONSchema | undefined, name: string) {
    if (!responses) return 'dynamic';

    let resClass: string;
    let standardRes: JSONSchema | undefined = SwaggerGenTool.getStandardResponse(responses);
    if (standardRes) {
      const pageData = SwaggerGenTool.getPageResponse(standardRes);
      if (pageData) standardRes = pageData;
      if (standardRes['anyOf']) standardRes = find(standardRes['anyOf'], (item) => item.type !== 'null');
      resClass = standardRes ? getDartType({ property: standardRes, key: name }) : 'dynamic';
    } else {
      resClass = 'dynamic';
    }
    return this.arraySubClass(resClass);
  }

  getReturnType(responses: JSONSchema | undefined, resClassName: string) {
    if (!responses) return 'dynamic';
    let resClass: string | undefined,
      isPagination = false;
    let standardRes: JSONSchema | undefined = SwaggerGenTool.getStandardResponse(responses);
    if (standardRes) {
      const pageData = SwaggerGenTool.getPageResponse(standardRes);
      if (pageData) {
        standardRes = pageData;
        isPagination = true;
      }
      if (standardRes['anyOf']) standardRes = find(standardRes['anyOf'], (item: JSONSchema) => item.type !== 'null');
      resClass = standardRes ? getDartType({ property: standardRes, key: resClassName }) : undefined;
    } else {
      resClass = 'dynamic';
    }
    if (resClass === 'null') return 'void';
    resClass = this.getArrReturnType(resClass, isPagination);
    return resClass !== undefined ? `${resClass}` : 'void';
  }

  getReqArgs(key: string, method: Method, options: Pick<IDescriptionOption, 'formData' | 'body' | 'paths' | 'querys'>) {
    const { paths, querys, formData, body } = options;
    const { urlPrefix } = SwaggerGenTool.config;
    const path = (urlPrefix ?? '') + key;
    if (!formData && !body && paths.length === 0 && querys.length === 0) return `'${path}'${['put', 'post'].includes(method) ? ', {}' : ''}`;

    let str = '',
      reqPath = path,
      queryStr = '';

    paths.forEach(({ name }) => {
      if (reqPath.includes(`{${name}}`)) reqPath = reqPath.replace(`{${name}}`, `\$${name}`);
      else reqPath += reqPath.endsWith('/') ? `\$${name}` : `/\$${name}`;
    });
    str += `'${reqPath}'`;

    if (body && ['put', 'post', 'delete'].includes(method)) {
      const { type } = body;
      var suffix = '';
      if (type && !DART_TYPE.includes(this.arraySubClass(type))) suffix = `.toJson()`;
      else if (type && ['int', 'double'].includes(type)) suffix = `.toString()`;
      str += `, body${suffix}`;
    }
    if (formData && !str.includes(', body') && ['put', 'post'].includes(method)) str += ', body';

    if (querys.length > 0) {
      queryStr += '{';
      querys.forEach(({ type, name, orgKey, require }) => {
        var suffix = '';
        if (type && !DART_TYPE.includes(this.arraySubClass(type))) suffix = `.toJson()`;
        else if (type && ['int', 'double'].includes(type)) suffix = `.toString()`;
        queryStr += `\'${orgKey}\': ${name}${require || !suffix ? '' : '?'}${suffix}, `;
      });
      queryStr += '}';
    }
    if (queryStr.length !== 0) str += `, query: ${queryStr}`;
    if (!str.includes(',') && ['put', 'post'].includes(method)) str += ', {}';
    return str;
  }

  getReturnContent(responses: JSONSchema | undefined, resClassName: string) {
    const returnType = this.getReturnType(responses, resClassName);
    if (returnType === 'void') return '';
    const resName = SwaggerGenTool.resName;
    const [pageName, keyName] = SwaggerGenTool.pageResName;
    const pageDataKey = SwaggerGenTool.pageResDataKey;
    if (!SwaggerGenTool.getStandardResponse(responses)) return `\n${INDENT}${INDENT}return ${resName};`;

    let type = returnType;
    if (DART_TYPE.includes(type) || type === 'List<Map<String, dynamic>>') {
      return `\n${INDENT}${INDENT}return ${resName};`;
    } else if (type.startsWith('List<')) {
      const subType = type.substring(5, type.length - 1);
      return `\n${INDENT}${INDENT}return ${resName} == null ? [] : ${type}.from(${resName}.map((e) => ${subType}.fromJson(e)));`;
    } else if (type.startsWith(pageName)) {
      const subType = type.substring(pageName.length + 1, type.length - 1);
      return `\n${INDENT}${INDENT}var pageData = ${resName};
    List<${subType}> ${keyName} = pageData['${pageDataKey}'] == null
        ? []
        : List<${subType}>.from(
            pageData['${pageDataKey}'].map((e) => ${subType}.fromJson(e)));
    return ${pageName}(
      ${keyName},${SwaggerGenTool.pageResProps.map((key: string) => `\n${INDENT}${INDENT}${INDENT}${key}: pageData['${key}']`).join(',')},
    );`;
    } else {
      return `\n${INDENT}${INDENT}return ${type}.fromJson(${resName});`;
    }
  }

  /// model
  getConstructorContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '{\n';
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const dartType = getDartType({ key: propertyName, property });

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, (e) => e.toString().includes('null'));
      if (nullable && require && !dartType.startsWith('List')) require = false;

      const camelPropertyName = camelCase(propertyName);
      str += `${INDENT}${INDENT}${require ? 'required ' : ''}this.${camelPropertyName},\n`;
    }
    str += `${INDENT}}`;
    if (str === `{\n${INDENT}}`) str = '';
    return str;
  }

  getPropertiesContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const dartType = getDartType({ key: propertyName, property });
      const camelPropertyName = camelCase(propertyName);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, (e) => e.toString().includes('null'));
      if (nullable && require && !dartType.startsWith('List')) require = false;

      if (property.title || property.description) str += `${INDENT}/// ${property.title || property.description}\n`;
      str += `${INDENT}${dartType}${require ? '' : '?'} ${camelPropertyName};\n\n`;
    }
    str = str.length > 0 ? str.substring(2, str.length - 1) : str;
    return str;
  }

  getFromJsonContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const dartType = getDartType({ key: propertyName, property });
      const camelPropertyName = camelCase(propertyName);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, (e) => e.toString().includes('null'));
      if (nullable && require && !dartType.startsWith('List')) require = false;

      str += `${INDENT}${INDENT}${camelPropertyName}: `;
      if (dartType.startsWith('List')) {
        var subType = dartType.substring(5, dartType.length - 1);
        str += `json["${propertyName}"] != null ? List<${subType}>.from(json["${propertyName}"].map((e) => ${
          DART_TYPE.includes(subType) ? 'e' : `${subType}.fromJson(e)`
        })) : [],\n`;
      } else if (!DART_TYPE.includes(dartType)) {
        str += require
          ? `${dartType}.fromJson(json["${propertyName}"]),\n`
          : `json["${propertyName}"] != null ? ${dartType}.fromJson(json["${propertyName}"]) : null,\n`;
      } else if (dartType === 'int') {
        str += require
          ? `int.parse(json["${propertyName}"].toString()),\n`
          : `json["${propertyName}"] != null ? int.parse(json["${propertyName}"].toString()) : null,\n`;
      } else if (dartType === 'num') {
        str += require
          ? `num.parse(json["${propertyName}"].toString()),\n`
          : `json["${propertyName}"] != null ? num.parse(json["${propertyName}"].toString()) : null,\n`;
      } else {
        str += `json["${propertyName}"],\n`;
      }
    }
    str = str.length > 0 ? str.substring(4, str.length - 1) : str;
    return str;
  }

  getToJsonContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const camelPropertyName = camelCase(propertyName);
      const property = properties[propertyName];
      const dartType = getDartType({ key: propertyName, property });
      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, (e) => e.toString().includes('null'));
      if (nullable && require && !dartType.startsWith('List')) require = false;

      str += `${INDENT}${INDENT}"${propertyName}": `;

      if (dartType.startsWith('List')) {
        var subType = dartType.substring(5, dartType.length - 1);
        if (require) str += `${camelPropertyName}.map((e) => ${DART_TYPE.includes(subType) ? 'e' : 'e.toJson()'}).toList(),\n`;
        else str += `${camelPropertyName} != null ? ${camelPropertyName}!.map((e) => ${DART_TYPE.includes(subType) ? 'e' : 'e.toJson()'}).toList() : null,\n`;
      } else if (!DART_TYPE.includes(dartType)) {
        if (require) str += `${camelPropertyName}.toJson(),\n`;
        else str += `${camelPropertyName} != null ? ${camelPropertyName}!.toJson() : null,\n`;
      } else {
        str += `${camelPropertyName},\n`;
      }
    }
    str = str.length > 0 ? str.substring(4, str.length - 1) : str;
    return str;
  }
}
