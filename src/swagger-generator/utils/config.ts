/*
 * @Author: zdd
 * @Date: 2023-06-05 11:28:07
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-08 15:55:41
 * @FilePath: /vg-vscode-extension/src/swagger-generator/utils/config.ts
 * @Description: 
 */
import { commands } from "vscode";
import { existsSync, getConfig, isRegExp, join, readFileSyncToObj, rmSync, writeFileSync } from "@root/utils";
import { baiduTranslationHandle, zhiyiTranslationHandle } from '../translation';
import { getRegExp } from "./helper";

interface Config {
  jsonUrl: string,
  outputDir: string,
  folderFilter?: (string | RegExp)[],
  folderMap?: Record<string, string>
  customPathFolder?: Map<string | RegExp, string>
  customModelFolder?: Record<string, string>
  translationObj?: Record<string, string>
  rootPath: string
  swaggerVersion: 2 | 3
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
  private constructor() { }

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
  };

  async getConfig(rootPath: string) {
    if (!existsSync(rootPath.concat(`/vgcode.yaml`))) {
      await new Promise<void>((resolve) => {
        commands.executeCommand('extension.vgcode-config-init').then(() => {
          setTimeout(resolve, 100);
        });
      });
      throw Error('config your vgcode.yaml then  try again');
    }

    const data = getConfig().yapi;
    let folderFilter = data.folderFilter;
    if (folderFilter) {
      if (!Array.isArray(folderFilter)) throw Error('folderFilter must be array');
      folderFilter = folderFilter.map(getRegExp);
    }
    let customPathFolder = data.customPathFolder;
    if (customPathFolder) {
      let mapCustomPathFolder = new Map();
      for (const key in customPathFolder) {
        const element = customPathFolder[key];
        let _key = getRegExp(key);
        mapCustomPathFolder.set(_key, element);
      }
      data.customPathFolder = mapCustomPathFolder;
    }

    this._config = { ...data, outputDir: data.outputDir ?? 'api', folderFilter };
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
    if (!folderFilter || !folder) return true;
    return folderFilter.some((item) => isRegExp(item) ? (item as RegExp).test(folder) : folder.startsWith(item as string));
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

  static writeExceptionToFile(modelsDir: string) {
    if (this.exceptionString)
      writeFileSync(
        join(modelsDir, 'exception.text'),
        this.exceptionString,
        'utf-8',
      );
    else
      rmSync(join(modelsDir, 'exception.text'));
    this.exceptionString = '';
  }
}

export default SwaggerConfig;
