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

class ${pascalCaseName}Controller extends GetxController with StateMixin<List<T>> {
  ${pascalCaseName}Controller();

  late EasyRefreshController refreshController;
  List<T> dataList = [];
  int page = 0;

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

  Future<bool> feachData() async {
    try {
      if (page == 0) {
        dataList.clear();
        change(dataList, status: RxStatus.loading());
      }

      /// TODO: feach data
      // var data = await repository.listAnimal(page);
      var hasNext = data.length >= DEFAULT_PAGE_SIZE;

      dataList.addAll(data);
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
      template = `import 'package:flutter/material.dart';
import 'package:get/get.dart';

class ${pascalCaseName}CreatController extends GetxController {
  ${pascalCaseName}CreatController();

  FormProInstance formInstance = FormProInstance();
  List<Map<String, dynamic>> formColumns = [];

  create${pascalCaseName}Data() async {
    try {
      var map = formInstance.getFormValue();
      showLoading();
      await App${pascalCaseName}RecordsRequest.instance.createV1${pascalCaseName}Record(
          body: ${pascalCaseName}ListResp.fromJson({
        ...map
      }));
      await hiddenLoading();
      ${pascalCaseName}ListController controller = Get.find();
      controller.onRefresh();
      await Future.delayed(const Duration(milliseconds: 100));
      Get.back(closeOverlays: true);
    } catch (e) {
      Loading.error("数据错误：$e");
      Log.e(e.toString());
    }
  }
}`;
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

  // ListView
  _buildListView(List<Animal> state) {
    return ListView.builder(
      itemBuilder: (context, index) {
        var item = state[index];
        return ListTile(
          title: Text(item.name),
          subtitle: Text(item.type),
          trailing: Text(item.age.toString()),
        );
      },
      itemCount: state!.length,
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
    return FormPro(
      controller.formInstance,
      // ignore: invalid_use_of_protected_member
      controller.formColumns,
      uploadProvider: uploadProvider,
      topChildren: [
        Gaps.vGap15,
        const Text(
          '创建 ${pascalCaseName}',
          style: TextStyles.textBold18,
        ),
        Gaps.vGap15,
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return GetBuilder<${pascalCaseName}Controller>(
      init: ${pascalCaseName}Controller(),
      id: "${snakeCaseName}",
      builder: (_) {
        return KeyboardDismisser(
          gestures: const [
            GestureType.onTap,
            GestureType.onPanUpdateDownDirection
          ],
          child: Scaffold(
            appBar: const NavBar(title: '创建${snakeCaseName}'),
            bottomNavigationBar: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: BrnBigMainButton(
                  title: '确定',
                  onTap: controller.createDriverData,
                ),
              ),
            ),
            body: SafeArea(
              child: _buildView(),
            ),
          ),
        );
      },
    );
  }
}
`;
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
