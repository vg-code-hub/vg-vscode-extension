/*
 * @Author: zdd
 * @Date: 2023-06-27 22:01:26
 * @LastEditors: zdd dongdong@grizzlychina.com
 * @LastEditTime: 2025-01-14 14:39:44
 * @FilePath: config.ts
 * @Description:
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import { Uri, WorkspaceConfiguration, commands, window, workspace } from 'vscode';

import { existsSync, getRootPath, rootPath, readFileSync } from '@root/utils';
import { parse, stringify } from 'yaml';
import { getRegExp } from '@root/swagger-generator/utils';

const defaultScaffoldJson = 'https://raw.githubusercontent.com/JimmyZDD/vg-materials/main/scaffold/index.json';

const defaultConfig = {
  type: 'dart',
  swagger: {
    jsonUrl: 'http://127.0.0.1:4523/export/openapi?projectId=xxx&version=3.0',
    outputDir: 'api',
    overwrite: true,
  },
};

export type Config = {
  type: 'dart' | 'typescript';
  swagger: {
    jsonUrl: string;
    outputDir: string;
    rootPath: string;
    urlPrefix?: string;
    overwrite: boolean;
    folderFilter?: (string | RegExp)[];
    pathHidden: string[];
    folderMap?: Record<string, string>;
    schemasPackageMap?: Record<string, string>;
    customPathFolder?: Map<string | RegExp, string>;
    translationObj?: Record<string, string>;
    customModelFolder?: Record<string, string>;
  };
  mock?: {
    mockNumber?: string;
    mockBoolean?: string;
    mockString?: string;
    mockKeyWordEqual?: {
      key: string;
      value: string;
    }[];
    mockKeyWordLike?: {
      key: string;
      value: string;
    }[];
  };
  commonlyUsedBlock?: string[];
};

/** 获取插件 vgcode.yaml 配置 */
export const getConfig: () => Config = () => {
  if (fs.existsSync(rootPath.concat(`/vgcode.yaml`))) {
    const file = readFileSync(rootPath.concat(`/vgcode.yaml`), 'utf8');
    if (parse(file).yapi)
      window.showErrorMessage('发现旧版 vgcode.yaml 立即迁移配置', '确定').then((res) => {
        if (res) {
          fs.copySync(rootPath.concat(`/vgcode.yaml`), rootPath.concat(`/vgcode.yaml.old`));
          fs.rmSync(rootPath.concat(`/vgcode.yaml`));
          commands.executeCommand('extension.vgcode-config-init');
        }
      });
    return parse(file);
  }
  if (!existsSync(rootPath.concat(`/vgcode.yaml`)))
    window.showInformationMessage('初始化 vgcode.yaml', '确定').then((res) => {
      if (res) commands.executeCommand('extension.vgcode-config-init');
    });
  return defaultConfig;
};

export const saveConfig = (config: Config) => {
  fs.writeFileSync(path.join(rootPath, 'vgcode.yaml'), stringify(config, null, 2), 'utf-8');
};

/**
 * 获取模板文件路径，默认为 codeTemplate 目录下
 *
 * @returns
 */
export const getTemplateFilePath = () => 'codeTemplate';

