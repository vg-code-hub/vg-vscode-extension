
/*
 * @Author: zdd
 * @Date: 2023-05-31 22:05:06
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-09 12:27:53
 * @FilePath: /vg-vscode-extension/src/swagger-generator/ts/generate/model.ts
 * @Description: 
 */
import { existsSync, writeFileSync, mkdirpSync, join, find, camelCase, pascalCase } from "@root/util";
import type { SwaggerSchema, SwaggerSchemaProperties, SwaggerSchemas } from "../../index.d";
import { BASE_TYPE, INDENT, SwaggerConfig, getTsType, getDirPath } from "../../utils";

class ModelGenerate {
  data: SwaggerSchemas;
  filesMap: Record<string, string>;

  constructor(data: SwaggerSchemas) {
    this.data = data;
    this.filesMap = {};
  }

  async generateAllModel() {
    for (let key in this.data)
      this.generateModel(key, this.data[key]);

    const modelsDir = join(SwaggerConfig.config.rootPath, 'entitys');

    let str = '';
    // model内容写入
    for (let key in this.filesMap) {
      str += `export * from '.${key.replace(modelsDir, '')}/model.g';\n`;
      if (!existsSync(join(key, 'model.g.ts')))
        writeFileSync(
          join(key, 'model.g.ts'),
          this.filesMap[key],
          'utf-8',
        );
      else
        writeFileSync(
          join(key, 'model.g.vg'),
          this.filesMap[key],
          'utf-8',
        );
    }
    // 内容写入 index.ts
    if (!existsSync(join(modelsDir, 'index.ts')))
      writeFileSync(
        join(modelsDir, 'index.ts'),
        str,
        'utf-8',
      );
    writeFileSync(
      join(modelsDir, 'index.text'),
      str,
      'utf-8',
    );
    SwaggerConfig.writeExceptionToFile(modelsDir);
  }

  generateModel(key: string, value: SwaggerSchema) {
    const className = pascalCase(key);
    const { rootPath, customModelFolder } = SwaggerConfig.config;
    let folder;
    if (customModelFolder && customModelFolder[className]) {
      folder = customModelFolder[className];
    } else {
      folder = value["x-apifox-folder"];
      if (!SwaggerConfig.testFolder(folder ?? '')) return;
      folder = SwaggerConfig.exchangeConfigMap(folder);
    }

    const translationObj = SwaggerConfig.translationObj;
    let dirPath: string = getDirPath(folder, 'entitys', { translationObj, rootPath }) as string;

    if (!existsSync(dirPath)) mkdirpSync(dirPath);
    if (!this.filesMap[dirPath]) this.filesMap[dirPath] = '// This file is generated by the VG SwaggerGenerator.\n// You can modify it so that the next generation will not overwrite it, but instead generate a suffix file with the same name [.vg]\n';

    if (this.filesMap[dirPath].includes(`class ${className} `)) {
      SwaggerConfig.addException(`warn: [class ${className}] already exists, please check orginal swagger.json`);
      return;
    }

    this.filesMap[dirPath] += `
export class ${className} {
  ${this.getPropertiesContent(value.properties, value.required)}
  constructor(data: Omit<${className}, 'toJson'>) {
    ${this.getConstructorContent(value.properties, value.required)}
  }

  static fromJson(json: any): ${className} {
    return new ${className}({
      ${this.getFromJsonContent(value.properties, value.required)}
    });
  }

  toJson(): any {
    return ${this.getToJsonContent(value.properties, value.required)};
  }
}
`;
    this.checkSubGen(value.properties, dirPath);
  }

  generateOtherModel(dirPath: string, className: string, value: any) {
    if (this.filesMap[dirPath].includes(`class ${className} `)) {
      SwaggerConfig.addException(`warn: [class ${className}] already exists, please check orginal swagger.json`);
      return;
    }

    this.filesMap[dirPath] += `
export class ${className} {
  ${this.getPropertiesContent(value.properties, value.required)}
  constructor(data: Omit<${className}, 'toJson'>) {
    ${this.getConstructorContent(value.properties, value.required)}
  }

  static fromJson(json: any): ${className} {
    return new ${className}({
      ${this.getFromJsonContent(value.properties, value.required)}
    });
  }

  toJson(): any {
    return ${this.getToJsonContent(value.properties, value.required)};
  }
}
`;
    this.checkSubGen(value.properties, dirPath);
  }

