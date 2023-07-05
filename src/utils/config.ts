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
import { getFileContent } from './file';
import { rootPath } from './vscodeEnv';

const defaultConfig: Config = {
  yapi: { projects: [] },
  mock: { mockKeyWordEqual: [], mockKeyWordLike: [] },
  commonlyUsedBlock: [],
};

export type Config = {
  yapi?: {
    domain?: string;
    projects?: {
      name: string;
      token: string;
      domain: string;
    }[];
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
  if (fs.existsSync(path.join(rootPath, '.vgcoderc')))
    return JSON.parse(getFileContent('.vgcoderc') || '{}');

  return defaultConfig;
};

export const saveConfig = (config: Config) => {
  fs.writeFileSync(
    path.join(rootPath, '.vgcoderc'),
    JSON.stringify(config, null, 2),
  );
};

/**
 * 获取模板文件路径，默认为 codeTemplate 目录下
 *
 * @returns
 */
export const getTemplateFilePath = () => 'codeTemplate';
