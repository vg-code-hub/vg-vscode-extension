/*
 * @Author: zdd
 * @Date: 2023-06-27 22:01:26
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 16:33:51
 * @FilePath: /vg-vscode-extension/src/utils/config.ts
 * @Description: 
 */
import * as path from 'path';
import * as fs from 'fs-extra';
import { readFileSync } from "@root/utils";
import { parse, stringify } from 'yaml';
import { rootPath } from './vscodeEnv';

const defaultConfig: Config = {
  type: "dart",
  yapi: {
    jsonUrl: 'http://127.0.0.1:4523/export/openapi?projectId=xxx&version=3.0',
    outputDir: 'api'
  },
  mock: { mockKeyWordEqual: [], mockKeyWordLike: [] },
  commonlyUsedBlock: [],
};

export type Config = {
  type: "dart" | "typescript"
  yapi: {
    jsonUrl: string;
    outputDir: string;
    folderFilter?: string[];
    folderMap?: Record<string, string>;
    customPathFolder?: Record<string, string>;
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

export const getConfig = () => {
  if (fs.existsSync(rootPath.concat(`/vgcode.yaml`))) {
    const file = readFileSync(rootPath.concat(`/vgcode.yaml`), 'utf8');
    return parse(file);
  }
  return defaultConfig;
};

export const saveConfig = (config: Config) => {
  fs.writeFileSync(
    path.join(rootPath, 'vgcode.yaml'),
    stringify(config, null, 2),
    'utf-8',
  );
};

/**
 * 获取模板文件路径，默认为 codeTemplate 目录下
 *
 * @returns
 */
export const getTemplateFilePath = () => 'codeTemplate';
