import { pascalCase, snakeCase, writeFileSync } from "../utils";
import { PageType } from "@root/type.d";

// controller
export function controllerTemplate(pageName: string, targetDirectory: string, pageType: PageType) {
  const pascalCaseName = pascalCase(pageName);
  const snakeCaseName = snakeCase(pageName);
  const targetPath = `${targetDirectory}/controllers/${snakeCaseName}.dart`;
  let template = "";

  switch (pageType) {
    case "normal":
      template = `import 'package:get/get.dart';

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
      break;
    case "refresh list":
      template = `import 'package:flutter/foundation.dart';
import 'package:get/get.dart';
import 'package:easy_refresh/easy_refresh.dart';

/// TODO: import form other files ===> start
const DEFAULT_PAGE_SIZE = 20;

class MyResponse<T> {
  MyResponse({required this.data});
  T data;
  bool? hasNext;
}

class Animal {
  Animal({
    required this.name,
    required this.type,
    required this.age,
  });
  final String name;
  final String type;
  final int age;
}

var fakeList = [
  Animal(name: '花花', type: '小猫', age: 3),
  Animal(name: '麒麟', type: '小猫', age: 2),
  Animal(name: '来福', type: '小猫', age: 5),
  Animal(name: '白泽', type: '小狗', age: 6),
  Animal(name: '猴子警长', type: '猴子', age: 16),
];

/// TODO: import form other files ===> end

class ${pascalCaseName}Controller extends GetxController with StateMixin<List<Animal>> {
  ${pascalCaseName}Controller();

  late EasyRefreshController refreshController;
  List<Animal> dataList = [];
  int page = 0;

  void onTap() {}

  @override
  void onInit() {
    super.onInit();
    refreshController = EasyRefreshController(
      controlFinishRefresh: true,
      controlFinishLoad: true,
    );
  }

  @override
  void onReady() {
    super.onReady();
    feachData();
  }

  // @override
  // void onClose() {
  //   super.onClose();
  // }

  Future<bool> feachData() async {
    try {
      if (page == 0) {
        dataList.clear();
        change(dataList, status: RxStatus.loading());
      }

      /// TODO: feach data
      // var res = await repository.listAnimal(page);
      var res = MyResponse<List<Animal>>(data: fakeList);
      dataList.addAll(res.data);
      change(dataList,
          status: dataList.isEmpty ? RxStatus.empty() : RxStatus.success());
      return res.hasNext ?? false;
    } catch (e) {
      debugPrint(e.toString());
      if (page == 0) change([], status: RxStatus.error(e.toString()));
      return false;
    }
  }

  onRefresh() async {
    page = 0;
    refreshController.resetFooter();
    var hasNext = await feachData();
    refreshController.finishRefresh();
    if (!hasNext) {
      refreshController.finishLoad(IndicatorResult.noMore);
    }
  }

  onLoad() async {
    page++;
    var hasNext = await feachData();
    refreshController
        .finishLoad(hasNext ? IndicatorResult.success : IndicatorResult.noMore);
  }
}`;
      break;
    case "form":
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
  const pascalCaseName = pascalCase(pageName);
  const snakeCaseName = snakeCase(pageName);
  const targetPath = `${targetDirectory}/${snakeCaseName}_page.dart`;
  let template = "";

  switch (pageType) {
    case "normal":
      template = `import 'package:flutter/material.dart';
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
      break;
    case "refresh list":
      template = `import 'package:easy_refresh/easy_refresh.dart';
import 'package:flutter/material.dart';
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

  // ListView
  _buildListView(List<Animal> state) {
    return ListView.builder(itemBuilder: (context, index) {
      var item = state[index];
      return ListTile(
        title: Text(item.name),
        subtitle: Text(item.type),
        trailing: Text(item.age.toString()),
      );
    });
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
            child: EasyRefresh(
              controller: controller.refreshController,
              onRefresh: controller.onRefresh,
              onLoad: controller.onLoad,
              child: controller.obx(
                (state) => _buildListView(state!),
              ),
            ),
          ),
        );
      },
    );
  }
}
`;
      break;
    case "form":
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