const values = `# swagger 配置文件
# http://127.0.0.1:4523/export/openapi?projectId=2540665&version=2.0
# http://127.0.0.1:4523/export/openapi?projectId=2540665&version=3.1
# http://127.0.0.1:4523/export/openapi?projectId=2540665&version=3.0
# https://petstore.swagger.io/v2/swagger.json
jsonUrl: https://petstore.swagger.io/v2/swagger.json
outputDir: api
overwrite: true # 是否覆盖requests和entitys
# 1、首先过滤需要的文件夹[folderFilter]， 2、然后根据 customPathFolder ｜ customModelFolder 自定义 Folder
# 3、最后如果没有第二步，folderMap 转换 folder path
folderFilter:
  - app接口
  # - /^app接口/
  # - /^app接口模型/
customPathFolder:
  /v1/app/login: test/login
  # string startsWith
  /v1/common/upload: test/upload
  # reg match
  /v1/driver.*/: test/driver
customModelFolder:
  DeviceListResp: test
  DeviceHistoryNewResp: test/history
folderMap:
  app接口: app
  app接口模型: app
  app模型: app
  "驾驶员:driver": driver
  "项目:project": project
`;
export const genVgcodeConfig = async (uri: Uri) => {
  try {
    let rootPath = getRootPath(undefined);
    if (!rootPath) throw Error('no root path');

    if (!existsSync(rootPath.concat(`/vgcode.yaml`))) {
      saveConfig(defaultConfig as Config);
      window.showInformationMessage(`Successfully Generated api yaml`);
    } else {
      window.showWarningMessage('已存在vgcode.yaml');
    }
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

/** 插件扩展设置 */
export function getScaffoldJsonUrl(fsPath?: string): string {
  if (!fsPath) return workspace.getConfiguration().get('vgcode.scaffoldJson') || defaultScaffoldJson;
  return getSetting(fsPath, 'scaffoldJson') || defaultScaffoldJson;
}

function getSetting(fsPath: string, configKey: string): any {
  const uri = Uri.file(fsPath);
  const workspaceConfiguration: WorkspaceConfiguration = workspace.getConfiguration('vgcode', uri);
  if (workspaceConfiguration.has(configKey)) return workspaceConfiguration.get(configKey);
}

export class VGConfig {
  private static _instance: VGConfig;
  private _config?: Config;
  /*
    单例模式，仅允许通过 RemoteOption.instance 获取全局唯一实例
  */
  private constructor() {}

  static get instance() {
    if (!VGConfig._instance) VGConfig._instance = new VGConfig();
    return VGConfig._instance;
  }

  static get config() {
    if (!VGConfig.instance._config) throw Error('config not init');
    return VGConfig.instance._config;
  }
  static get swaggerConfig() {
    if (!VGConfig.instance._config) throw Error('config not init');
    return VGConfig.instance._config.swagger;
  }
  static get type() {
    if (!VGConfig.instance._config) throw Error('config not init');
    return VGConfig.instance._config.type;
  }

  async initConfig(rootPath: string) {
    if (!existsSync(rootPath.concat(`/vgcode.yaml`))) throw Error('config your vgcode.yaml then  try again');

    const config = getConfig();
    const { swagger } = getConfig();
    let folderFilter: (string | RegExp)[] = [];
    if (swagger.folderFilter) {
      if (!Array.isArray(swagger.folderFilter)) throw Error('folderFilter must be array');
      folderFilter = (swagger.folderFilter as string[]).map(getRegExp);
    }
    let pathHidden: string[] = [];
    if (swagger.pathHidden) {
      if (!Array.isArray(swagger.pathHidden)) throw Error('pathHidden must be array');
      pathHidden = swagger.pathHidden ?? [];
    }
    let customPathFolder = new Map();
    if (swagger.customPathFolder)
      for (const key in swagger.customPathFolder) {
        const element = (swagger.customPathFolder as unknown as Record<string, string>)[key];
        let _key = getRegExp(key);
        customPathFolder.set(_key, element);
      }
    if (swagger.urlPrefix && !swagger.urlPrefix.startsWith('/')) swagger.urlPrefix = '/' + swagger.urlPrefix;

    this._config = {
      ...config,
      swagger: {
        ...swagger,
        outputDir: swagger.outputDir ?? 'api',
        folderFilter,
        pathHidden,
        customPathFolder,
      },
    };
  }

  static addSwaggerConfig(config: Partial<Config['swagger']>) {
    if (!this.config) throw Error('config not init');
    const instance = VGConfig.instance;
    instance._config = {
      ...this.config,
      swagger: {
        ...this.config.swagger,
        ...config,
      },
    };
  }
}
