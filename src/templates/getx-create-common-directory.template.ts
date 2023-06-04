/*
 * @Author: zdd
 * @Date: 2023-05-31 16:35:05
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-04 20:25:10
 * @FilePath: /vg-vscode-extension/src/templates/getx-create-common-directory.template.ts
 * @Description: 
 */
import * as changeCase from "change-case";
import { writeFileSync } from "../util";

// index
export function indexTemplate(pageName: string, targetDirectory: string) {
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/index.dart`;
  const template = `library ${snakeCaseName};

// export './xxxx.dart';
`;

  return new Promise(async (resolve, reject) => {
    try {
      writeFileSync(targetPath, template, "utf8");
      resolve('success');
    } catch (error) {
      reject(error);
    }
  });
}

// common index
export function commonIndexTemplate(targetDirectory: string) {
  const targetPath = `${targetDirectory}/index.dart`;
  const template = `library common;

export 'extension/index.dart';
export 'l10n/index.dart';
export 'models/index.dart';
export 'network/index.dart';
export 'services/index.dart';
export 'style/index.dart';
export 'theme/index.dart';
export 'utils/index.dart';
export 'values/index.dart';
`;

  return new Promise(async (resolve, reject) => {
    try {
      writeFileSync(targetPath, template, "utf8");
      resolve('success');
    } catch (error) {
      reject(error);
    }
  });
}

// common index
export function viewIndexTemplate(targetDirectory: string) {
  const targetPath = `${targetDirectory}/index.dart`;
  const template = `library fview;

export 'components/index.dart';
export 'utils/index.dart';
export 'vendors/index.dart';
export 'widgets/index.dart';
`;

  return new Promise(async (resolve, reject) => {
    try {
      writeFileSync(targetPath, template, "utf8");
      resolve('success');
    } catch (error) {
      reject(error);
    }
  });
}
