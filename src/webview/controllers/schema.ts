/*
 * @Author: zdd
 * @Date: 2023-06-17 09:43:56
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-10 13:46:03
 * @FilePath: /vg-vscode-extension/src/webview/controllers/schema.ts
 * @Description:
 */
import { SwaggerGenTool, SwaggerSchema } from '@root/swagger-generator/utils';
import { existsSync, getRootPath, join, mkdirpSync, writeFileSync } from '@root/utils';

const schema = {
  getLocalSchemas: async () => {
    let rootPath = getRootPath(undefined);
    if (!rootPath) throw Error('no root path');
    await SwaggerGenTool.instance.initConfig(rootPath);
    const swaggerSchema = SwaggerSchema.fromTargetDirectory();
    return swaggerSchema.getLocalSchemas();
  },
  genPagesCode: async ({ data: codeMap }: Record<string, any>) => {
    let rootPath = getRootPath(undefined);
    if (!rootPath) throw Error('no root path');

    Object.keys(codeMap)
      .filter((key) => key !== 'index.dart')
      .forEach((key) => {
        const pageFile = join(rootPath!, 'lib/pages', key);

        if (existsSync(pageFile)) throw Error(`${pageFile}文件已存在`);
      });

    Object.keys(codeMap)
      .filter((key) => key !== 'index.dart')
      .forEach((key) => {
        const _p = key.split('/');

        const directoryPath = join(rootPath!, 'lib/pages', _p.slice(0, _p.length - 1).join('/'));
        if (!existsSync(directoryPath)) mkdirpSync(directoryPath);
        const pageFile = join(rootPath!, 'lib/pages', key);
        writeFileSync(pageFile, codeMap[key], 'utf8');
      });
    return 'success';
  },
};

export default schema;
