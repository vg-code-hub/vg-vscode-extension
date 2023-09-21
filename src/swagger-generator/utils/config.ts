/*
 * @Author: zdd
 * @Date: 2023-06-05 11:28:07
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-16 08:49:01
 * @FilePath: /vg-vscode-extension/src/swagger-generator/utils/config.ts
 * @Description:
 */
import { existsSync, getConfig, isRegExp, join, readFileSyncToObj, rmSync, writeFile, writeFileSync } from '@root/utils';
import { baiduTranslationHandle, zhiyiTranslationHandle } from '../translation';
import { getRegExp } from './helper';
import { cloneDeep, last } from 'lodash';
import { JSONSchema } from '../index.d';
import { getModelName } from './common';

interface Config {
  jsonUrl: string;
  outputDir: string;
  ignoreResponse?: string;
  pageResponse: { name: string; props: string[] };
  overwrite?: boolean;
  urlPrefix?: string;
  folderFilter?: (string | RegExp)[];
  folderMap?: Record<string, string>;
  customPathFolder?: Map<string | RegExp, string>;
  customModelFolder?: Record<string, string>;
  translationObj?: Record<string, string>;
  rootPath: string;
  type: 'dart' | 'typescript';
}

class SwaggerGenTool {
  private static _instance: SwaggerGenTool;

  static get instance() {
    if (!SwaggerGenTool._instance) SwaggerGenTool._instance = new SwaggerGenTool();
    return SwaggerGenTool._instance;
  }
  /*
    单例模式，仅允许通过 RemoteOption.instance 获取全局唯一实例
  */
  private constructor() {}

  private _config?: Config;
  static dataModels?: Record<string, JSONSchema>;

  static get config() {
    if (!SwaggerGenTool.instance._config) throw Error('config not init');
    return SwaggerGenTool.instance._config;
  }

  static get translationObj() {
    if (!SwaggerGenTool.config.translationObj) return {};
    return SwaggerGenTool.config.translationObj;
  }

  static get pageResDataKey() {
    return last(SwaggerGenTool.config.pageResponse.props)!;
  }

  static checkDataModel() {
    if (!SwaggerGenTool.dataModels) throw Error('please set dataModel');
    return SwaggerGenTool.dataModels;
  }

  static getRealObject = (response?: JSONSchema) => {
    const dataModels = SwaggerGenTool.checkDataModel();
    if (typeof response !== 'object') return undefined;
    if (response.allOf) {
      let rootObj = response.allOf[0];
      for (let index = 0; index < response.allOf.length; index++) {
        const element = response.allOf[index];
        if (index === 0 && rootObj.$ref) {
          const parts = rootObj.$ref.split('/');
          const typeName = getModelName(parts[parts.length - 1]);
          rootObj = dataModels[typeName];
        } else if (element.properties) {
          rootObj.properties = Object.assign({}, rootObj.properties, element.properties);
        }
      }
      return rootObj;
    } else if (typeof response === 'object' && response.type === 'object') {
      return response;
    }
    return undefined;
  };

  static get pageResName() {
    const name = SwaggerGenTool.config.pageResponse.name;
    return name.split('.');
  }

  static get pageResProps() {
    const props = cloneDeep(SwaggerGenTool.config.pageResponse.props);
    return props.slice(0, props.length - 1);
  }

  static get resName() {
    if (!SwaggerGenTool.config.ignoreResponse || !SwaggerGenTool.config.ignoreResponse.includes('.')) return `res.body`;
    const [_, key] = SwaggerGenTool.config.ignoreResponse.split('.');
    return `res.body['${key}']`;
  }

  static getStandardResponse(response?: JSONSchema) {
    if (typeof response !== 'object') return undefined;
    if (!SwaggerGenTool.config.ignoreResponse || !SwaggerGenTool.config.ignoreResponse.includes('.')) return response;
    const [_, key] = SwaggerGenTool.config.ignoreResponse.split('.');

    if (response.allOf) {
      const obj = SwaggerGenTool.getRealObject(response);
      if (obj && obj.properties) return obj.properties[key];
    } else if (typeof response === 'object' && response.type === 'object' && response.properties) {
      return response.properties[key];
    }
    return undefined;
  }

