import { Material, camelCase, existsSync, find, join, writeFile } from '@root/utils';
import { INDENT, LIST_KEY, SwaggerGenTool, TS_TYPE, getTsType } from '../../utils';
import { IDescriptionOption, JSONSchema, Method, SwaggerParameter } from '../../index.d';
import { PlatformImplementor } from '.';
import { filter } from 'lodash';

export class TsPlatformImplementor implements PlatformImplementor {
  swagger2apiMaterialPath = join(Material.getDirPath('swagger2api'), 'ts');
  fileExtension = 'ts';
  baseTypes = TS_TYPE;
  formDataType = 'FormData';
  getSchameType = getTsType;
  isArrPropType = (propType: string) => propType.endsWith('[]');

  public getReqHeader(fileHeader: string, deeps: number) {
    return `${fileHeader}
import * as models from './model.g';
import { http } from '${join(...Array(deeps - 1).fill('..'), 'base_http')}';\n`;
  }

  private getArrReturnType(resClass?: string, isPagination = false) {
    if (!resClass) return undefined;
    if (resClass.endsWith('[]')) {
      const subType = resClass.substring(0, resClass.length - 2);
      const type = TS_TYPE.includes(subType) ? `${subType}` : `models.${subType}`;
      const [pageName] = SwaggerGenTool.pageResName;
      return isPagination ? `${pageName}<${type}>` : `${type}[]`;
    }

    return (resClass = TS_TYPE.includes(resClass) ? resClass : `models.${resClass}`);
  }

  public arraySubClass(name: string) {
    return name.endsWith('[]') ? name.substring(0, name.length - 2) : name;
  }

  public getIndexFileContnet(path?: string, modelEmpty?: boolean) {
    if (!path) return '';
    let str = `export * from '.${path}/request.g';\n`;
    if (!modelEmpty) str += `export * from '.${path}/model.g';\n`;
    return str;
  }

  public wirtFile(overwrite: boolean, dirPath: string, options: { sharedModelNames: string[]; apiContent: string; modelContent: string; deeps: number }) {
    const [pageName] = SwaggerGenTool.pageResName;
    let { apiContent, modelContent, sharedModelNames, deeps } = options;
    const modelEmpty = modelContent.length === 0;

    if (!overwrite) {
      writeFile(join(dirPath, 'request.g.vg'), apiContent, 'utf-8');
      if (!modelEmpty) writeFile(join(dirPath, 'model.g.vg'), modelContent, 'utf-8');
    }
    if (modelEmpty) apiContent = apiContent.replace(`import * as models 'model.g';\n`, '');
    if (apiContent.includes(`${pageName}<`)) apiContent = apiContent.replace('import { http } from ', `import { http, ${pageName} } from `);
    if (!existsSync(join(dirPath, 'request.g.ts')) || overwrite) writeFile(join(dirPath, 'request.g.ts'), apiContent, 'utf-8');

    sharedModelNames = filter(sharedModelNames, (value) => modelContent.includes(`: ${value};`) || modelContent.includes(`: ${value}[]`));

    const shared =
      sharedModelNames.length !== 0
        ? `\nimport { ${sharedModelNames.join(', ')} } from '${join(...Array(deeps - 1).fill('..'), 'shared_model.g')}';\nexport * from '${join(
            ...Array(deeps - 1).fill('..'),
            'shared_model.g'
          )}';\n\n`
        : `\n\n`;
    modelContent = SwaggerGenTool.modelHeader + shared + modelContent;

    if ((!existsSync(join(dirPath, 'model.g.ts')) || overwrite) && !modelEmpty) writeFile(join(dirPath, 'model.g.ts'), modelContent, 'utf-8');
  }

  public pathParam(p: SwaggerParameter) {
    const name = camelCase(p.name);
    let type = getTsType({ param: p });
    if (type?.endsWith('[]')) {
      const subType = type.substring(0, type.length - 2);
      type = TS_TYPE.includes(subType) ? type : `models.${subType}[]`;
    } else {
      type = TS_TYPE.includes(type!) ? type : `models.${type}`;
    }
    const description = p.description;
    const require = p.required;

    return { name, orgKey: p.name, type, description, require };
  }

