/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-20 11:45:42
 * @FilePath: /vg-vscode-extension/src/webview/controllers/schema.ts
 * @Description: 
 */
import { SwaggerConfig } from '@root/swagger-generator/utils';
import { getLocalSchemas } from '../../utils/schema';
import { getConfig, getRootPath, join } from '@root/utils';

const schema = {
  getLocalSchemas: async () => {
    let rootPath = getRootPath(undefined);
    if (!rootPath) throw Error('no root path');
    await SwaggerConfig.instance.getConfig(rootPath);
    const { type, yapi: { outputDir } } = getConfig();
    const targetDirectory = outputDir.startsWith('/') ? join(rootPath, outputDir) : join(rootPath, type === 'dart' ? 'lib' : 'src', outputDir);
    return getLocalSchemas(targetDirectory);
  },
};

export default schema;
