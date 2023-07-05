export default {
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
