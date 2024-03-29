/*
 * @Author: jimmyZhao
 * @Date: 2023-07-28 10:27:11
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-15 16:18:13
 * @FilePath: /vg-vscode-extension/src/commands/routers-generate.ts
 * @Description:
 */
import { Uri, window } from 'vscode';
import * as vscode from 'vscode';
import { join, getRootPath, readdirSync, statSync, existsSync, appendFileSync, rmSync, snakeCase, camelCase, pascalCase, mkdirp } from '@root/utils';

export const routersGenerate = async (uri: Uri) => {
  let targetDirectory = uri.fsPath;

  try {
    routeNamesGenerate(targetDirectory);

    window.showInformationMessage(`Successfully Generated Getx Routers Text File`);
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

// 生成 route names
function routeNamesGenerate(targetDirectory: string) {
  let isFirst = true;
  walkSync(targetDirectory, async (filePath: string, stat: object) => {
    // 根目录
    let rootPath = getRootPath(undefined);

    // 相对路径
    let relativePath = vscode.workspace.asRelativePath(filePath);

    // 检查 lib/pages，非dart文件
    if (relativePath.indexOf('lib/pages/') === -1 || relativePath.indexOf('.dart') === -1) return;

    // 排除 lib/pages/index.dart
    if (
      relativePath.indexOf('lib/pages/pages.dart') !== -1 ||
      relativePath.indexOf('widgets/') !== -1 ||
      relativePath.indexOf('services/') !== -1 ||
      relativePath.indexOf('controllers/') !== -1
    )
      return;

    // 名称
    let arrFilePath = relativePath.replace('lib/pages/', '').replace('.dart', '').split('/');
    const modalFileName = arrFilePath.join('_');
    const filePathName = arrFilePath.join('/');
    if (filePathName.startsWith('.')) return;

    // 删除文件
    if (isFirst === true) {
      isFirst = false;
      if (existsSync(`${rootPath}/lib/routers/names.txt`)) rmSync(`${rootPath}/lib/routers/names.txt`);

      if (existsSync(`${rootPath}/lib/routers/pages.txt`)) rmSync(`${rootPath}/lib/routers/pages.txt`);

      if (existsSync(`${rootPath}/lib/pages/pages.txt`)) rmSync(`${rootPath}/lib/pages/pages.txt`);

      if (!existsSync(`${rootPath}/lib/routers`)) mkdirp(`${rootPath}/lib/routers`);
    }
    if (relativePath.indexOf('bindings') === -1) {
      const snakeCaseName = snakeCase(modalFileName);
      const camelCaseName = camelCase(modalFileName);

      // 文件名
      const pascalCaseName =
        arrFilePath.length > 1
          ? pascalCase(arrFilePath[arrFilePath.length - 2] + '_' + arrFilePath[arrFilePath.length - 1])
          : pascalCase(arrFilePath[arrFilePath.length - 1]);

      // 写入列表
      appendFileSync(`${rootPath}/lib/routers/names.txt`, `static const ${camelCaseName} = '/${snakeCaseName}';\r\n`, 'utf8');
      appendFileSync(
        `${rootPath}/lib/routers/pages.txt`,
        `
      GetPage(
        name: RouteNames.${camelCaseName},
        page: () => const ${pascalCaseName}(),
      ),`,
        'utf8'
      );
    }

    appendFileSync(`${rootPath}/lib/pages/pages.txt`, `export '${filePathName}.dart';\r\n`, 'utf8');
  });
}

function walkSync(currentDirPath: string, callback: Function) {
  readdirSync(currentDirPath).forEach(function (name) {
    var filePath = join(currentDirPath, name);
    var stat = statSync(filePath);
    if (stat.isFile()) callback(filePath, stat);
    else if (stat.isDirectory()) walkSync(filePath, callback);
  });
}
