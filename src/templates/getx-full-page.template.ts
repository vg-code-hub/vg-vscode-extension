import { pascalCase, snakeCase, writeFileSync } from "../utils";
import { findCodeTemplate } from "./utils";


export function bindingsTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = pascalCase(pageName);
  const snakeCaseName = snakeCase(pageName);
  const targetPath = `${targetDirectory}/bindings/${snakeCaseName}.dart`;
  const template = `import 'package:get/get.dart';

import '../controllers/${snakeCaseName}.dart';

class ${pascalCaseName}Binding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<${pascalCaseName}Controller>(() => ${pascalCaseName}Controller());
  }
}
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

export function controllerTemplate(pageName: string, targetDirectory: string) {
  const snakeCaseName = snakeCase(pageName);
  const targetPath = `${targetDirectory}/controllers/${snakeCaseName}.dart`;
  const template = findCodeTemplate(['dart', 'detail', 'controller'], snakeCaseName);

  return new Promise(async (resolve, reject) => {
    try {
      writeFileSync(targetPath, template, "utf8");
      resolve('success');
    } catch (error) {
      reject(error);
    }
  });
}


export function viewTemplate(pageName: string, targetDirectory: string) {
  const snakeCaseName = snakeCase(pageName);
  const pascalName = pascalCase(pageName);

  const targetPath = `${targetDirectory}/${snakeCaseName}_page.dart`;
  let template = findCodeTemplate(['dart', 'detail', 'page'], snakeCaseName);
  template = template.replace(`\n      init: ${pascalName}Controller(),`, '').replace('(\n\n', '(\n');

  return new Promise(async (resolve, reject) => {
    try {
      writeFileSync(targetPath, template, "utf8");
      resolve('success');
    } catch (error) {
      reject(error);
    }
  });
}
