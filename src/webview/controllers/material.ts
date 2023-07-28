/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-21 16:44:30
 * @FilePath: /vg-vscode-extension/src/webview/controllers/material.ts
 * @Description: 
 */

import { existsSync } from '@root/utils';
import {
  copyMaterialsFromTemp,
  downloadMaterialsFromGit,
  downloadMaterialsFromNpm,
} from '../../utils/download';
import { tempGlobalDir } from '../../utils/env';
import { deleteMaterialTemplate, getLocalMaterials } from '../../utils/materials';
import { materialsPath } from '../../utils/vscodeEnv';
import { IMessage } from '../type';

const material = {
  getLocalMaterials: () => {
    if (!existsSync(tempGlobalDir.materials)) return '';
    const data = {
      blocks: getLocalMaterials('blocks', tempGlobalDir.blockMaterials),
      schema2code: getLocalMaterials('schema2code', tempGlobalDir.schema2codeMaterials),
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

  deleteMaterialTemplate: async (
    message: IMessage<{
      name: string;
      type: 'schema2code' | 'blocks' | 'snippets';
    }>,
  ) => {
    return deleteMaterialTemplate(message.data);
  },
};

export default material;
