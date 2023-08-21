import { snakeCase, writeFileSync } from "../utils";
import type { PageType } from "@root/type";
import { findCodeTemplate } from "./utils";

// controller
export function controllerTemplate(pageName: string, targetDirectory: string, pageType: PageType) {
  const snakeCaseName = snakeCase(pageName);
  const targetPath = `${targetDirectory}/controllers/${snakeCaseName}.dart`;
  let template = "";

  switch (pageType) {
    case 'normal':
      template = findCodeTemplate(['dart', 'detail', 'controller'], snakeCaseName);
      break;
    case 'refresh list':
      template = findCodeTemplate(['dart', 'list', 'controller'], snakeCaseName);
      break;
    case "form":
      template = findCodeTemplate(['dart', 'create', 'controller'], snakeCaseName);
      break;
  }

  return new Promise(async (resolve, reject) => {
    try {
      writeFileSync(targetPath, template, "utf8");
      resolve('success');
    } catch (error) {
      reject(error);
    }
  });
}

// view
export function viewTemplate(pageName: string, targetDirectory: string, pageType: PageType) {
  const snakeCaseName = snakeCase(pageName);
  const targetPath = `${targetDirectory}/${snakeCaseName}_page.dart`;
  let template = "";

  switch (pageType) {
    case 'normal':
      template = findCodeTemplate(['dart', 'detail', 'page'], snakeCaseName);
      break;
    case "refresh list":
      template = findCodeTemplate(['dart', 'list', 'page'], snakeCaseName);
      break;
    case "form":
      template = findCodeTemplate(['dart', 'create', 'page'], snakeCaseName);
      break;
  }

  return new Promise(async (resolve, reject) => {
    try {
      if (pageType === 'refresh list') writeFileSync(`${targetDirectory}/widgets/${snakeCaseName}_item.dart`, findCodeTemplate(['dart', 'list', 'item'], snakeCaseName), "utf8");
      writeFileSync(targetPath, template, "utf8");
      resolve('success');
    } catch (error) {
      reject(error);
    }
  });
}
