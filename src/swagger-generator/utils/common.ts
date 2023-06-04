
/*
 * @Author: zdd
 * @Date: 2023-06-01 16:59:31
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-04 20:09:55
 * @FilePath: /vg-vscode-extension/src/swagger-generator/utils/common.ts
 * @Description: 
 */
import { first } from "lodash";
import { SwaggerHttpEndpoint, SwaggerPropertyDefinition } from "../index.d";
import * as changeCase from "change-case";
import { exchangeZhToEn } from "./helper";
import { join } from "path";

const fs = require("fs");
const paths = require("path");

/** tab 空格数 */
export const INDENT = '  ';

export const BASE_TYPE = ['int', 'double', 'string', 'String', 'DateTime', 'bool'];

export function getDartType(key: string, property: SwaggerPropertyDefinition): string {
    const type = Array.isArray(property.type) ? first(property.type) : property.type;
    const format = property.format;
    const subClass = changeCase.pascalCase(key);

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
                itemType = itemType === 'Map<String, dynamic>' ? itemType : changeCase.pascalCase(itemType);
                return itemType ? `List<${itemType}>` : 'List';
            }
            break;
        default:
            const ref = property['$ref'];
            if (ref) {
                const parts = ref.split('/');
                const typeName = parts[parts.length - 1];
                return changeCase.pascalCase(typeName);
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
                return itemType ? `List<${changeCase.pascalCase(itemType)}>` : 'List';
            }
            break;
        default:
            const ref = swaggerVersion === 2 ? param['schema']?.['$ref'] : type;
            if (ref) {
                const parts = ref.split('/');
                const typeName = parts[parts.length - 1];
                return changeCase.pascalCase(typeName);
            }
    }
    console.error(param, swaggerVersion, 'getDartParamType');

    throw Error('Unsupported type: $type');
}

/**
 * @param key 含有处理特殊字符«» 【】 {} [] () （），如a«b«c»» 转换成a_b_c;
 */
export const handleSpecialSymbol = (key: string | any) => {
    return typeof key !== "string"
        ? key
        : key
            .replace(/[\«|\(|\（|\【|\[|\{]/g, "_")
            .replace(/[\»|\)|\）|\】|\]|\}]/g, "")
            .replace(
                /[\?|\？|\,|\，|\.|\。|\-|\/|\、|\=|\'|\"|\’|\‘|\“|\”|\s]/g,
                ""
            );
};

/**
 * 删除文件
 * @param path string;
 * @param options.deleteCurrPath 默认true 删除所有文件和文件夹，保存当前文件，false保留当前文件夹
 * @param options.ignore 不删除某些文件或者文件夹
 */

export const delDir = (
    path: string,
    options?: { deleteCurrPath: boolean; ignore: Array<string> }
) => {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file: string) => {
            let curPath = paths.resolve(path, file);
            if (fs.statSync(curPath).isDirectory()) {
                if (options && options?.ignore.includes(curPath)) return;
                delDir(curPath); //递归删除文件夹
            } else {
                if (options && options?.ignore.includes(curPath)) return;
                fs.unlinkSync(curPath); //删除文件
            }
        });
        (!options || options.deleteCurrPath === true) && fs.rmdirSync(path); // 删除文件夹自身
    }
};

export const getDirPath = (folder: string | undefined, type: 'entitys' | 'requests', { translateJson, rootPath }: any) => {
    let dirPath: string, deeps = 1, className: string;
    if (folder) {
        const { str: path } = exchangeZhToEn(folder, translateJson);
        dirPath = join(rootPath, type, path.split('/').map(e => changeCase.snakeCase(e)).join('/'));
        deeps += path.split('/').length;
        className = changeCase.pascalCase(path.split('/').map(e => changeCase.snakeCase(e)).join('_') + '_request');
    } else {
        dirPath = join(rootPath, type);
        className = changeCase.pascalCase('request');
    }
    if (type === 'entitys') return dirPath;
    else
        return {
            className,
            dirPath,
            deeps
        };
};
