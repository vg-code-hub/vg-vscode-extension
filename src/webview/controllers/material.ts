/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-08 21:02:58
 * @FilePath: /vg-vscode-extension/src/webview/controllers/material.ts
 * @Description:
 */

import { VGConfig, existsSync, find, rootPath } from '@root/utils';
import { downloadMaterialsFromGit, downloadMaterialsFromNpm, tempGlobalDir } from '@root/utils';
import { Material, deleteMaterialTemplate, getLocalMaterials, saveMaterialLocal } from '@root/utils/materials';
import { IMessage, MaterialType } from '../type';
import { SwaggerGenTool } from '@root/swagger-generator/utils';

const material = {
  getMaterialLocalList: () => Material.localList,
  getLocalMaterials: async () => {
    await VGConfig.instance.initConfig(rootPath);
    if (!existsSync(tempGlobalDir.materials)) return '';
    const common = find(getLocalMaterials(Material.getDirPath('swagger2api')), { name: 'common' });

    const data = {
      schema2code: getLocalMaterials(Material.getDirPath('schema2code')),
      swagger2api: [common, ...SwaggerGenTool.swagger2api],
      blocks: getLocalMaterials(Material.getDirPath('blocks')),
      snippets: getLocalMaterials(Material.getDirPath('snippets')),
    };
    return data;
  },
  downloadMaterials: async (message: IMessage<{ type: 'git' | 'npm'; url: string }>) => {
    if (message.data.type === 'npm') await downloadMaterialsFromNpm(message.data.url);
    else downloadMaterialsFromGit(message.data.url);
  },

  deleteMaterialTemplate: async (
    message: IMessage<{
      name: string;
      type: MaterialType;
    }>
  ) => {
    return deleteMaterialTemplate(message.data);
  },
  saveMaterialLocal: async (message: IMessage<MaterialType>) => {
    return saveMaterialLocal(message.data);
  },
};

export default material;
