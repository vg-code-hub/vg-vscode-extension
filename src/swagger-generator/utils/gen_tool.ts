/*
 * @Author: zdd
 * @Date: 2023-06-05 11:28:07
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-09 10:02:35
 * @FilePath: /vg-vscode-extension/src/swagger-generator/utils/gen_tool.ts
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
import { cloneDeep, find, last } from 'lodash';
import { getModelName } from './common';
import { JSONSchema, Swagger } from '../index.d';
import { DartPlatformImplementor, PlatformImplementor, TsPlatformImplementor } from '../generate';
import { getSimpleData } from '../http';
import { collectChinese } from './helper';

type CommonScript = {
  pageResponse?: {
    name: string;
    props: string[];
  };
  getPageResponse?: (response?: JSONSchema) => JSONSchema | undefined;
  getStandardResponse?: (response: JSONSchema | undefined, realRes: JSONSchema | undefined) => JSONSchema | undefined;
};

class SwaggerGenTool {
  private static _instance: SwaggerGenTool;
  private static _translationObj?: Record<string, string>;
  private static commonScript: CommonScript | undefined;
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
    } else if (typeof response === 'object' && response.type === 'object') {
      return response;
    }
    return undefined;
  };

  static get pageResponse() {
    if (this.commonScript && this.commonScript.pageResponse) return this.commonScript.pageResponse;
    return SwaggerGenTool.config.pageResponse;
  }

  static get pageResName() {
    const name = SwaggerGenTool.pageResponse.name;
    return name.split('.');
  }

  static get pageResDataKey() {
    return last(SwaggerGenTool.pageResponse.props)!;
  }

  static get pageResProps() {
    const props = cloneDeep(SwaggerGenTool.pageResponse.props);
    return props.slice(0, props.length - 1);
  }

  static get resName() {
    if (!SwaggerGenTool.config.ignoreResponse || !SwaggerGenTool.config.ignoreResponse.includes('.')) return `res.body`;
    const [_, key] = SwaggerGenTool.config.ignoreResponse.split('.');
    return `res.body['${key}']`;
  }

  static getStandardResponse(response?: JSONSchema) {
    if (this.commonScript && this.commonScript.getStandardResponse) {
      const obj = response?.allOf ? SwaggerGenTool.getRealObject(response) : undefined;
      return this.commonScript.getStandardResponse(response, obj);
    }
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
    const obj = SwaggerGenTool.getRealObject(standardResponse);
    if (this.commonScript && this.commonScript.getPageResponse) return this.commonScript.getPageResponse(obj);
    const props = SwaggerGenTool.pageResponse.props;
    if (!obj) return undefined;
    for (const key in obj.properties) if (!props.includes(key)) return undefined;
    return obj.properties ? obj.properties[SwaggerGenTool.pageResDataKey] : undefined;
  }

  static setSwagger2apiScript() {
    const commonScriptFile = join(Material.getDirPath('swagger2api'), 'common', 'script', 'index.js');
    if (existsSync(commonScriptFile)) {
      delete eval('require').cache[eval('require').resolve(commonScriptFile)];
      this.commonScript = eval('require')(commonScriptFile);
    }
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
}

export default SwaggerGenTool;
