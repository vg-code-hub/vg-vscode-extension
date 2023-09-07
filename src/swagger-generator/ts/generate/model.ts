
/*
 * @Author: zdd
 * @Date: 2023-05-31 22:05:06
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-07 14:20:54
 * @FilePath: /vg-vscode-extension/src/swagger-generator/ts/generate/model.ts
 * @Description: 
 */
import { find, camelCase } from "@root/utils";
import type { JSONSchema } from "../../index.d";
import { TS_TYPE, INDENT, SwaggerConfig, getTsType } from "../../utils";

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
    if (!this.data[className] && _value) 
      SwaggerConfig.addException(`info: auto create [class ${className}] in some object propertys`);
    if (this.content.includes(`class ${className} `)) {
      SwaggerConfig.addException(`warn: [class ${className}] already exists, please check orginal swagger.json`);
      return this.content;
    }

    this.content += `
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
    this.checkSubGen(value.properties);
    return this.content;
  }

  generateOtherModel(className: string, value: any) {
    if (this.content.includes(`class ${className} `)) {
      SwaggerConfig.addException(`warn: [class ${className}] already exists, please check orginal swagger.json`);
      return;
    }
    if (!value.properties) value = this.data[className];

    this.content += `
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
    this.checkSubGen(value.properties);
  }

  getPropertiesContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const propType = getTsType({ key: propertyName, property });
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

  getConstructorContent(properties: JSONSchema['properties'], required: (string | number)[] | undefined) {
    let str = '';
    for (const propertyName in properties) {
      const camelPropertyName = camelCase(propertyName);
      str += `${INDENT}${INDENT}this.${camelPropertyName} = data.${camelPropertyName};\n`;
    }
    str = str.length > 0 ? str.substring(4, str.length - 1) : str;
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
      const nullable = Array.isArray(property.type) && find(property.type, e => e.toString().includes('null'));
      if (nullable && require && !propType.endsWith('[]')) require = false;

      str += `${INDENT}${INDENT}${INDENT}${camelPropertyName}: `;
      if (propType.endsWith('[]')) {
        const subType = propType.substring(0, propType.length - 2);
        str += `json["${propertyName}"] != null ? ${TS_TYPE.includes(subType) ? `json["${propertyName}"]` : `(json["${propertyName}"] as any[]).map<${subType}>((v: any) => ${subType}.fromJson(v))`} : [],\n`;
      } else if (!TS_TYPE.includes(propType)) {
        str += require ? `${propType}.fromJson(json["${propertyName}"]),\n` : `json["${propertyName}"] != null ? ${propType}.fromJson(json["${propertyName}"]) : undefined,\n`;
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
      const nullable = Array.isArray(property.type) && find(property.type, e => e.toString().includes('null'));
      if (nullable && require) require = false;

      str += `${INDENT}${INDENT}${INDENT}"${propertyName}": `;

      if (propType.endsWith('[]')) {
        const subType = propType.substring(0, propType.length - 2);
        if (require)
          str += `this.${TS_TYPE.includes(subType) ? camelPropertyName : `${camelPropertyName}.map((e: ${subType}) => e.toJson())`},\n`;
        else
          str += `this.${camelPropertyName} != null ? ${TS_TYPE.includes(subType) ? `this.${camelPropertyName}` : `this.${camelPropertyName}.map((e: ${subType}) => e.toJson())`} : undefined,\n`;
      } else if (!TS_TYPE.includes(propType)) {
        if (require)
          str += `this.${camelPropertyName}.toJson(),\n`;
        else
          str += `this.${camelPropertyName} != null ? this.${camelPropertyName}!.toJson() : undefined,\n`;

      } else {
        str += `this.${camelPropertyName},\n`;
      }
    }
    str += `${INDENT}${INDENT}}`;
    return str;
  }

  checkSubGen(properties: JSONSchema['properties']) {
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const propType = getTsType({ key: propertyName, property });
      if (propType.endsWith('[]')) {
        var subType = propType.substring(0, propType.length - 2);
        if (!TS_TYPE.includes(subType)) this.generateOtherModel(subType, property.items);
      } else if (!TS_TYPE.includes(propType)) {
        this.generateOtherModel(propType, property);
      }
    }
  }
}

export default ModelGenerate;