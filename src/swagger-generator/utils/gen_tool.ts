/*
 * @Author: zdd
 * @Date: 2023-06-05 11:28:07
 * @LastEditors: zdd jimmyzhao163@163.com
 * @LastEditTime: 2025-04-08 15:47:11
 * @FilePath: gen_tool.ts
 * @Description:
 */
import {
  Material,
  VGConfig,
  existsSync,
  getFileContent,
  getLocalMaterials,
  isRegExp,
  join,
  mkdirp,
  readFileSyncToObj,
  rmSync,
  rootPath,
  writeFile,
  writeFileSync,
} from '@root/utils';
import { baiduTranslationHandle, zhiyiTranslationHandle } from '../translation';
import { cloneDeep, find, last, snakeCase } from 'lodash';
import { getModelName } from './common';
import { JSONSchema, Method, Swagger, SwaggerHttpEndpoint } from '../index.d';
import { DartPlatformImplementor, PlatformImplementor, TsPlatformImplementor } from '../generate';
import { getSimpleData } from '../http';
import { collectChinese } from './helper';

type CommonScript = {
  // 响应结构配置
  response?: {
    dataName: string;
    // 分页类名
    // 例：PageData.data (PageData 表示公共分页类，data 表示数据字段)
    pagingName: string;
    // 分页props
    // 参数最后一项会映射为类名数据字段[data]。
    pagingProps: string[];
  };
  isEnumObject?: (response?: JSONSchema) => boolean;
  getStandardResponse?: (response: JSONSchema | undefined, realRes: JSONSchema | undefined) => [JSONSchema | undefined, boolean];
};

type RequestScript = {
  getPagingReturnContent?: (subType: string, suffix: string | boolean) => string;
};

class SwaggerGenTool {
  private static _instance: SwaggerGenTool;
  private static _translationObj?: Record<string, string>;
  private static commonScript: CommonScript | undefined;
  static requestScript: RequestScript | undefined;
  private static _dataModels?: Record<string, JSONSchema>;

  static get instance() {
    if (!SwaggerGenTool._instance) SwaggerGenTool._instance = new SwaggerGenTool();
    return SwaggerGenTool._instance;
  }
  /*
    单例模式，仅允许通过 RemoteOption.instance 获取全局唯一实例
  */
  private constructor() {}

  static get config() {
    if (!VGConfig.swaggerConfig) throw Error('config not init');
    return VGConfig.swaggerConfig;
  }

  static get targetDirectory() {
    if (!VGConfig.swaggerConfig) throw Error('config not init');
    const { outputDir } = VGConfig.swaggerConfig;
    return outputDir.startsWith('/') ? join(rootPath, outputDir) : join(rootPath, 'lib', outputDir);
  }

  static get modelHeader(): string {
    return `// This file is generated by the VG SwaggerGenerator.
// ${
      this.config.overwrite
        ? 'Do not edit, next time generation will overwrite it!'
        : 'Next time generation will not overwrite it, but instead generate a suffix of (.vg) file with the same name.'
    }`;
  }

  static get translationObj() {
    if (!this._translationObj) return {};
    return this._translationObj;
  }

  static getFolder(key: string, method: Method, value: SwaggerHttpEndpoint) {
    const { customPathFolder } = SwaggerGenTool.config;
    let folder: string | undefined;
    if (customPathFolder)
      for (const customKey of customPathFolder.keys())
        if (isRegExp(customKey) && (customKey as RegExp).test(key)) {
          folder = customPathFolder.get(customKey);
          break;
        } else if (!isRegExp(customKey) && key.startsWith(customKey as string)) {
          folder = customPathFolder.get(customKey);
          break;
        }

    if (!folder) {
      folder = value['x-apifox-folder'];
      if (!folder && value.tags && value.tags.length > 0) folder = value.tags[0];
      folder = SwaggerGenTool.exchangeConfigMap(folder);
    }

    if (!SwaggerGenTool.testFolder(folder ?? '')) return;
    if (!SwaggerGenTool.testPath(`${method.toLowerCase()}&&${key}`)) return;
    return folder;
  }

