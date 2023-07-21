/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-21 16:44:30
 * @FilePath: /vg-vscode-extension/src/webview/controllers/material.ts
 * @Description: 
 */

import {
  copyMaterialsFromTemp,
  downloadMaterialsFromGit,
  downloadMaterialsFromNpm,
} from '../../utils/download';
import { tempGlobalDir } from '../../utils/env';
import { getLocalMaterials, getLocalSchema2codeMaterials } from '../../utils/materials';
import { materialsPath } from '../../utils/vscodeEnv';
import { IMessage } from '../type';

const material = {
  getLocalMaterials: () => {
    const data = {
      blocks: getLocalMaterials('blocks', tempGlobalDir.blockMaterials),
      schema2code: getLocalSchema2codeMaterials(tempGlobalDir.schema2codeMaterials),
      snippets: getLocalMaterials('snippets', tempGlobalDir.snippetMaterials),
    };
    return data;
  },

  downloadMaterials: async (
    message: IMessage<{ type: 'git' | 'npm'; url: string }>,
  ) => {
    if (message.data.type === 'npm')
      await downloadMaterialsFromNpm(message.data.url);
    else
      downloadMaterialsFromGit(message.data.url);

    const materials = {
      blocks: getLocalMaterials('blocks', tempGlobalDir.blockMaterials),
      snippets: getLocalMaterials('snippets', tempGlobalDir.snippetMaterials),
    };
    return materials;
  },

  saveDownloadMaterials: async (
    message: IMessage<{ blocks: string[]; snippets: string[] }>,
  ) => {
    copyMaterialsFromTemp(message.data, materialsPath);
  },
};

export default material;
