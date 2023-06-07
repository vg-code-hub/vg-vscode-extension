
/*
 * @Author: zdd
 * @Date: 2023-06-01 16:59:31
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-07 14:34:11
 * @FilePath: /vg-vscode-extension/src/swagger-generator/utils/common.ts
 * @Description: 
 */
import { SwaggerHttpEndpoint, SwaggerPropertyDefinition } from "../index.d";
import { exchangeZhToEn } from "./helper";
import { first, join, snakeCase, pascalCase } from "@root/util";

/** tab 空格数 */
export const INDENT = '  ';

export const BASE_TYPE = ['int', 'double', 'number', 'boolean', 'File', 'string', 'String', 'DateTime', 'bool', 'Record<string, any>', 'Map<String, dynamic>'];


export function getTsType(key: string, property: SwaggerPropertyDefinition): string {
    const type = Array.isArray(property.type) ? first(property.type) : property.type;
    const format = property.format;
    const subClass = pascalCase(key);

    switch (type) {
        case 'integer':
        case 'number':
            return 'number';
        case 'string':
            return 'string';
        case 'boolean':
            return 'boolean';
        case 'file':
            return 'File';
        case 'object':
            return subClass;
        case 'array':
            const items = property['items'];
            if (items) {
                var itemType = getTsType(key, items);
                return `${itemType}[]`;
            }
            break;
        default:
            const ref = property['$ref'];
            if (ref) {
                const parts = ref.split('/');
                const typeName = parts[parts.length - 1];
                return typeName;
            }
    }
    console.error(key, property, 'getTsType');

    throw Error('Unsupported type: $type');
}


export function getTsSchemaType(property: SwaggerPropertyDefinition): string | undefined {
    const type = Array.isArray(property.type) ? first(property.type) : property.type || ((typeof property.schema === 'string') ? property.schema : property.schema?.type);

    switch (type) {
        case 'integer':
        case 'number':
            return 'number';
        case 'string':
            return 'string';
        case 'boolean':
            return 'boolean';
        case 'file':
            return 'File';
        case 'object':
            return 'Record<string, any>';
        case 'array':
            const items = property['items'];
            if (items) {
                var itemType = getTsSchemaType(items)!;
                itemType = itemType === 'Record<string, any>' ? itemType : pascalCase(itemType);
                return itemType ? `${itemType}[]` : 'any[]';
            }
            break;
        default:
            const ref = property['$ref'];
            if (ref) {
                const parts = ref.split('/');
                const typeName = parts[parts.length - 1];
                return pascalCase(typeName);
            }
    }
    console.error(property, 'getDartSchemaType');

    throw Error('Unsupported type: $type');
}

export function getTsParamType(param: SwaggerHttpEndpoint['parameters'][0], swaggerVersion = 2): string | undefined {
    // TODO: fix swagger3 bug 
    const type = swaggerVersion === 2 ? (param.type ?? param.schema?.type ?? param.schema?.$ref) : (param.schema ? (typeof param.schema === 'string' ? param.schema : param.schema.type) : 'object');
    const format = param.format;

    switch (type) {
        case 'integer':
        case 'number':
            return 'number';
        case 'string':
            return 'string';
        case 'boolean':
            return 'boolean';
        case 'file':
            return 'File';
        case 'object':
            return 'Record<string, any>';
        case 'array':
            const items = swaggerVersion === 2 ? (param.schema?.type ? param['schema']['items'] : param['items']) : param['schema'];
            if (items) {
                var itemType = getDartSchemaType(items);
                return itemType ? `${pascalCase(itemType)}[]` : 'any[]';
            }
            break;
        default:
            const ref = swaggerVersion === 2 ? param['schema']?.['$ref'] : type;
            if (ref) {
                const parts = ref.split('/');
                const typeName = parts[parts.length - 1];
                return pascalCase(typeName);
            }
    }
    console.error(param, swaggerVersion, 'getDartParamType');

    throw Error('Unsupported type: $type');
}

