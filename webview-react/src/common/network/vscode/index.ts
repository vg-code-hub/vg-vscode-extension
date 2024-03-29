/*
 * @Author: zdd
 * @Date: 2023-06-28 18:00:11
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-07 12:42:19
 * @FilePath: /vg-vscode-extension/webview-react/src/common/network/vscode/index.ts
 * @Description:
 */
import { AxiosRequestConfig } from 'axios';
import { request } from './vscode';
export * from './vscode';

export type IMaterialType =
  | 'blocks'
  | 'snippets'
  | 'schema2code'
  | 'swagger2api';
export interface IGetLocalMaterialsResult {
  path: string;
  name: string;
  model: any;
  schema: any;
  preview: {
    title: string;
    description: string;
    img?: string | string[];
    category?: string[];
    schema?: 'form-render' | 'formily' | 'amis';
    scripts?: [{ method: string; remark: string }];
  };
  template: string;
  script?: string;
  type: string;
}

/**
 * 生成代码
 *
 * @export
 * @returns
 */
export function genPagesCode(codeMap: Record<string, any>) {
  return request<string>({
    cmd: 'genPagesCode',
    data: codeMap,
  });
}

/**
 * 获取本地swagger data schemas
 *
 * @export
 * @returns
 */
export function getLocalSchemas() {
  return request<Record<string, any>[]>({
    cmd: 'getLocalSchemas',
  });
}

/**
 * 获取本地物料列表
 *
 * @export
 * @returns
 */
export function getLocalMaterials() {
  return request<{
    swagger2api: IGetLocalMaterialsResult[];
    schema2code: IGetLocalMaterialsResult[];
    blocks: IGetLocalMaterialsResult[];
    snippets: IGetLocalMaterialsResult[];
  }>({
    cmd: 'getLocalMaterials',
  });
}
/**
 * 插入代码片段
 *
 * @export
 * @param {{ template: string }} code
 * @returns
 */
export function insertSnippet(code: { template: string }) {
  return request({
    cmd: 'insertSnippet',
    data: code,
  });
}
/**
 * json 转 ts 类型
 *
 * @export
 * @param {{ json: Object; typeName: string }} data
 * @returns
 */
export function jsonToTs(data: { json: Object; typeName: string }) {
  return request<string>({
    cmd: 'jsonToTs',
    data,
  });
}
/**
 * 根据代码片段物料生成代码
 *
 * @export
 * @param {{ model: object; template: string }} data
 * @returns
 */
export function genCodeBySnippetMaterial(data: {
  name: string;
  model: object;
  template: string;
}) {
  return request({
    cmd: 'genCodeBySnippetMaterial',
    data,
  });
}

type DirectoryTreeNode = {
  path: string;
  name: string;
  size: number;
  extension: string;
  type: 'file' | 'directory';
  children?: DirectoryTreeNode[];
};
/**
 * 获取当前项目目录结构
 *
 * @export
 * @returns
 */
export function getDirectoryTree() {
  return request<DirectoryTreeNode>({
    cmd: 'getDirectoryTree',
  });
}

/**
 * 根据区块物料生成代码
 *
 * @export
 * @param {{
 *   material: string;
 *   model: object;
 *   path: string;
 *   createPath: string[];
 * }} data
 * @returns
 */
export function genCodeByBlockMaterial(data: {
  material: string;
  model: object;
  path: string;
  createPath: string[];
}) {
  return request<string>({
    cmd: 'genCodeByBlockMaterial',
    data,
  });
}

export interface IDownloadMaterialsResult {
  blocks: {
    path: string;
    name: string;
    model: {};
    schema: {};
    preview: {
      title?: string;
      description?: string;
      img?: string;
      category?: string[];
    };
    template: string;
  }[];
  snippets: {
    path: string;
    name: string;
    model: {};
    schema: {};
    preview: {
      title?: string;
      description?: string;
      img?: string;
      category?: string[];
    };
    template: string;
  }[];
}

/**
 * 下载物料
 *
 * @export
 * @param {{ type: string; url: string }} data
 * @returns
 */
export function downloadMaterials(data: { type: string; url: string }) {
  return request<IDownloadMaterialsResult>({
    cmd: 'downloadMaterials',
    data,
  });
}

export function getMaterialLocalList() {
  return request<string[]>({
    cmd: 'getMaterialLocalList',
  });
}

/**
 * 刷新代码智能提示
 *
 * @export
 * @returns
 */
export function refreshIntelliSense() {
  return request<string>({
    cmd: 'refreshIntelliSense',
  });
}
/**
 * 快速添加代码片段
 *
 * @export
 * @param {{
 *   name: string;
 *   template: string;
 *   model: string;
 *   schema: string;
 *   preview: string;
 * }} data
 * @returns
 */
export function addSnippets(data: {
  name: string;
  template: string;
  model: string;
  schema: string;
  preview: string;
  commandPrompt: string;
  viewPrompt: string;
}) {
  return request<string>({
    cmd: 'addSnippets',
    data,
  });
}

/**
 * @description 创建区块模板
 * @export
 * @param {{
 *   name: string;
 *   template: string;
 *   model: string;
 *   schema: string;
 *   preview: string;
 * }} data
 * @returns
 */
