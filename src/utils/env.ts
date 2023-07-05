/*
 * @Author: zdd
 * @Date: 2023-06-17 09:31:27
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 11:58:39
 * @FilePath: /vg-vscode-extension/src/utils/env.ts
 * @Description: 
 */
import * as path from 'path';
import * as os from 'os';

export const materialsDir = 'materials';
const globalTemp = '.vgcode';

export const tempGlobalDir = {
  temp: path.join(os.homedir(), globalTemp),
  materials: path.join(os.homedir(), globalTemp, 'materials'),
  blockMaterials: path.join(
    os.homedir(),
    globalTemp,
    'materials',
    materialsDir,
    'blocks',
  ),
  snippetMaterials: path.join(
    os.homedir(),
    globalTemp,
    'materials',
    materialsDir,
    'snippets',
  ),
  scaffold: path.join(os.homedir(), globalTemp, 'scaffold'),
};