  public getDescription(options: IDescriptionOption) {
    const { summary, description, operationId } = options;
    let desc = `\n/**`;
    desc += summary ? `\n * ${summary}` : '';
    desc += description ? `\n * @description ${description}` : '';
    desc += operationId ? `\n * @operationId ${operationId}` : '';
    const { returnType, paths, querys, formData, body } = options;
    if (paths.length > 0 || querys.length > 0 || formData || body) desc += `\n *\n * parameters`;

    paths.forEach(({ type, require, name, description }) => {
      desc += `\n * @pathParam {${type}${require ? '' : '?'}} ${name}${description ? `: ${description}` : ''}`;
    });

    querys.forEach(({ type, require, name, description }) => {
      desc += `\n * @queryParam {${type}${require ? '' : '?'}} ${name}${description ? `: ${description}` : ''}`;
    });

    if (formData) {
      const { type, name, description } = formData;
      desc += `\n * @formDataParam {${type}} ${name}${description ? `: ${description}` : ''}`;
    }
    if (body) {
      const { type, name, description } = body;
      desc += `\n * @bodyParam {${type}} ${name}${description ? `: ${description}` : ''}`;
    }

    desc += `\n * @return {${returnType}}\n */`;

    return desc;
  }

  /**
   * Retrieves the function arguments based on the provided options.
   *
   * @param {Pick<IDescriptionOption, 'formData' | 'body' | 'paths' | 'querys'>} options - The options object containing the formData, body, paths, and querys properties.
   * @returns {string} A string representation of the function arguments.
   */
  public getFunctionArgs(options: Pick<IDescriptionOption, 'formData' | 'body' | 'paths' | 'querys'>) {
    const { paths, querys, formData, body } = options;
    let str = '';
    paths.forEach((p) => {
      str += `${p.name}: ${p.type}, `;
    });
    if (str.length > 2) str = str.substring(0, str.length - 2);

    if (formData) str += `${str.length > 0 ? ', ' : ''}${formData.name}: ${formData.type}`;

    if (body) str += `${str.length > 0 ? ', ' : ''}${body.name}: ${body.type}`;

    let queryType = querys.length > 0 ? '{\n' : '';
    querys.forEach((p) => {
      queryType += `${INDENT} ${p.orgKey}${p.require ? '' : '?'}: ${p.type},\n`;
    });
    if (querys.length > 0) queryType += '}';
    if (queryType.length > 0) str += `${str.length > 0 ? ', ' : ''}query: ${queryType}`;

    return str;
  }

  getSimpleReturnType(responses: JSONSchema | undefined, name: string) {
    if (!responses) return 'void';

    let resClass: string;
    let standardRes: JSONSchema | undefined = SwaggerGenTool.getStandardResponse(responses);
    if (standardRes) {
      const pageData = SwaggerGenTool.getPageResponse(standardRes);
      if (pageData) standardRes = pageData;

      if (standardRes['anyOf']) standardRes = find(standardRes['anyOf'], (item) => item.type !== 'null');
      resClass = standardRes ? getTsType({ property: standardRes, key: name }) : 'void';
    } else {
      resClass = 'any';
    }
    return this.arraySubClass(resClass);
  }

  getReturnType(responses: JSONSchema | undefined, resClassName: string) {
    if (!responses) return 'any';
    let resClass: string | undefined,
      isPagination = false;
    let standardRes: JSONSchema | undefined = SwaggerGenTool.getStandardResponse(responses);
    if (standardRes) {
      const pageData = SwaggerGenTool.getPageResponse(standardRes);
      if (pageData) {
        standardRes = pageData;
        isPagination = true;
      }
      if (standardRes['anyOf']) standardRes = find(standardRes['anyOf'], (item) => item.type !== 'null');
      resClass = standardRes ? getTsType({ property: standardRes, key: resClassName }) : undefined;
    } else {
      resClass = 'any';
    }
    resClass = this.getArrReturnType(resClass, isPagination);
    return resClass !== undefined ? `${resClass}` : 'void';
  }

  getReqArgs(key: string, method: Method, options: Pick<IDescriptionOption, 'formData' | 'body' | 'paths' | 'querys'>) {
    const { paths, querys, formData, body } = options;
    const { urlPrefix } = SwaggerGenTool.config;
    const path = (urlPrefix ?? '') + key;
    if (!formData && !body && paths.length === 0 && querys.length === 0) return `'${path}'`;
    let str = '',
      reqPath = path;

    paths.forEach(({ name }) => {
      if (reqPath.includes(`{${name}}`)) reqPath = reqPath.replace(`{${name}}`, `\${${name}}`);
      else reqPath += reqPath.endsWith('/') ? `\${${name}}` : `/\${${name}}`;
    });
    str += `'${reqPath}'`;
    if (str.includes('${')) str = `\`${str.substring(1, str.length - 1)}\``;

    if (body && ['put', 'post', 'delete'].includes(method)) {
      const { type } = body;
      if (type?.endsWith('[]')) {
        const subType = type.substring(0, type.length - 2);
        str += TS_TYPE.includes(subType) ? ', body' : `, body.map((e) => (new models.${subType}(e)).toJson())`;
      } else {
        str += TS_TYPE.includes(type!) ? ', body' : `, body.toJson()`;
      }
    }
    if (formData && !str.includes(', body') && ['put', 'post'].includes(method)) str += ', body';
    if (querys.length > 0) str += `, query`;
    return str;
  }