export function createBlockTemplate(data: {
  name: string;
  template: string;
  model: string;
  schema: string;
  preview: string;
  commandPrompt: string;
  viewPrompt: string;
}) {
  return request<string>({
    cmd: 'createBlockTemplate',
    data,
  });
}

/**
 * @description 删除物料模板
 * @export
 * @param {{
 *   name: string;
 *   type: 'swagger2api' | 'schema2code' | 'blocks' | 'snippets';
 * }} data
 * @returns
 */
export function deleteMaterialTemplate(data: {
  name: string;
  type: 'swagger2api' | 'schema2code' | 'blocks' | 'snippets';
}) {
  return request<string>({
    cmd: 'deleteMaterialTemplate',
    data,
  });
}

/**
 * Saves the specified material locally.
 *
 * @param {'swagger2api' | 'schema2code' | 'blocks' | 'snippets'} data - The type of material to save.
 * @return {Promise<string>} A promise that resolves to a string indicating the result of the save operation.
 */
export function saveMaterialLocal(
  data: 'swagger2api' | 'schema2code' | 'blocks' | 'snippets',
) {
  return request<string>({
    cmd: 'saveMaterialLocal',
    data,
  });
}

/** 获取插件扩展设置 */
export function getPluginScaffoldJsonUrl() {
  return request<string>({
    cmd: 'getPluginScaffoldJsonUrl',
  });
}

/** 获取插件 vgcode.yaml 配置 */
export function getPluginConfig() {
  return request<{
    type: 'dart' | 'typescript';
    swagger: {
      jsonUrl: string;
      outputDir: string;
      folderFilter?: string[];
      folderMap?: Record<string, string>;
      customPathFolder?: Record<string, string>;
      customModelFolder?: Record<string, string>;
    };
    mock?: {
      mockNumber: string;
      mockBoolean: string;
      mockString: string;
      mockKeyWordEqual: {
        key: string;
        value: string;
      }[];
      mockKeyWordLike: {
        key: string;
        value: string;
      }[];
    };
  }>({
    cmd: 'getPluginConfig',
  });
}
export interface IConfigResult {
  swagger: {
    domain: string;
    projects: {
      name: string;
      token: string;
      domain: string;
    }[];
  };
  mock?: {
    mockNumber: string;
    mockBoolean: string;
    mockString: string;
    mockKeyWordEqual: {
      key: string;
      value: string;
    }[];
    mockKeyWordLike: {
      key: string;
      value: string;
    }[];
  };
}

export function savePluginConfig(data: IConfigResult) {
  return request({
    cmd: 'savePluginConfig',
    data,
  });
}

export interface IScaffoldResponse {
  category: string;
  icon: string;
  uuid: string;
  scaffolds: {
    title: string;
    description: string;
    screenshot: string;
    repository: string;
    repositoryType: 'git' | 'npm';
    uuid: string;
    tag?: string;
  }[];
}

/**
 * 获取脚手架列表
 *
 * @export
 * @param {string} [url]
 */
export function getScaffolds(url: string) {
  return request<IScaffoldResponse[]>({
    cmd: 'getScaffolds',
    data: {
      url,
    },
  });
}

/**
 * 下载脚手架
 *
 * @export
 * @param {({
 *   type: 'git' | 'npm';
 *   repository: string;
 * })} data
 * @returns
 */
export function downloadScaffoldByVsCode(data: {
  type: 'git' | 'npm';
  repository: string;
  tag?: string;
}) {
  return request<{
    config: { formSchema?: { schema?: object; formData?: object } };
  }>({
    cmd: 'downloadScaffold',
    data,
  });
}

/**
 * @description 使用本地脚手架
 * @export
 * @param {{ localPath?: string }} data
 * @returns
 */
export function useLocalScaffold(data: { localPath?: string }) {
  return request<{
    config: { formSchema?: { schema?: object; formData?: object } };
  }>({
    cmd: 'useLocalScaffold',
    data,
  });
}

/**
 * 选择目录
 *
 * @export
 * @returns
 */
export function selectDirectory() {
  return request<string>({
    cmd: 'selectDirectory',
  });
}

/**
 * 创建项目
 *
 * @export
 * @param {{
 *   model: any;
 *   createDir: string;
 *   immediateOpen: boolean;
 * }} data
 * @returns
 */
export function createProject(data: {
  model: { projectName: string; [key: string]: any };
  createDir: string;
  immediateOpen: boolean;
}) {
  return request<string>({
    cmd: 'createProject',
    data,
  });
}

/**
 * @description 执行 vscode 命令
 * @export
 * @param {{ command: string }} data
 * @returns
 */
export function executeVscodeCommand(data: { command: string }) {
  return request<string>({
    cmd: 'executeVscodeCommand',
    data,
  });
}

export function nodeRequest<IResult = unknown>(config: AxiosRequestConfig) {
  return request<IResult>({
    cmd: 'request',
    skipError: true,
    data: {
      config,
    },
  });
}

export function getTask() {
  return request<{
    task: 'addSnippets' | 'openSnippet' | 'route' | 'updateSelectedFolder';
    data?: unknown;
  }>({
    cmd: 'getTask',
  });
}

export function insertCode(code: string) {
  return request<boolean>({
    cmd: 'insertCode',
    data: code,
  });
}

export function runScript(data: {
  materialPath: string;
  script: string;
  params: string;
  model: object;
}) {
  return request<object>({
    cmd: 'runScript',
    data,
  });
}
