/*
 * @Author: zdd
 * @Date: 2023-06-17 09:31:27
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-17 18:21:38
 * @FilePath: /vg-vscode-extension/src/utils/env.ts
 * @Description: 
 */
import * as path from 'path';
import * as os from 'os';


export const commands = {
  openDownloadMaterials: 'lowcode.openDownloadMaterials',
};


export const materialsDir = 'materials';

export const tempDir = {
  temp: path.join(os.homedir(), '.lowcode'),
  materials: path.join(os.homedir(), '.lowcode', 'materials'),
  blockMaterials: path.join(
    os.homedir(),
    '.lowcode',
    'materials',
    materialsDir,
    'blocks',
  ),
  snippetMaterials: path.join(
    os.homedir(),
    '.lowcode',
    'materials',
    materialsDir,
    'snippets',
  ),
  scaffold: path.join(os.homedir(), '.lowcode', 'scaffold'),
};
