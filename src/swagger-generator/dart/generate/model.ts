
/*
 * @Author: zdd
 * @Date: 2023-05-31 22:05:06
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-09 20:31:07
 * @FilePath: /vg-vscode-extension/src/swagger-generator/dart/generate/model.ts
 * @Description: 
 */
import { existsSync, writeFileSync, mkdirpSync, join, find, camelCase, pascalCase } from "@root/util";
import type { SwaggerSchema, SwaggerSchemaProperties, SwaggerSchemas } from "../../index.d";
import { BASE_TYPE, INDENT, SwaggerConfig, getDartType, getDirPath } from "../../utils";

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

    let str = 'library entitys;\n\n';
    const modelsDir = join(SwaggerConfig.config.rootPath, 'entitys');

    // model内容写入
    for (let key in this.filesMap) {
      str += `export '.${key.replace(modelsDir, '')}/model.g.dart';\n`;
      if (!existsSync(join(key, 'model.g.dart')))
        writeFileSync(
          join(key, 'model.g.dart'),
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
    // 内容写入 index.dart
    if (!existsSync(join(modelsDir, 'index.dart')))
      writeFileSync(
        join(modelsDir, 'index.dart'),
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
    if (!this.filesMap[dirPath]) this.filesMap[dirPath] = '/// This file is generated by the VG SwaggerGenerator.\n/// You can modify it so that the next generation will not overwrite it, but instead generate a suffix file with the same name [.vg]\n';

    if (this.filesMap[dirPath].includes(`class ${className} `)) {
      SwaggerConfig.addException(`warn: [class ${className}] already exists, please check orginal swagger.json`);
      return;
    }

    this.filesMap[dirPath] += `
class ${className} {
  ${className}({
    ${this.getConstructorContent(value.properties, value.required)}
  });

  ${this.getPropertiesContent(value.properties, value.required)}

  factory ${className}.fromJson(Map<String, dynamic> json) => ${className}(
    ${this.getFromJsonContent(value.properties, value.required)}
  );

  Map<String, dynamic> toJson() => {
    ${this.getToJsonContent(value.properties, value.required)}
  };
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
class ${className} {
  ${className}({
    ${this.getConstructorContent(value.properties, value.required)}
  });

  ${this.getPropertiesContent(value.properties, value.required)}

  factory ${className}.fromJson(Map<String, dynamic> json) => ${className}(
    ${this.getFromJsonContent(value.properties, value.required)}
  );

  Map<String, dynamic> toJson() => {
    ${this.getToJsonContent(value.properties, value.required)}
  };
}
`;
    this.checkSubGen(value.properties, dirPath);
  }

  getConstructorContent(properties: SwaggerSchemaProperties, required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const dartType = getDartType(propertyName, property);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, e => e.toString().includes('null'));
      if (nullable && require && !dartType.startsWith('List')) require = false;

      const camelPropertyName = camelCase(propertyName);
      str += `${INDENT}${INDENT}${require ? 'required ' : ''}this.${camelPropertyName},\n`;
    }
    str = str.length > 0 ? str.substring(4, str.length - 1) : str;
    return str;
  }

  getPropertiesContent(properties: SwaggerSchemaProperties, required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const dartType = getDartType(propertyName, property, true);
      const camelPropertyName = camelCase(propertyName);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, e => e.toString().includes('null'));
      if (nullable && require && !dartType.startsWith('List')) require = false;

      if (property.title || property.description) str += `${INDENT}/// ${property.title || property.description} \n`;
      str += `${INDENT}${dartType}${require ? '' : '?'} ${camelPropertyName}; \n\n`;
    }
    str = str.length > 0 ? str.substring(2, str.length - 1) : str;
    return str;
  }

  getFromJsonContent(properties: SwaggerSchemaProperties, required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const dartType = getDartType(propertyName, property);
      const camelPropertyName = camelCase(propertyName);

      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, e => e.toString().includes('null'));
      if (nullable && require && !dartType.startsWith('List')) require = false;

      str += `${INDENT}${INDENT}${camelPropertyName}: `;
      if (dartType.startsWith('List')) {
        var subType = dartType.substring(5, dartType.length - 1);
        str += `json["${propertyName}"] != null ? List<${subType}>.from(json["${propertyName}"].map((x) => ${BASE_TYPE.includes(subType) ? `x${subType === 'double' ? '.toDouble()' : ''}` : `${subType}.fromJson(x)`})) : [],\n`;
      } else if (!BASE_TYPE.includes(dartType)) {
        str += require ? `${dartType}.fromJson(json["${propertyName}"]),\n` : `json["${propertyName}"] != null ? ${dartType}.fromJson(json["${propertyName}"]) : null,\n`;
      } else {
        str += `json["${propertyName}"]${dartType === 'double' ? '.toDouble()' : ''},\n`;
      }
    }
    str = str.length > 0 ? str.substring(4, str.length - 1) : str;
    return str;
  }

  getToJsonContent(properties: SwaggerSchemaProperties, required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {

      const camelPropertyName = camelCase(propertyName);
      const property = properties[propertyName];
      const dartType = getDartType(propertyName, property);
      let require = required?.includes(propertyName) ?? false;
      // nullable swagger 3+
      const nullable = Array.isArray(property.type) && find(property.type, e => e.toString().includes('null'));
      if (nullable && require && !dartType.startsWith('List')) require = false;

      str += `${INDENT}${INDENT}"${propertyName}": `;

      if (dartType.startsWith('List')) {
        var subType = dartType.substring(5, dartType.length - 1);
        if (require)
          str += `${camelPropertyName}.map((e) => ${BASE_TYPE.includes(subType) ? 'e' : 'e.toJson()'}).toList(),\n`;
        else
          str += `${camelPropertyName} != null ? ${camelPropertyName}!.map((e) => ${BASE_TYPE.includes(subType) ? 'e' : 'e.toJson()'}).toList() : null,\n`;
      } else if (!BASE_TYPE.includes(dartType)) {
        if (require)
          str += `${camelPropertyName}.toJson(),\n`;
        else
          str += `${camelPropertyName} != null ? ${camelPropertyName}!.toJson() : null,\n`;

      } else {
        str += `${camelPropertyName},\n`;
      }
    }
    str = str.length > 0 ? str.substring(4, str.length - 1) : str;
    return str;
  }

  checkSubGen(properties: SwaggerSchemaProperties, dirPath: string) {
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const dartType = getDartType(propertyName, property);
      if (dartType.startsWith('List')) {
        var subType = dartType.substring(5, dartType.length - 1);
        if (!BASE_TYPE.includes(subType)) this.generateOtherModel(dirPath, subType, property.items);
      } else if (!BASE_TYPE.includes(dartType)) {
        this.generateOtherModel(dirPath, dartType, property);
      }
    }
  }
}

export default ModelGenerate;