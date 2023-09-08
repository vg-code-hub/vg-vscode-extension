/*
 * @Author: zdd
 * @Date: 2023-06-17 09:31:27
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-21 10:17:06
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
  schema2codeMaterials: path.join(os.homedir(), globalTemp, 'materials', materialsDir, 'schema2code'),
  blockMaterials: path.join(os.homedir(), globalTemp, 'materials', materialsDir, 'blocks'),
  snippetMaterials: path.join(os.homedir(), globalTemp, 'materials', materialsDir, 'snippets'),
  scaffold: path.join(os.homedir(), globalTemp, 'scaffold'),
};
