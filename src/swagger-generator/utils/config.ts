/*
 * @Author: zdd
 * @Date: 2023-06-05 11:28:07
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-11 17:14:02
 * @FilePath: /vg-vscode-extension/src/swagger-generator/utils/config.ts
 * @Description:
 */
import { existsSync, getConfig, isRegExp, join, readFileSyncToObj, rmSync, writeFileSync } from '@root/utils';
import { baiduTranslationHandle, zhiyiTranslationHandle } from '../translation';
import { getRegExp } from './helper';

interface Config {
  jsonUrl: string;
  outputDir: string;
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

class SwaggerConfig {
  private static _instance: SwaggerConfig;

  static get instance() {
    if (!SwaggerConfig._instance) SwaggerConfig._instance = new SwaggerConfig();
    return SwaggerConfig._instance;
  }
  /*
    单例模式，仅允许通过 RemoteOption.instance 获取全局唯一实例
  */
  private constructor() {}

  private _config?: Config;

  static get config() {
    if (!SwaggerConfig.instance._config) throw Error('config not init');
    return SwaggerConfig.instance._config;
  }

  static get translationObj() {
    if (!SwaggerConfig.config.translationObj) return {};
    return SwaggerConfig.config.translationObj;
  }

  get config() {
    if (!this._config) throw Error('config not init');
    return this._config;
  }

  async getConfig(rootPath: string) {
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
    this._config = { ...swagger, type, outputDir: swagger.outputDir ?? 'api', rootPath, folderFilter, customPathFolder };
    return this.config;
  }

  addConfig(config: Partial<Config>) {
    if (!this._config) throw Error('config not init');
    this._config = { ...this._config, ...config };
  }

  async getTranslateInfo(values: Array<string>, translationPath: string) {
    let translationObj = readFileSyncToObj(translationPath);
    // 过滤掉已翻译的
    values = values.filter((el) => !translationObj.hasOwnProperty(el));
    try {
      await zhiyiTranslationHandle(values, translationObj);
    } catch (error) {
      // 百度翻译处理
      await baiduTranslationHandle(values, translationObj);
    }
    this.addConfig({ translationObj });
    return translationObj;
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

export default SwaggerConfig;
