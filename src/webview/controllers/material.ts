/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 18:12:33
 * @FilePath: /vg-vscode-extension/src/webview/controllers/material.ts
 * @Description: 
 */
import {
  copyMaterialsFromTemp,
  downloadMaterialsFromGit,
  downloadMaterialsFromNpm,
} from '../../utils/download';
import { tempGlobalDir } from '../../utils/env';
import { getLocalMaterials } from '../../utils/materials';
import { materialsPath } from '../../utils/vscodeEnv';
import { IMessage } from '../type';

const material = {
  getLocalMaterials: () => {
    console.log(
      {
        blocks: getLocalMaterials('blocks', tempGlobalDir.blockMaterials),
        snippets: getLocalMaterials('snippets', tempGlobalDir.snippetMaterials),
      }
    );

    return {
      blocks: getLocalMaterials('blocks', tempGlobalDir.blockMaterials),
      snippets: getLocalMaterials('snippets', tempGlobalDir.snippetMaterials),
    };
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
