/*
 * @Author: zdd
 * @Date: 2023-06-17 09:31:27
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-08 21:01:50
 * @FilePath: /vg-vscode-extension/src/utils/env.ts
 * @Description:
 */
import * as path from 'path';
import * as os from 'os';
import { getRootPath } from './tools';

export const materialsDir = 'materials';
const globalTemp = '.vgcode';
export const rootPath = getRootPath();

export const tempGlobalDir = {
  temp: path.join(os.homedir(), globalTemp),
  materials: path.join(os.homedir(), globalTemp, 'materials'),
  scaffold: path.join(os.homedir(), globalTemp, 'scaffold'),
  blockMaterials: path.join(os.homedir(), globalTemp, 'materials', materialsDir, 'blocks'),
  snippetMaterials: path.join(os.homedir(), globalTemp, 'materials', materialsDir, 'snippets'),
  schema2codeMaterials: path.join(os.homedir(), globalTemp, 'materials', materialsDir, 'schema2code'),
  swagger2api: path.join(os.homedir(), globalTemp, 'materials', materialsDir, 'swagger2api'),
  swagger2apiDart: path.join(os.homedir(), globalTemp, 'materials', materialsDir, 'swagger2api', 'dart'),
  swagger2apiTS: path.join(os.homedir(), globalTemp, 'materials', materialsDir, 'swagger2api', 'ts'),
};

export const checkRootPath = () => {
  if (!rootPath) throw new Error('请打开工作目录');
};

export const tempWorkPath = path.join(rootPath, '.vgcode');

export const materialsPath = path.join(tempWorkPath, 'materials');

export const blockMaterialsPath = path.join(tempWorkPath, 'materials', 'blocks');

export const snippetMaterialsPath = path.join(tempWorkPath, 'materials', 'snippets');

export const getEnv = () => ({
  rootPath,
  tempWorkPath,
  materialsPath,
  blockMaterialsPath,
  snippetMaterialsPath,
});