  /**
   * Generate the content to be returned based on the responses and result class name.
   *
   * @param {JSONSchema | undefined} responses - The responses JSON schema.
   * @param {string} resClassName - The result class name.
   * @return {string} The content to be returned.
   */
  getReturnContent(responses: JSONSchema | undefined, resClassName: string) {
    const returnType = this.getReturnType(responses, resClassName);
    if (returnType === 'void') return '';
    if (!SwaggerGenTool.getStandardResponse(responses)) return `\n${INDENT}return res;`;

    if (returnType.startsWith('PageResp<')) {
      var subType = returnType.substring(9, returnType.length - 1);
      return `\n${INDENT}const data = res.data?.${LIST_KEY} ? ${
        TS_TYPE.includes(subType) ? `res.data.${LIST_KEY}` : `(res.data.${LIST_KEY} as any[]).map<${subType}>((v: any) => ${subType}.fromJson(v))`
      } : [];
  return { ...res.data, data };`;
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

  /// model
  ///
  getConstructorContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const camelPropertyName = camelCase(propertyName);
      str += `${INDENT}${INDENT}this.${camelPropertyName} = data.${camelPropertyName};\n`;
    }
    str = str.length > 0 ? str.substring(4, str.length - 1) : str;
    return str;
  }

  getPropertiesContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const propType = getTsType({ key: propertyName, property });
      const camelPropertyName = camelCase(propertyName);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, (e) => e.toString().includes('null'));
      if (nullable && require) require = false;

      if (property.title || property.description) str += `${INDENT}/** ${property.title || property.description} */\n`;
      str += `${INDENT}${camelPropertyName}${require ? '' : '?'}: ${propType};\n\n`;
    }
    str = str.length > 0 ? str.substring(2, str.length - 1) : str;
    return str;
  }

  getFromJsonContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = ``;
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const propType = getTsType({ key: propertyName, property });
      const camelPropertyName = camelCase(propertyName);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, (e) => e.toString().includes('null'));
      if (nullable && require && !propType.endsWith('[]')) require = false;

      str += `${INDENT}${INDENT}${INDENT}${camelPropertyName}: `;
      if (propType.endsWith('[]')) {
        const subType = propType.substring(0, propType.length - 2);
        str += `json["${propertyName}"] != null ? ${
          TS_TYPE.includes(subType) ? `json["${propertyName}"]` : `(json["${propertyName}"] as any[]).map<${subType}>((v: any) => ${subType}.fromJson(v))`
        } : [],\n`;
      } else if (!TS_TYPE.includes(propType)) {
        str += require
          ? `${propType}.fromJson(json["${propertyName}"]),\n`
          : `json["${propertyName}"] != null ? ${propType}.fromJson(json["${propertyName}"]) : undefined,\n`;
      } else {
        str += `json["${propertyName}"],\n`;
      }
    }
    str = str.length > 0 ? str.substring(6, str.length - 1) : str;
    return str;
  }

  getToJsonContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '{\n';
    for (const propertyName in properties) {
      const camelPropertyName = camelCase(propertyName);
      const property = properties[propertyName];
      const propType = getTsType({ key: propertyName, property });

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, (e) => e.toString().includes('null'));
      if (nullable && require) require = false;

      str += `${INDENT}${INDENT}${INDENT}"${propertyName}": `;

      if (propType.endsWith('[]')) {
        const subType = propType.substring(0, propType.length - 2);
        if (require) str += `this.${TS_TYPE.includes(subType) ? camelPropertyName : `${camelPropertyName}.map((e: ${subType}) => e.toJson())`},\n`;
        else
          str += `this.${camelPropertyName} != null ? ${
            TS_TYPE.includes(subType) ? `this.${camelPropertyName}` : `this.${camelPropertyName}.map((e: ${subType}) => e.toJson())`
          } : undefined,\n`;
      } else if (!TS_TYPE.includes(propType)) {
        if (require) str += `this.${camelPropertyName}.toJson(),\n`;
        else str += `this.${camelPropertyName} != null ? this.${camelPropertyName}!.toJson() : undefined,\n`;
      } else {
        str += `this.${camelPropertyName},\n`;
      }
    }
    str += `${INDENT}${INDENT}}`;
    return str;
  }
}