  getPropertiesContent(properties: SwaggerSchemaProperties, required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const propType = getTsType(propertyName, property, true);
      const camelPropertyName = camelCase(propertyName);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, e => e.toString().includes('null'));
      if (nullable && require) require = false;

      if (property.title || property.description) str += `${INDENT}/** ${property.title || property.description} */\n`;
      str += `${INDENT}${camelPropertyName}${require ? '' : '?'}: ${propType};\n\n`;
    }
    str = str.length > 0 ? str.substring(2, str.length - 1) : str;
    return str;
  }

  getConstructorContent(properties: SwaggerSchemaProperties, required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const camelPropertyName = camelCase(propertyName);
      str += `${INDENT}${INDENT}this.${camelPropertyName} = data.${camelPropertyName};\n`;
    }
    str = str.length > 0 ? str.substring(4, str.length - 1) : str;
    return str;
  }

  getFromJsonContent(properties: SwaggerSchemaProperties, required: (string | number)[] | undefined) {
    let str = ``;
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const propType = getTsType(propertyName, property);
      const camelPropertyName = camelCase(propertyName);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, e => e.toString().includes('null'));
      if (nullable && require && !propType.endsWith('[]')) require = false;

      str += `${INDENT}${INDENT}${INDENT}${camelPropertyName}: `;
      if (propType.endsWith('[]')) {
        const subType = propType.substring(0, propType.length - 2);
        str += `json["${propertyName}"] != null ? ${BASE_TYPE.includes(subType) ? `json["${propertyName}"]` : `(json["${propertyName}"] as any[]).map<${subType}>((v: any) => ${subType}.fromJson(v))`} : [],\n`;
      } else if (!BASE_TYPE.includes(propType)) {
        str += require ? `${propType}.fromJson(json["${propertyName}"]),\n` : `json["${propertyName}"] != null ? ${propType}.fromJson(json["${propertyName}"]) : null,\n`;
      } else {
        str += `json["${propertyName}"],\n`;
      }
    }
    str = str.length > 0 ? str.substring(6, str.length - 1) : str;
    return str;
  }

  getToJsonContent(properties: SwaggerSchemaProperties, required: (string | number)[] | undefined) {
    let str = '{\n';
    for (const propertyName in properties) {
      const camelPropertyName = camelCase(propertyName);
      const property = properties[propertyName];
      const propType = getTsType(propertyName, property);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, e => e.toString().includes('null'));
      if (nullable && require) require = false;

      str += `${INDENT}${INDENT}${INDENT}"${propertyName}": `;

      if (propType.endsWith('[]')) {
        const subType = propType.substring(0, propType.length - 2);
        if (require)
          str += `this.${BASE_TYPE.includes(subType) ? camelPropertyName : `${camelPropertyName}.map((e: ${subType}) => e.toJson())`},\n`;
        else
          str += `this.${camelPropertyName} != null ? ${BASE_TYPE.includes(subType) ? `this.${camelPropertyName}` : `this.${camelPropertyName}.map((e: ${subType}) => e.toJson())`} : null,\n`;
      } else if (!BASE_TYPE.includes(propType)) {
        if (require)
          str += `this.${camelPropertyName}.toJson(),\n`;
        else
          str += `this.${camelPropertyName} != null ? this.${camelPropertyName}!.toJson() : null,\n`;

      } else {
        str += `this.${camelPropertyName},\n`;
      }
    }
    str += `${INDENT}${INDENT}}`;
    return str;
  }

  checkSubGen(properties: SwaggerSchemaProperties, dirPath: string) {
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const propType = getTsType(propertyName, property);
      if (propType.endsWith('[]')) {
        var subType = propType.substring(0, propType.length - 2);
        if (!BASE_TYPE.includes(subType)) this.generateOtherModel(dirPath, subType, property.items);
      } else if (!BASE_TYPE.includes(propType)) {
        this.generateOtherModel(dirPath, propType, property);
      }
    }
  }
}

export default ModelGenerate;