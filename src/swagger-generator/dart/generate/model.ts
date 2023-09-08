/*
 * @Author: zdd
 * @Date: 2023-05-31 22:05:06
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-08 21:47:49
 * @FilePath: /vg-vscode-extension/src/swagger-generator/dart/generate/model.ts
 * @Description:
 */
import { find, camelCase, pascalCase } from '@root/utils';
import type { JSONSchema } from '../../index.d';
import { DART_TYPE, INDENT, SwaggerConfig, getDartType } from '../../utils';

class ModelGenerate {
  data: Record<string, JSONSchema>;
  content: string;

  constructor(data: Record<string, JSONSchema>) {
    this.data = data;
    this.content = '';
  }

  generateModel(className: string, content: string, _value?: JSONSchema) {
    const value = this.data[className] ?? _value;
    this.content = content;
    if (!value) return content;
    if (!this.data[className] && _value) SwaggerConfig.addException(`info: auto create [class ${className}] in some object propertys`);
    if (this.content.includes(`class ${className} `)) {
      SwaggerConfig.addException(`warn: [class ${className}] already exists, please check orginal swagger.json`);
      return this.content;
    }

    const constructorContent = this.getConstructorContent(value.properties, value.required);

    this.content += `
class ${className} {
  ${className}(${
      constructorContent.length === 0
        ? ''
        : `{
    ${constructorContent}
  }`
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
    this.checkSubGen(value.properties);

    return this.content;
  }

  generateOtherModel(className: string, value: any) {
    if (this.content.includes(`class ${className} `)) {
      SwaggerConfig.addException(`warn: [class ${className}] already exists, please check orginal swagger.json`);
      return;
    }
    if (!value.properties) value = this.data[className];
    const constructorContent = this.getConstructorContent(value.properties, value.required);

    this.content += `
class ${className} {
  ${className}(${
      constructorContent.length === 0
        ? ''
        : `{
    ${constructorContent}
  }`
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
    this.checkSubGen(value.properties);
  }

  getConstructorContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '';
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
    str = str.length > 0 ? str.substring(4, str.length - 1) : str;
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
        str += `json["${propertyName}"] != null ? ${
          DART_TYPE.includes(subType)
            ? `json["${propertyName}"] as List<${subType}>`
            : `List<${subType}>.from(json["${propertyName}"].map((e) => ${subType}.fromJson(e)))`
        } : [],\n`;
      } else if (!DART_TYPE.includes(dartType)) {
        str += require
          ? `${dartType}.fromJson(json["${propertyName}"]),\n`
          : `json["${propertyName}"] != null ? ${dartType}.fromJson(json["${propertyName}"]) : null,\n`;
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

  checkSubGen(properties: JSONSchema['properties']) {
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const dartType = getDartType({ key: propertyName, property });
      if (dartType.startsWith('List')) {
        var subType = dartType.substring(5, dartType.length - 1);
        if (!DART_TYPE.includes(subType)) this.generateOtherModel(subType, property.items);
      } else if (!DART_TYPE.includes(dartType)) {
        this.generateOtherModel(dartType, property);
      }
    }
  }
}

export default ModelGenerate;