  static async reqSwaggerData(fromLocal?: boolean) {
    if (fromLocal) {
      const targetDirectory = SwaggerGenTool.targetDirectory;
      var schemaFullPath = join(targetDirectory, 'swagger.json');
      if (!existsSync(schemaFullPath)) throw new Error('schema不存在');
      const { data, paths } = JSON.parse(getFileContent(schemaFullPath, true) || '{data:{}}') as Swagger;
      this._dataModels = data;
      return { data, paths };
    }
    SwaggerGenTool.setSwagger2apiScript();
    const { jsonUrl } = VGConfig.swaggerConfig;
    if (!jsonUrl) throw Error('no swagger jsonUrl');
    const targetDirectory = SwaggerGenTool.targetDirectory;
    if (!existsSync(targetDirectory)) await mkdirp(targetDirectory);

    const values = await getSimpleData(jsonUrl);
    writeFile(targetDirectory.concat(`/swagger.json`), JSON.stringify(values, null, 4), 'utf-8');

    //收集所有中文
    let chineseList = collectChinese(values);
    const translationPath = targetDirectory.concat(`/translation.json`);

    // 拿到所有中英文映射对象
    await SwaggerGenTool.getTranslateInfo(chineseList, translationPath);
    this._dataModels = values.data;
    return values;
  }

  static get dataModels() {
    if (!this._dataModels) throw Error('please set dataModel');
    return this._dataModels;
  }

