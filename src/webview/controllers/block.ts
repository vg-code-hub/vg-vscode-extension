/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-29 21:13:44
 * @FilePath: /vg-vscode-extension/src/webview/controllers/block.ts
 * @Description:
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import { blockMaterialsPath } from '@root/utils';
import { IMessage } from '../type';

export const createBlock = (
  message: IMessage<{
    name: string;
    template: string;
    model: string;
    schema: string;
    preview: string;
  }>
) => {
  const blockPath = path.join(blockMaterialsPath, message.data.name);
  if (fs.existsSync(blockPath)) throw new Error('区块名称已经存在');

  fs.outputFileSync(path.join(blockPath, 'src', 'README.md'), message.data.template);
  fs.outputFileSync(path.join(blockPath, 'config', 'model.json'), message.data.model);
  fs.outputFileSync(path.join(blockPath, 'config', 'schema.json'), message.data.schema);
  fs.outputFileSync(path.join(blockPath, 'config', 'preview.json'), message.data.preview);
  fs.outputFileSync(
    path.join(blockPath, 'script', 'index.js'),
    `const path = require("path");
module.exports = {
  beforeCompile: (context) => {},
  afterCompile: (context) => {
    context.outputChannel.appendLine("compile ${message.data.name} end");
  },
};`
  );
  return '添加成功';
};