export function getDartType(key: string, property: SwaggerPropertyDefinition): string {
    const type = Array.isArray(property.type) ? first(property.type) : property.type;
    const format = property.format;
    const subClass = pascalCase(key);

    switch (type) {
        case 'integer':
            if (format === 'int32') return 'int';
            else if (format === 'int64') return 'int';
            else return 'int';

        case 'number':
            if (format === 'float') return 'double';
            else if (format === 'double') return 'double';
            else return 'double';

        case 'string':
            if (format === 'date-time')
                return 'DateTime';
            else
                return 'String';

        case 'boolean':
            return 'bool';
        case 'file':
            return 'File';
        case 'object':
            return subClass;
        case 'array':
            const items = property['items'];
            if (items) {
                var itemType = getDartType(key, items);
                return `List<${itemType}>`;
            }
            break;
        default:
            const ref = property['$ref'];
            if (ref) {
                const parts = ref.split('/');
                const typeName = parts[parts.length - 1];
                return typeName;
            }
    }
    console.error(key, property, 'getDartType');

    throw Error('Unsupported type: $type');
}

export function getDartSchemaType(property: SwaggerPropertyDefinition): string | undefined {
    const type = Array.isArray(property.type) ? first(property.type) : property.type || ((typeof property.schema === 'string') ? property.schema : property.schema?.type);
    const format = property.format;

    switch (type) {
        case 'integer':
            if (format === 'int32') return 'int';
            else if (format === 'int64') return 'int';
            else return 'int';
        case 'number':
            if (format === 'float') return 'double';
            else if (format === 'double') return 'double';
            else return 'double';
        case 'string':
            if (format === 'date-time')
                return 'DateTime';
            else
                return 'String';
        case 'boolean':
            return 'bool';
        case 'object':
            return 'Map<String, dynamic>';
        case 'file':
            return 'File';
        case 'array':
            const items = property['items'];
            if (items) {
                var itemType = getDartSchemaType(items)!;
                itemType = itemType === 'Map<String, dynamic>' ? itemType : pascalCase(itemType);
                return itemType ? `List<${itemType}>` : 'List';
            }
            break;
        default:
            const ref = property['$ref'];
            if (ref) {
                const parts = ref.split('/');
                const typeName = parts[parts.length - 1];
                return pascalCase(typeName);
            }
    }
    console.error(property, 'getDartSchemaType');

    throw Error('Unsupported type: $type');
}

export function getDartParamType(param: SwaggerHttpEndpoint['parameters'][0], swaggerVersion = 2): string | undefined {
    // TODO: fix swagger3 bug 
    const type = swaggerVersion === 2 ? (param.type ?? param.schema?.type ?? param.schema?.$ref) : (param.schema ? (typeof param.schema === 'string' ? param.schema : param.schema.type) : 'object');
    const format = param.format;

    switch (type) {
        case 'integer':
            if (format === 'int32') return 'int';
            else if (format === 'int64') return 'int';
            else return 'int';
        case 'number':
            if (format === 'float') return 'double';
            else if (format === 'double') return 'double';
            else return 'double';
        case 'string':
            if (format === 'date-time')
                return 'DateTime';
            else
                return 'String';
        case 'boolean':
            return 'bool';
        case 'object':
            return 'Map<String, dynamic>';
        case 'file':
            return 'File';
        case 'array':
            const items = swaggerVersion === 2 ? (param.schema?.type ? param['schema']['items'] : param['items']) : param['schema'];
            if (items) {
                var itemType = getDartSchemaType(items);
                return itemType ? `List<${pascalCase(itemType)}>` : 'List';
            }
            break;
        default:
            const ref = swaggerVersion === 2 ? param['schema']?.['$ref'] : type;
            if (ref) {
                const parts = ref.split('/');
                const typeName = parts[parts.length - 1];
                return pascalCase(typeName);
            }
    }
    console.error(param, swaggerVersion, 'getDartParamType');

    throw Error('Unsupported type: $type');
}


export const getDirPath = (folder: string | undefined, type: 'entitys' | 'requests', { translationObj, rootPath }: any) => {
    let dirPath: string, deeps = 1, className: string;
    if (folder) {
        const { str: path } = exchangeZhToEn(folder, translationObj);
        dirPath = join(rootPath, type, path.split('/').map(e => snakeCase(e)).join('/'));
        deeps += path.split('/').length;
        className = pascalCase(path.split('/').map(e => snakeCase(e)).join('_') + '_request');
    } else {
        dirPath = join(rootPath, type);
        className = pascalCase('request');
    }
    if (type === 'entitys') return dirPath;
    else
        return {
            className,
            dirPath,
            deeps
        };
};