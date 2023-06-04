import * as changeCase from "change-case";
import { writeFileSync } from "../util";

// index
export function indexTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${pageName}/index.dart`;
  const template = `library ${snakeCaseName};

export './controller.dart';
export './view.dart';
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

// controller
export function controllerTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/controllers/${snakeCaseName}.dart`;
  const template = `import 'package:get/get.dart';

class ${pascalCaseName}Controller extends GetxController {
  ${pascalCaseName}Controller();

  _initData() {
    update(["${snakeCaseName}"]);
  }

  void onTap() {}

  // @override
  // void onInit() {
  //   super.onInit();
  // }

  @override
  void onReady() {
    super.onReady();
    _initData();
  }

  // @override
  // void onClose() {
  //   super.onClose();
  // }
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

// view
export function viewTemplate(pageName: string, targetDirectory: string) {
  const pascalCaseName = changeCase.pascalCase(pageName.toLowerCase());
  const snakeCaseName = changeCase.snakeCase(pageName.toLowerCase());
  const targetPath = `${targetDirectory}/${snakeCaseName}_page.dart`;
  const template = `import 'package:flutter/material.dart';
import 'package:get/get.dart';

import './controllers/${snakeCaseName}.dart';


class ${pascalCaseName}Page extends StatefulWidget {
  const ${pascalCaseName}Page({Key? key}) : super(key: key);

  @override
  State<${pascalCaseName}Page> createState() => _${pascalCaseName}PageState();
}

class _${pascalCaseName}PageState extends State<${pascalCaseName}Page>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return const _${pascalCaseName}ViewGetX();
  }
}

class _${pascalCaseName}ViewGetX extends GetView<${pascalCaseName}Controller> {
  const _${pascalCaseName}ViewGetX({Key? key}) : super(key: key);

  // 主视图
  Widget _buildView() {
    return const Center(
      child: Text("${pascalCaseName}Page"),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<${pascalCaseName}Controller>(
      init: ${pascalCaseName}Controller(),
      id: "${snakeCaseName}",
      builder: (_) {
        return Scaffold(
          appBar: AppBar(title: const Text("${snakeCaseName}")),
          body: SafeArea(
            child: _buildView(),
          ),
        );
      },
    );
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