  static getPageResponse(standardResponse: JSONSchema) {
    const props = SwaggerGenTool.config.pageResponse.props;
    const obj = SwaggerGenTool.getRealObject(standardResponse);
    if (!obj) return undefined;
    for (const key in obj.properties) if (!props.includes(key)) return undefined;
    return obj.properties ? obj.properties[SwaggerGenTool.pageResDataKey] : undefined;
  }

  async initConfig(rootPath: string) {
    if (!existsSync(rootPath.concat(`/vgcode.yaml`))) throw Error('config your vgcode.yaml then  try again');

    const { swagger, type } = getConfig();
    let folderFilter: (string | RegExp)[] = [];
    if (swagger.folderFilter) {
      if (!Array.isArray(folderFilter)) throw Error('folderFilter must be array');
      folderFilter = swagger.folderFilter.map(getRegExp);
    }
    let customPathFolder = new Map();
    if (swagger.customPathFolder)
      for (const key in swagger.customPathFolder) {
        const element = swagger.customPathFolder[key];
        let _key = getRegExp(key);
        customPathFolder.set(_key, element);
      }
    if (swagger.urlPrefix && !swagger.urlPrefix.startsWith('/')) swagger.urlPrefix = '/' + swagger.urlPrefix;
    const ignoreResponse = (swagger.ignoreResponse ?? '$1.data').trim();
    const props = (swagger.pageResponse?.props ?? 'page,size,total,items').split(',').map((e) => e.trim());
    const pageResponse = { name: swagger.pageResponse?.name ?? 'PageResp.data', props: props };
    this._config = { ...swagger, type, outputDir: swagger.outputDir ?? 'api', rootPath, folderFilter, customPathFolder, ignoreResponse, pageResponse };
    return this._config;
  }

  static addConfig(config: Partial<Config>) {
    if (!SwaggerGenTool.instance._config) throw Error('config not init');
    const instance = SwaggerGenTool.instance;
    instance._config = { ...instance._config!, ...config };
  }

  static async getTranslateInfo(values: Array<string>, translationPath: string) {
    let translationObj = readFileSyncToObj(translationPath);
    // 过滤掉已翻译的
    values = values.filter((el) => !translationObj.hasOwnProperty(el));
    try {
      await zhiyiTranslationHandle(values, translationObj);
    } catch (error) {
      // 百度翻译处理
      await baiduTranslationHandle(values, translationObj);
    }
    SwaggerGenTool.addConfig({ translationObj });

    // 把翻译的内容写入
    if (Object.keys(translationObj).length !== 0) writeFile(translationPath, JSON.stringify(translationObj, null, 4), 'utf-8');
    else if (existsSync(translationPath)) rmSync(translationPath);
  }

  static testFolder(folder?: string) {
    const folderFilter = this.config.folderFilter;
    if (!folderFilter || !folder || folderFilter.length === 0) return true;
    return folderFilter.some((item) => (isRegExp(item) ? (item as RegExp).test(folder) : folder.startsWith(item as string)));
  }

  static exchangeConfigMap(folder?: string) {
    const folderMap = this.config.folderMap;
    if (!folderMap || !folder) return folder;
    for (const key in folderMap) {
      const element = folderMap[key];
      folder = folder.split(key).join(element);
    }
    return folder;
  }

  static reset() {
    this.instance._config = undefined;
    this.dataModels = undefined;
    this.exceptionString = undefined;
  }

  private static exceptionString?: string;

  static addException(e: string) {
    if (!this.exceptionString) this.exceptionString = '';
    this.exceptionString += `${e}\n`;
  }

  static writeExceptionToFile(dir: string) {
    const path = join(dir, 'exception.text');
    if (this.exceptionString) writeFileSync(path, this.exceptionString, 'utf-8');
    else if (existsSync(path)) rmSync(path);
    this.exceptionString = '';
  }
}

export default SwaggerGenTool;
