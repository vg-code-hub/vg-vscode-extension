/*
 * @Author: zdd
 * @Date: 2023-05-31 22:05:06
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-15 15:59:43
 * @FilePath: /vg-vscode-extension/src/swagger-generator/generate/model.ts
 * @Description:
 */
import type { FilesMapModel, JSONSchema } from '../index.d';
import { SwaggerGenTool } from '../utils';

class ModelGenerate {
  get data(): Record<string, JSONSchema> {
    return SwaggerGenTool.dataModels;
  }

  content: FilesMapModel;

  constructor() {
    this.content = [];
  }

  private hasSameClassname(className: string) {
    this.content.forEach(([name]) => {
      if (name === className) {
        SwaggerGenTool.addException(`warn: [class ${className}] already exists, please check orginal swagger.json`);
        return true;
      }
    });
    return false;
  }

  generateModel(className: string, content: FilesMapModel, _value?: JSONSchema) {
    const value = this.data[className] ?? _value;
    this.content = content;
    if (!value) return content;
    if (!this.data[className] && _value) SwaggerGenTool.addException(`info: auto create [class ${className}] in some object propertys`);
    if (this.hasSameClassname(className)) return this.content;

    if (SwaggerGenTool.isEnumObject(value)) {
      const { getEnumModelContent } = SwaggerGenTool.implementor;
      const modelContent = getEnumModelContent(className, value);

      this.content.push([className, modelContent]);
      this.checkSubGen(value.properties);
      return this.content;
    }
    const modelContent = SwaggerGenTool.implementor.getModelContent(className, value);

    this.content.push([className, modelContent]);
    this.checkSubGen(value.properties);
    return this.content;
  }

  generateOtherModel(className: string, value: JSONSchema | undefined) {
    if (this.hasSameClassname(className) || !value) return;

    if (!value.properties) value = this.data[className];

    if (SwaggerGenTool.isEnumObject(value)) {
      const { getEnumModelContent } = SwaggerGenTool.implementor;
      const modelContent = getEnumModelContent(className, value);

      this.content.push([className, modelContent]);
      this.checkSubGen(value.properties);
      return;
    }
    const modelContent = SwaggerGenTool.implementor.getModelContent(className, value);

    this.content.push([className, modelContent]);
    this.checkSubGen(value.properties);
  }

  checkSubGen(properties: JSONSchema['properties']) {
    for (const propertyName in properties) {
      const property = properties[propertyName];
      const propType = SwaggerGenTool.implementor.getSchameType({ key: propertyName, property });
      const { baseTypes, isArrPropType, arraySubClass } = SwaggerGenTool.implementor;

      if (isArrPropType(propType)) {
        var subType = arraySubClass(propType);
        if (!baseTypes.includes(subType)) this.generateOtherModel(subType, property.items);
      } else if (!baseTypes.includes(propType)) {
        this.generateOtherModel(propType, property);
      }
    }
  }
}

export default ModelGenerate;
