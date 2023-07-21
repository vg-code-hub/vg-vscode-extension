export default {
  "schema2code": [
    {
      "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart",
      "name": "dart",
      "children": [
        {
          "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/create",
          "name": "create",
          "children": [
            {
              "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/create/controller",
              "name": "controller",
              "template": "import 'package:f_common/f_common.dart';\r\nimport 'package:f_native/f_native.dart';\r\nimport 'package:f_view/f_view.dart';\r\nimport 'package:get/get.dart';\r\n\r\nimport '../../../domains/domains.dart';\r\nimport '../../../middleware/index.dart';\r\nimport '<%= snakeName %>_list.dart';\r\n\r\nclass <%= className %>CreatController extends GetxController {\r\n  <%= className %>CreatController();\r\n\r\n  FormProInstance formInstance = FormProInstance();\r\n  List<Map<String, dynamic>> formColumns = [<% properties.forEach(function(p){ %>\r\n    {\r\n      \"key\": \"<%= p.key %>\",\r\n      \"title\": \"<%= p.title %>\",\r\n      'type': 'input',\r\n      'isRequire': <%= p.required %>,\r\n    },<% }); %>\r\n  ];\r\n\r\n  create<%= className %>Data() async {\r\n    try {\r\n      var map = formInstance.getFormValue();\r\n      showLoading();\r\n      await App<%= className %>RecordsRequest.instance.createV1<%= className %>Record(\r\n          body: <%= dataClass %>.fromJson({\r\n        ...map\r\n      }));\r\n      await hiddenLoading();\r\n      <%= className %>ListController controller = Get.find();\r\n      controller.onRefresh();\r\n      await Future.delayed(const Duration(milliseconds: 100));\r\n      Get.back(closeOverlays: true);\r\n    } catch (e) {\r\n      Loading.error(\"数据错误：$e\");\r\n      Log.e(e.toString());\r\n    }\r\n  }\r\n}\r\n"
            },
            {
              "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/create/page",
              "name": "page",
              "template": "import 'package:f_common/f_common.dart';\r\nimport 'package:f_view/f_view.dart';\r\nimport 'package:flutter/material.dart';\r\nimport 'package:get/get.dart';\r\n\r\nimport '../../domains/api/requests/upload.dart';\r\nimport './controllers/<%= snakeName %>_creat.dart';\r\n\r\nclass <%= className %>CreatPage extends GetView<<%= className %>CreatController> {\r\n  const <%= className %>CreatPage({Key? key}) : super(key: key);\r\n\r\n  // 主视图\r\n  Widget _buildView() {\r\n    return FormPro(\r\n      controller.formInstance,\r\n      // ignore: invalid_use_of_protected_member\r\n      controller.formColumns,\r\n      uploadProvider: uploadProvider,\r\n      topChildren: [\r\n        Gaps.vGap15,\r\n        const Text(\r\n          '创建%= className %>',\r\n          style: TextStyles.textBold18,\r\n        ),\r\n        Gaps.vGap15,\r\n      ],\r\n    );\r\n  }\r\n\r\n  @override\r\n  Widget build(BuildContext context) {\r\n    return GetBuilder<<%= className %>CreatController>(\r\n      init: <%= className %>CreatController(),\r\n      id: \"<%= snakeName %>_creat\",\r\n      builder: (_) {\r\n        return KeyboardDismisser(\r\n          gestures: const [\r\n            GestureType.onTap,\r\n            GestureType.onPanUpdateDownDirection\r\n          ],\r\n          child: Scaffold(\r\n            appBar: const NavBar(title: '创建<%= className %>'),\r\n            bottomNavigationBar: SafeArea(\r\n              child: Padding(\r\n                padding: const EdgeInsets.all(12),\r\n                child: BrnBigMainButton(\r\n                  title: '确定',\r\n                  onTap: controller.create<%= className %>Data,\r\n                ),\r\n              ),\r\n            ),\r\n            body: SafeArea(\r\n              child: _buildView(),\r\n            ),\r\n          ),\r\n        );\r\n      },\r\n    );\r\n  }\r\n}\r\n"
            }
          ]
        },
        {
          "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/detail",
          "name": "detail",
          "children": [
            {
              "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/detail/controller",
              "name": "controller",
              "template": "import 'package:f_common/f_common.dart';\r\nimport 'package:get/get.dart';\r\n\r\nimport '../../../domains/domains.dart';\r\nimport '../../../middleware/index.dart';\r\n\r\nclass <%= className %>DetailController extends GetxController {\r\n  <%= className %>DetailController();\r\n\r\n  late <%= dataClass %> currentItem;\r\n\r\n  List<Map<String, String>> get tableData => [<% properties.forEach(function(p){ %>\r\n    {'label': \"<%= p.title %>\", 'value': currentItem.<%= p.key %>.safeDisplay},<% }); %>\r\n  ];\r\n}\r\n"
            },
            {
              "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/detail/page",
              "name": "page",
              "template": "import 'package:f_common/f_common.dart';\r\nimport 'package:f_view/f_view.dart';\r\nimport 'package:flutter/material.dart';\r\nimport 'package:get/get.dart';\r\n\r\nimport './controllers/<%= snakeName %>_detail.dart';\r\n\r\nclass <%= className %>DetailPage extends GetView<<%= className %>DetailController> {\r\n  const <%= className %>DetailPage({Key? key}) : super(key: key);\r\n\r\n  // 主视图\r\n  Widget _buildView() {\r\n    return SingleChildScrollView(\r\n      child: Column(\r\n        children: [\r\n          Gaps.vGap10,\r\n          TableView(controller.tableData),\r\n          Gaps.vGap12,\r\n        ],\r\n      ),\r\n    );\r\n  }\r\n\r\n  @override\r\n  Widget build(BuildContext context) {\r\n    return GetBuilder<<%= className %>DetailController>(\r\n      init: <%= className %>DetailController(),\r\n      id: \"<%= snakeName %>_detail\",\r\n      builder: (_) {\r\n        return Scaffold(\r\n          appBar: const NavBar(title: '<%= snakeName %>详情'),\r\n          body: SafeArea(\r\n            child: _buildView(),\r\n          ),\r\n        );\r\n      },\r\n    );\r\n  }\r\n}"
            }
          ]
        },
        {
          "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/refresh-list",
          "name": "refresh-list",
          "children": [
            {
              "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/refresh-list/controller",
              "name": "controller",
              "template": "import 'package:f_common/f_common.dart';\r\nimport 'package:f_view/f_view.dart';\r\nimport 'package:get/get.dart';\r\n\r\nimport '../../../domains/domains.dart';\r\nimport '../../../middleware/index.dart';\r\n\r\nclass <%= className %>ListController extends GetxController\r\n    with StateMixin<List<<%= dataClass %>>> {\r\n  <%= className %>ListController();\r\n\r\n  late EasyRefreshController refreshController;\r\n\r\n  List<<%= dataClass %>> <%= camelClassName %>List = [];\r\n\r\n  int page = 0;\r\n\r\n  @override\r\n  void onInit() {\r\n    super.onInit();\r\n    refreshController = EasyRefreshController(\r\n      controlFinishRefresh: true,\r\n      controlFinishLoad: true,\r\n    );\r\n  }\r\n\r\n  @override\r\n  void onReady() {\r\n    super.onReady();\r\n    feachData();\r\n  }\r\n\r\n  Future<bool> feachData() async {\r\n    try {\r\n      if (page == 0) {\r\n        <%= camelClassName %>List.clear();\r\n        change(<%= camelClassName %>List, status: RxStatus.loading());\r\n      }\r\n      var data = await App<%= className %>ationRecordsRequest.instance\r\n          .getV1<%= className %>RecordList(page: page, pageSize: DEFAULT_PAGE_SIZE);\r\n      var hasNext = data.length >= DEFAULT_PAGE_SIZE;\r\n      <%= camelClassName %>List.addAll(data);\r\n      change(<%= camelClassName %>List,\r\n          status:\r\n              <%= camelClassName %>List.isEmpty ? RxStatus.empty() : RxStatus.success());\r\n      return hasNext;\r\n    } catch (e) {\r\n      Log.e(e.toString());\r\n      if (page == 0) change([], status: RxStatus.error(e.toString()));\r\n      return false;\r\n    }\r\n  }\r\n\r\n  onRefresh() async {\r\n    page = 0;\r\n    refreshController.resetFooter();\r\n    var hasNext = await feachData();\r\n    refreshController.finishRefresh();\r\n    if (!hasNext) {\r\n      refreshController.finishLoad(IndicatorResult.noMore);\r\n    }\r\n  }\r\n\r\n  onLoad() async {\r\n    page++;\r\n    var hasNext = await feachData();\r\n    refreshController\r\n        .finishLoad(hasNext ? IndicatorResult.success : IndicatorResult.noMore);\r\n  }\r\n}\r\n"
            },
            {
              "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/refresh-list/item",
              "name": "item",
              "template": "import 'package:f_common/f_common.dart';\r\nimport 'package:f_view/f_view.dart';\r\nimport 'package:flutter/material.dart';\r\n\r\nimport '../../../domains/domains.dart';\r\nimport '../../../middleware/index.dart';\r\n\r\nclass <%= className %>Item extends StatelessWidget {\r\n  final <%= dataClass %> item;\r\n\r\n  const <%= className %>Item(this.item, {super.key});\r\n\r\n  List<Map<String, String>> get tableData => [<% properties.forEach(function(p){ %>\r\n    {'label': \"<%= p.title %>\", 'value': item.<%= p.key %>.safeDisplay},<% }); %>\r\n  ];\r\n\r\n  @override\r\n  Widget build(BuildContext context) {\r\n    return Padding(\r\n      padding: const EdgeInsets.symmetric(horizontal: 16.0),\r\n      child: Column(\r\n        crossAxisAlignment: CrossAxisAlignment.start,\r\n        children: [\r\n          Gaps.vGap10,\r\n          TableView(tableData),\r\n          Gaps.vGap4\r\n        ],\r\n      ),\r\n    );\r\n  }\r\n}"
            },
            {
              "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/dart/refresh-list/page",
              "name": "page",
              "template": "import 'package:f_common/f_common.dart';\r\nimport 'package:f_view/f_view.dart';\r\nimport 'package:flutter/material.dart';\r\nimport 'package:get/get.dart';\r\n\r\nimport '../../domains/domains.dart';\r\nimport './controllers/<%= snakeName %>_list.dart';\r\nimport 'widgets/<%= snakeName %>_item.dart';\r\n\r\nclass <%= className %>ListPage extends GetView<<%= className %>ListController> {\r\n  const <%= className %>ListPage({Key? key}) : super(key: key);\r\n\r\n  Widget _buildListView(List<List<%= className %>RecordResp>? state) {\r\n    return ListView.builder(\r\n      itemBuilder: (context, index) {\r\n        var item = state[index];\r\n        return Padding(\r\n          padding: const EdgeInsets.only(top: 8.0),\r\n          child: MyCard(child: <%= className %>Item(item)),\r\n        );\r\n      },\r\n      itemCount: state!.length,\r\n    );\r\n  }\r\n\r\n  @override\r\n  Widget build(BuildContext context) {\r\n    return GetBuilder<<%= className %>ListController>(\r\n      init: <%= className %>ListController(),\r\n      id: \"<%= snakeName %>_list\",\r\n      builder: (_) {\r\n        return Scaffold(\r\n          appBar: NavBar(\r\n            title: \"<%= snakeName %>\",\r\n            actions: MyIconButton(\r\n              name: '新增',\r\n              direction: Direction.left,\r\n              iconWidget: const Icon(Icons.add, color: Colours.app_main),\r\n              style: TextStyles.textBold14.copyWith(color: Colours.app_main),\r\n              onTap: () {\r\n                Get.toNamed(RouteNames.<%= className %>CreatPage);\r\n              },\r\n            ),\r\n          ),\r\n          body: SafeArea(\r\n            child: EasyRefresh(\r\n              controller: controller.refreshController,\r\n              onRefresh: controller.onRefresh,\r\n              onLoad: controller.onLoad,\r\n              child: controller.obx(\r\n                (state) => _buildListView(state!),\r\n              ),\r\n            ),\r\n          ),\r\n        );\r\n      },\r\n    );\r\n  }\r\n}\r\n"
            }
          ]
        }
      ]
    },
    {
      "path": "/Users/dongdongzhao/.vgcode/materials/materials/schema2code/typescript",
      "name": "typescript",
      "children": []
    }
  ],
  "blocks": [
    {
      "path": "~/.vgcode/materials/materials/blocks/amis",
      "name": "amis",
      "model": {
        "name": "lowcode"
      },
      "schema": {
        "type": "page",
        "body": [
          {
            "type": "form",
            "title": "",
            "body": [
              {
                "type": "input-text",
                "name": "name",
                "label": "测试表单",
                "id": "u:4886baa626cf",
                "value": ""
              }
            ],
            "id": "u:67967afb0e69",
            "submitText": "",
            "name": "form",
            "data": "[Circular]"
          }
        ],
        "id": "u:d87dbf6bf8df",
        "asideResizor": false,
        "style": {
          "boxShadow": " 0px 0px 0px 0px transparent"
        },
        "pullRefresh": {
          "disabled": true
        },
        "regions": [
          "body"
        ],
        "name": "page"
      },
      "preview": {
        "title": "amis",
        "description": "amis",
        "img": [
          "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg"
        ],
        "category": [],
        "schema": "amis",
        "scripts": [
          {
            "method": "intFromOcrText",
            "remark": "使用 ocr 结果初始化表单"
          }
        ]
      },
      "template": ""
    },
    {
      "path": "~/.vgcode/materials/materials/blocks/form-render",
      "name": "form-render",
      "model": {
        "name": "lowcode"
      },
      "schema": {
        "type": "object",
        "column": 1,
        "displayType": "column",
        "properties": {
          "name": {
            "title": "测试表单",
            "type": "string",
            "props": {}
          }
        }
      },
      "preview": {
        "title": "form-render",
        "description": "form-render",
        "img": [
          "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg"
        ],
        "category": [],
        "schema": "form-render",
        "scripts": [
          {
            "method": "test",
            "remark": "测试一下"
          }
        ]
      },
      "template": ""
    },
    {
      "path": "~/.vgcode/materials/materials/blocks/formily",
      "name": "formily",
      "model": {
        "name": "lowcode"
      },
      "schema": {
        "form": {
          "labelCol": 6,
          "wrapperCol": 12,
          "layout": "vertical",
          "labelAlign": "left",
          "fullness": false,
          "inset": false
        },
        "schema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "title": "测试表单",
              "x-decorator": "FormItem",
              "x-component": "Input",
              "x-validator": [],
              "x-component-props": {},
              "x-decorator-props": {},
              "x-designable-id": "v3zwx2xtcfx",
              "x-index": 0,
              "name": "name"
            }
          },
          "x-designable-id": "d4ogui2afmr"
        }
      },
      "preview": {
        "title": "formily",
        "description": "formily",
        "img": [
          "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg"
        ],
        "category": [],
        "schema": "formily",
        "scripts": [
          {
            "method": "test",
            "remark": "测试一下"
          }
        ]
      },
      "template": ""
    },
    {
      "path": "~/.vgcode/materials/materials/blocks/react-mvp 模块",
      "name": "react-mvp 模块",
      "model": {},
      "schema": {},
      "preview": {
        "title": "react-mvp 模块",
        "description": "react-mvp 模块",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "category": [
          "react",
          "mvp"
        ],
        "schema": "form-render"
      },
      "template": ""
    },
    {
      "path": "~/.vgcode/materials/materials/blocks/taro-request",
      "name": "taro-request",
      "model": {},
      "schema": {},
      "preview": {
        "title": "taro-request",
        "description": "taro-request通用封装",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "category": [
          "taro",
          "request"
        ],
        "schema": "form-render"
      },
      "template": ""
    },
    {
      "path": "~/.vgcode/materials/materials/blocks/vue-mvp 模块",
      "name": "vue-mvp 模块",
      "model": {},
      "schema": {},
      "preview": {
        "title": "vue-mvp 模块",
        "description": "vue-mvp 模块",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "category": [
          "vue",
          "vue3",
          "mvp"
        ],
        "schema": "form-render"
      },
      "template": ""
    },
    {
      "path": "~/.vgcode/materials/materials/blocks/vue2-mvp 模块",
      "name": "vue2-mvp 模块",
      "model": {},
      "schema": {},
      "preview": {
        "title": "vue2-mvp 模块",
        "description": "vue2-mvp 模块",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "category": [
          "vue",
          "vue2",
          "mvp"
        ],
        "schema": "form-render"
      },
      "template": ""
    }
  ],
  "snippets": [
    {
      "path": "~/.vgcode/materials/materials/snippets/amis",
      "name": "amis",
      "model": {
        "name": "lowcode"
      },
      "schema": {
        "type": "page",
        "body": [
          {
            "type": "form",
            "title": "",
            "body": [
              {
                "type": "input-text",
                "name": "name",
                "label": "测试表单",
                "id": "u:4886baa626cf",
                "value": ""
              }
            ],
            "id": "u:67967afb0e69",
            "submitText": "",
            "name": "form",
            "data": "[Circular]"
          }
        ],
        "id": "u:d87dbf6bf8df",
        "asideResizor": false,
        "style": {
          "boxShadow": " 0px 0px 0px 0px transparent"
        },
        "pullRefresh": {
          "disabled": true
        },
        "regions": [
          "body"
        ],
        "name": "page"
      },
      "preview": {
        "title": "",
        "description": "",
        "img": [
          "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg"
        ],
        "category": [],
        "notShowInCommand": false,
        "notShowInSnippetsList": false,
        "notShowInintellisense": false,
        "schema": "amis",
        "scripts": [
          {
            "method": "test",
            "remark": "测试一下"
          }
        ]
      },
      "template": "<%= name %>"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/axios-request",
      "name": "axios-request",
      "model": {},
      "schema": {},
      "preview": {
        "title": "axios-request",
        "description": "axios 通用封装",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "category": [
          "请求"
        ],
        "schema": "form-render"
      },
      "template": "import axios, { AxiosRequestConfig } from \"axios\";\n\nconst instance = axios.create({\n  timeout: 30 * 1000,\n});\n\n// 请求拦截\ninstance.interceptors.request.use(\n  (config) => {\n    return config;\n  },\n  (error) => {\n    return Promise.reject(error);\n  },\n);\n\n// 响应拦截\ninstance.interceptors.response.use(\n  (res) => {\n    return Promise.resolve(res.data);\n  },\n  (error) => {\n    return Promise.reject(error);\n  },\n);\n\ntype Request = <T = unknown>(config: AxiosRequestConfig) => Promise<T>;\n\nexport const request = instance.request as Request;\n"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/axios-request-api",
      "name": "axios-request-api",
      "model": {},
      "schema": {},
      "preview": {
        "title": "axios-request-api",
        "description": "通过 yapi 接口信息生成接口请求方法",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "schema": "form-render"
      },
      "template": "<%= type %>  \n<% if (api.req_query.length > 0 || api.req_params.length > 0 || api.query_path.params.length > 0) { %>\nexport interface I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params {\n<% api.req_query.map(query => { %><%= query.name %>: string;<% }) %>\n<% api.req_params.map(query => { %><%= query.name %>: string;<% }) %>\n<% api.query_path.params.map(query => { %><%= query.name %>: string;<% }) %>\n}\n<% } %> \n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { %>\n<%= requestBodyType %> \n<% } %> \n\n/**\n* <%= api.title %> \n* /project/<%= api.project_id %>/interface/api/<%= api._id %> \n* @author <%= api.username %>  \n* \n<% if (api.req_query.length > 0 || api.req_params.length > 0 || api.query_path.params.length > 0) { -%>* @param {I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params} params<%- \"\\n\" %><% } _%>\n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { -%>* @param {I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Data} data<%- \"\\n\" %><% } _%>\n* @returns\n*/\nexport function <%= rawSelectedText %> (\n<% if (api.req_query.length>0 || api.req_params.length > 0 || api.query_path.params.length > 0) { %>\nparams: I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params,\n<% } _%>\n<% if (requestBodyType) { %> \ndata: I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Data\n<% } %> \n) {\nreturn request<I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Result>({\n\t    url: `<%= api.query_path.path.replace(/\\{/g,\"${params.\") %>`, \n\t\tmethod: '<%= api.method %>',\n\t\t<% if(api.req_query.length>0 || api.req_params.length > 0) { %>params,<% } _%>\n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) {%>data,<% } %> \n\t})\n}"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/form-render",
      "name": "form-render",
      "model": {
        "name": "lowcode"
      },
      "schema": {
        "type": "object",
        "column": 1,
        "displayType": "column",
        "properties": {
          "name": {
            "title": "测试表单",
            "type": "string",
            "props": {}
          }
        }
      },
      "preview": {
        "title": "",
        "description": "",
        "img": [
          "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg"
        ],
        "category": [],
        "notShowInCommand": false,
        "notShowInSnippetsList": false,
        "notShowInintellisense": false,
        "schema": "form-render",
        "scripts": [
          {
            "method": "test",
            "remark": "测试一下"
          }
        ]
      },
      "template": "<%= name %>"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/formily",
      "name": "formily",
      "model": {
        "name": "lowcode"
      },
      "schema": {
        "form": {
          "labelCol": 6,
          "wrapperCol": 12,
          "layout": "vertical",
          "labelAlign": "left",
          "fullness": false,
          "inset": false
        },
        "schema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "title": "测试表单",
              "x-decorator": "FormItem",
              "x-component": "Input",
              "x-validator": [],
              "x-component-props": {},
              "x-decorator-props": {},
              "x-designable-id": "v3zwx2xtcfx",
              "x-index": 0,
              "name": "name"
            }
          },
          "x-designable-id": "d4ogui2afmr"
        }
      },
      "preview": {
        "title": "",
        "description": "",
        "img": [
          "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg"
        ],
        "category": [],
        "notShowInCommand": false,
        "notShowInSnippetsList": false,
        "notShowInintellisense": false,
        "schema": "formily",
        "scripts": [
          {
            "method": "test",
            "remark": "测试一下"
          }
        ]
      },
      "template": "<%= name %>"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/taro-request-api",
      "name": "taro-request-api",
      "model": {},
      "schema": {},
      "preview": {
        "title": "taro-request-api",
        "description": "通过 yapi 接口信息生成接口请求方法",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "schema": "form-render"
      },
      "template": "<%= type %>  \n<% if (api.req_query.length > 0 || api.req_params.length > 0 || api.query_path.params.length > 0) { %>\nexport interface I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params {\n<% api.req_query.map(query => { %><%= query.name %>: string;<% }) %>\n<% api.req_params.map(query => { %><%= query.name %>: string;<% }) %>\n<% api.query_path.params.map(query => { %><%= query.name %>: string;<% }) %>\n}\n<% } %> \n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { %>\n<%= requestBodyType %> \n<% } %> \n\n/**\n* <%= api.title %> \n* /project/<%= api.project_id %>/interface/api/<%= api._id %> \n* @author <%= api.username %>  \n* \n<% if (api.req_query.length > 0 || api.req_params.length > 0 || api.query_path.params.length > 0) { -%>* @param {I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params} params<%- \"\\n\" %><% } _%>\n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { -%>* @param {I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Data} data<%- \"\\n\" %><% } _%>\n* @returns\n*/\nexport function <%= funcName %> (\n<% if (api.req_query.length>0 || api.req_params.length > 0 || api.query_path.params.length > 0) { _%>\nparams: I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params,\n<% } _%>\n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { _%> \ndata: I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Data\n<% } _%> \n) {\nreturn request<<%= typeName %>>(`<%= api.query_path.path.replace(/\\{/g,\"${params.\") %>`, {\n\t\tmethod: '<%= api.method %>',\n\t\t<% if(api.req_query.length>0 || api.req_params.length > 0) { %>params,<% } _%>\n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) {%>data,<% } %> \n\t})\n}"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/umi-request-api",
      "name": "umi-request-api",
      "model": {},
      "schema": {},
      "preview": {
        "title": "umi-request-api",
        "description": "通过 yapi 接口信息生成接口请求方法",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "schema": "form-render"
      },
      "template": "<%= type %>  \n<% if (api.req_query.length > 0 || api.req_params.length > 0 || api.query_path.params.length > 0) { %>\nexport interface I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params {\n<% api.req_query.map(query => { %><%= query.name %>: string;<% }) %>\n<% api.req_params.map(query => { %><%= query.name %>: string;<% }) %>\n<% api.query_path.params.map(query => { %><%= query.name %>: string;<% }) %>\n}\n<% } %> \n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { %>\n<%= requestBodyType %> \n<% } %> \n\n/**\n* <%= api.title %> \n* /project/<%= api.project_id %>/interface/api/<%= api._id %> \n* @author <%= api.username %>  \n* \n<% if (api.req_query.length > 0 || api.req_params.length > 0 || api.query_path.params.length > 0) { -%>* @param {I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params} params<%- \"\\n\" %><% } _%>\n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { -%>* @param {I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Data} data<%- \"\\n\" %><% } _%>\n* @returns\n*/\nexport function <%= funcName %> (\n<% if (api.req_query.length>0 || api.req_params.length > 0 || api.query_path.params.length > 0) { _%>\nparams: I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Params,\n<% } _%>\n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) { _%> \ndata: I<%= funcName.slice(0, 1).toUpperCase() + funcName.slice(1) %>Data\n<% } _%> \n) {\nreturn request<<%= typeName %>>(`<%= api.query_path.path.replace(/\\{/g,\"${params.\") %>`, {\n\t\tmethod: '<%= api.method %>',\n\t\t<% if(api.req_query.length>0 || api.req_params.length > 0) { %>params,<% } _%>\n<% if (requestBodyType && api.req_body_other.indexOf('{}')<0) {%>data,<% } %> \n\t})\n}"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/根据JSON生成API请求方法",
      "name": "根据JSON生成API请求方法",
      "model": {},
      "schema": {},
      "preview": {
        "title": "根据JSON生成API请求方法",
        "description": "根据JSON生成API请求方法",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "schema": "form-render"
      },
      "template": "<%- type %>\n\nexport interface I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params {\n  id: number;\n}\n  \nexport interface I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Data {\n\txx: string;\n}\n  \nexport function <%= rawSelectedText %>(\n  params: I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params,\n  data: I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Data,\n) {\n  return request<I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Result>({\n    url: `xxxx`,\n    method: 'GET',\n    params,\n    data,\n  });\n}"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/根据JSON生成MOCK方法",
      "name": "根据JSON生成MOCK方法",
      "model": {},
      "schema": {},
      "preview": {
        "title": "根据JSON生成MOCK方法",
        "description": "根据JSON生成MOCK方法",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "schema": "form-render"
      },
      "template": "const Mock = require('mockjs');\nconst { Random } = Mock;\n\nexport function <%= rawSelectedText || 'getRandomData' %>() {\n\t<%- mockCode %>\n  const res = <%- mockData %>\n\treturn Promise.resolve(res);\n}"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/根据JSON生成TS类型",
      "name": "根据JSON生成TS类型",
      "model": {},
      "schema": {},
      "preview": {
        "title": "根据JSON生成TS类型",
        "description": "根据JSON生成TS类型",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "schema": "form-render"
      },
      "template": "<%- type %>"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/根据JSON生成TS类型-去除接口名称",
      "name": "根据JSON生成TS类型-去除接口名称",
      "model": {},
      "schema": {},
      "preview": {
        "title": "根据JSON生成TS类型-去除接口名称",
        "description": "根据JSON生成TS类型-去除接口名称",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "schema": "form-render"
      },
      "template": "<%- type.replace(\"export interface IFetchResult\",\"\") %>"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/根据TS类型生成API请求方法",
      "name": "根据TS类型生成API请求方法",
      "model": {},
      "schema": {},
      "preview": {
        "title": "",
        "description": "",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "category": [],
        "schema": "form-render"
      },
      "template": "export interface I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Result {\n\tcode: number;\n\tmsg: string;\n\tresult: <%- rawClipboardText %>\n}\n\nexport interface I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params {\n\tid: number;\n}\n  \nexport interface I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Data {\n\txx: string;\n}\n  \nexport function <%= rawSelectedText %>(\n\tparams: I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Params,\n\tdata: I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Data,\n) {\n\treturn request<I<%= rawSelectedText.slice(0, 1).toUpperCase() + rawSelectedText.slice(1) %>Result>({\n\t\turl: `xxxx`,\n\t\tmethod: 'GET',\n\t\tparams,\n\t\tdata,\n\t});\n}"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/根据TS类型生成MOCK方法",
      "name": "根据TS类型生成MOCK方法",
      "model": {},
      "schema": {},
      "preview": {
        "title": "根据TS类型生成MOCK方法",
        "description": "根据TS类型生成MOCK方法",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "schema": "form-render"
      },
      "template": "const Mock = require('mockjs');\nconst { Random } = Mock;\n\nexport function <%= rawSelectedText || 'getRandomData' %>() {\n\t<%- mockCode %>\n  const res = <%- mockData %>\n\treturn Promise.resolve(res);\n}"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/根据TS类型生成markdown表格",
      "name": "根据TS类型生成markdown表格",
      "model": {
        "name": "lowcode"
      },
      "schema": {
        "type": "page",
        "body": [
          {
            "type": "form",
            "title": "",
            "body": [
              {
                "type": "input-text",
                "name": "name",
                "label": "测试表单",
                "id": "u:4886baa626cf",
                "value": ""
              }
            ],
            "id": "u:67967afb0e69",
            "submitText": "",
            "name": "form",
            "data": "[Circular]"
          }
        ],
        "id": "u:d87dbf6bf8df",
        "asideResizor": false,
        "style": {
          "boxShadow": " 0px 0px 0px 0px transparent"
        },
        "pullRefresh": {
          "disabled": true
        },
        "regions": [
          "body"
        ],
        "name": "page"
      },
      "preview": {
        "title": "",
        "description": "",
        "img": [
          "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg"
        ],
        "category": [],
        "notShowInCommand": true,
        "notShowInSnippetsList": true,
        "notShowInintellisense": true,
        "schema": "amis"
      },
      "template": "<%= name %>"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/根据YAPI接口定义生成高级Mock脚本",
      "name": "根据YAPI接口定义生成高级Mock脚本",
      "model": {},
      "schema": {},
      "preview": {
        "title": "",
        "description": "",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "category": [
          "YAPI",
          "脚本"
        ],
        "schema": "form-render"
      },
      "template": "<%- mockCode %>\nconst mockData = <%- mockData %>\n\nObject.assign( mockJson, mockData)\n"
    },
    {
      "path": "~/.vgcode/materials/materials/snippets/测试编译前后脚本",
      "name": "测试编译前后脚本",
      "model": {},
      "schema": {},
      "preview": {
        "title": "",
        "description": "",
        "img": "https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg",
        "schema": "form-render"
      },
      "template": "测试编译前后脚本"
    }
  ]
};