  static getRealObject = (response?: JSONSchema) => {
    const dataModels = SwaggerGenTool.dataModels;
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
    } else if (response.$ref) {
      const parts = response.$ref.split('/');
      const typeName = getModelName(parts[parts.length - 1]);
      return dataModels[typeName];
    } else if (typeof response === 'object' && response.type === 'object') {
      return response;
    }
    return undefined;
  };

  private static get responseConfig() {
    if (this.commonScript && this.commonScript.response) return this.commonScript.response;
    return {
      pagingName: 'PageResp.data',
      dataName: `res.body['data']`,
      pagingProps: ['page', 'size', 'total', 'data'],
    };
  }

  static get pageResName() {
    const name = SwaggerGenTool.responseConfig.pagingName;
    return name.split('.');
  }

  static get pageResDataKey() {
    return last(SwaggerGenTool.responseConfig.pagingProps)!;
  }

  static get pageResProps() {
    const props = cloneDeep(SwaggerGenTool.responseConfig.pagingProps);
    return props.slice(0, props.length - 1);
  }

  static get resName() {
    return SwaggerGenTool.responseConfig.dataName;
  }

  static getStandardResponse(response?: JSONSchema): [JSONSchema | undefined, boolean] {
    if (response) response = SwaggerGenTool.getRealObject(response);
    if (this.commonScript && this.commonScript.getStandardResponse) {
      const obj = response?.allOf ? SwaggerGenTool.getRealObject(response) : undefined;
      return this.commonScript.getStandardResponse(response, obj);
    }
    if (typeof response !== 'object') return [undefined, false];
    const dataKey = 'data';
    const pageProps = ['total', 'data'];

    if (response.allOf) {
      const obj = SwaggerGenTool.getRealObject(response);
      if (obj && obj.properties && obj.properties[dataKey]) {
        let isPaging = true;
        for (const key of pageProps)
          if (!Object.keys(obj.properties).includes(key)) {
            isPaging = false;
            break;
          }

        return [obj.properties[dataKey], isPaging];
      }
    } else if (typeof response === 'object' && response.type === 'object' && response.properties && response.properties[dataKey]) {
      let isPaging = true;
      for (const key of pageProps)
        if (!Object.keys(response.properties).includes(key)) {
          isPaging = false;
          break;
        }
      return [response.properties[dataKey], isPaging];
    }
    return [undefined, false];
  }

  static isEnumObject(obj: JSONSchema) {
    if (this.commonScript && this.commonScript.isEnumObject) return this.commonScript.isEnumObject(obj);
    if (obj.allOf || obj.$ref) obj = SwaggerGenTool.getRealObject(obj)!;
    if (obj.type === 'array') {
      const items = obj.items;
      if (!Array.isArray(items) || items.length === 0) return false;
      obj = items[0];
    }
    return obj.enum && (obj.type === 'integer' || obj.type === 'string') && obj['x-enum-comments'] && obj['x-enum-varnames'];
  }

  static setSwagger2apiScript() {
    const commonScriptFile = join(Material.getDirPath('swagger2api'), 'common', 'script', 'index.js');
    const type = {
      dart: 'dart',
      typescript: 'ts',
    }[VGConfig.type];
    const requestScriptFile = join(Material.getDirPath('swagger2api'), type, 'request', 'script', 'index.js');
    if (existsSync(commonScriptFile)) {
      delete eval('require').cache[eval('require').resolve(commonScriptFile)];
      this.commonScript = eval('require')(commonScriptFile);
    }
    if (existsSync(requestScriptFile)) {
      delete eval('require').cache[eval('require').resolve(requestScriptFile)];
      this.requestScript = eval('require')(requestScriptFile);
    }
  }

  static async getTranslateInfo(values: Array<string>, translationPath: string) {
    let translationObj = readFileSyncToObj(translationPath);
    // 过滤掉已翻译的
    values = values.filter((el) => !translationObj.hasOwnProperty(el));
    try {
      await zhiyiTranslationHandle(values, translationObj);
    } catch (error) {
      console.error(error);
      try {
        // 百度翻译处理
        await baiduTranslationHandle(values, translationObj);
      } catch (e) {
        console.error(e);
      }
    }
    this._translationObj = translationObj;

    // 把翻译的内容写入
    if (Object.keys(translationObj).length !== 0) writeFile(translationPath, JSON.stringify(translationObj, null, 4), 'utf-8');
    else if (existsSync(translationPath)) rmSync(translationPath);
  }

  static testFolder(folder?: string) {
    const folderFilter = this.config.folderFilter;
    if (!folderFilter || !folder || folderFilter.length === 0) return true;
    return folderFilter.some((item) => (isRegExp(item) ? (item as RegExp).test(folder) : folder.startsWith(item as string)));
  }

  static testPath(path: string) {
    const pathHidden = this.config.pathHidden;
    if (pathHidden.length === 0) return true;
    if (pathHidden.includes(path)) return false;
    if (path.includes('&&')) {
      path = path.split('&&')[1];
      return !pathHidden.includes(path);
    }
    return true;
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

  static needFormKeys(classname: string) {
    return /Req$/.test(classname);
  }

  static reset() {
    this._dataModels = undefined;
    this.exceptionString = undefined;
    this._translationObj = undefined;
  }

  /**
   * Returns the platform implementor based on the SwaggerGenTool configuration.
   *
   * @return {PlatformImplementor} The platform implementor based on the SwaggerGenTool configuration.
   */
  static get implementor(): PlatformImplementor {
    if (VGConfig.type === 'dart') return new DartPlatformImplementor();
    if (VGConfig.type === 'typescript') return new TsPlatformImplementor();
    throw Error('Do not support');
  }

  static get swagger2api() {
    return getLocalMaterials(this.implementor.swagger2apiMaterialPath);
  }

  static getMaterialTemplateWithName(name: string) {
    var obj = find(this.swagger2api, { name });
    if (!obj) throw Error('');
    return obj.template;
  }

  private static exceptionString?: string;

  static addException(e: string) {
    if (!this.exceptionString) this.exceptionString = '';
    if (!this.exceptionString.includes(e)) this.exceptionString += `${e}\n`;
  }

  static writeExceptionToFile(dir: string) {
    const path = join(dir, 'exception.text');
    if (this.exceptionString) writeFileSync(path, this.exceptionString, 'utf-8');
    else if (existsSync(path)) rmSync(path);
    this.exceptionString = '';
  }

  static methodNameExchange(name: string) {
    const _temp = name
      .split('/')
      .map((e) => (e === '{id}' ? 'by_id' : snakeCase(e).split('_')))
      .flat()
      .filter((e) => !['create', 'delete', 'update', 'v1', ''].includes(e));
    const keyLast = [...new Set(_temp.reverse())].reverse().join('_');
    return keyLast;
  }
}

export default SwaggerGenTool;
