export default [
  {
    path: '1',
    name: 'amis schema',
    model: {
      string: '',
      select: 'a',
    },
    schema: {
      "type": "page",
      "title": "Hello world",
      "body": [
        {
          "type": "tpl",
          "tpl": "初始页面",
          "wrapperComponent": "",
          "inline": false,
          "id": "u:cbaa951a27fd"
        },
        {
          "type": "matrix-checkboxes",
          "name": "matrix",
          "label": "矩阵开关",
          "rowLabel": "行标题说明",
          "columns": [
            {
              "label": "列1"
            },
            {
              "label": "列2"
            }
          ],
          "rows": [
            {
              "label": "行1"
            },
            {
              "label": "行2"
            }
          ],
          "id": "u:148e89421e85"
        }
      ],
      "id": "u:1028c37d971d"
    },
    preview: {
      title: 'amis schema',
      description: 'amis schema',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
      schema: 'amis',
    },
    template: '1212121',
  },
  {
    path: '2',
    name: '2',
    model: {
      select: 'c',
      includeContext: false,
      includeStyle: true,
      form: [],
    },
    schema: {
      "type": "object",
      coloumn: 3,
      "properties": {
        "inputDemo": {
          "title": "长度",
          "type": "string",
          "default": "750",
          "rules": [
            {
              "pattern": "^[A-Za-z0-9]+$",
              "message": "请输入正确格式"
            }
          ],
          "className": "input-with-px",
          "props": {
            "addonAfter": "px"
          }
        },
        "numberDemo": {
          "title": "数字",
          "description": "数字输入框",
          "type": "number",
          "min": 10,
          "max": 100,
          "step": 10
        },
        "textareaDemo": {
          "title": "输入框",
          "type": "string",
          "widget": "textarea",
          "default": "FormRender\nHello World!",
          "required": true
        },
        "imgDemo": {
          "title": "图片",
          "type": "string",
          "format": "image",
          "default": "https://img.alicdn.com/tfs/TB1P8p2uQyWBuNjy0FpXXassXXa-750-1334.png"
        },
        "uploadDemo": {
          "title": "文件上传",
          "type": "string",
          "default": "https://img.alicdn.com/tfs/TB1P8p2uQyWBuNjy0FpXXassXXa-750-1334.png",
          "widget": "upload",
          "props": {
            "action": "https://www.mocky.io/v2/5cc8019d300000980a055e76"
          }
        },
        "disabledDemo": {
          "title": "不可用",
          "type": "string",
          "default": "我是一个被 disabled 的值",
          "disabled": true
        },
        "enumDemo": {
          "title": "枚举",
          "type": "string",
          "enum": [
            "A",
            "B"
          ],
          "enumNames": [
            "养成",
            "<span style='background-color: black;display: inline-block;vertical-align: text-top;width: 48px;height: 24px;margin-top:-2px;color:white; border: 1px solid #ddd;'>试试</span>"
          ],
          "width": "50%"
        },
        "dateDemo": {
          "title": "时间",
          "format": "dateTime",
          "type": "string",
          "widget": "date",
          "width": "50%",
          "default": "2018-11-22",
          "required": true
        },
        "objDemo": {
          "title": "单个对象",
          "description": "这是一个对象类型",
          "type": "object",
          "properties": {
            "isLike": {
              "title": "是否显示颜色选择",
              "type": "boolean",
              "default": true
            },
            "background": {
              "title": "颜色选择",
              "description": "特殊面板",
              "format": "color",
              "type": "string",
              "hidden": "{{rootValue.isLike === false}}",
              "default": "#ffff00"
            },
            "wayToTravel": {
              "title": "旅行方式",
              "type": "string",
              "enum": [
                "self",
                "group"
              ],
              "enumNames": [
                "自驾",
                "跟团"
              ],
              "widget": "radio"
            },
            "canDrive": {
              "title": "是否拥有驾照",
              "type": "boolean",
              "default": false,
              "hidden": "{{rootValue.wayToTravel !== 'self'}}"
            }
          },
          "required": [
            "background"
          ]
        },
        "multiSelectDemo": {
          "title": "多选组件",
          "tooltip": "多选功能",
          "type": "array",
          "items": {
            "type": "string"
          },
          "enum": [
            "A",
            "B",
            "C",
            "D"
          ],
          "enumNames": [
            "杭州",
            "武汉",
            "湖州",
            "贵阳"
          ],
          "widget": "multiSelect",
          "required": true
        },
        "custom": {
          "properties": {
            "payType": {
              "title": "支付方式",
              "type": "array",
              "items": {
                "type": "string"
              },
              "enum": [
                "1",
                "5",
                "6"
              ],
              "enumNames": [
                "预付",
                "面付",
                "信用住"
              ]
            }
          },
          "type": "object",
          "required": [
            "payType"
          ],
          "title": "酒店行业限制",
          "name": "custom"
        },
        "arrDemo": {
          "title": "对象数组",
          "description": "对象数组嵌套功能",
          "type": "array",
          "min": 1,
          "max": 3,
          "items": {
            "type": "object",
            "properties": {
              "num": {
                "title": "数字参数",
                "description": "number类型",
                "type": "number"
              },
              "name": {
                "title": "字符名称",
                "description": "string类型",
                "type": "string",
                "rules": [
                  {
                    "pattern": "^[A-Za-z0-9]+$"
                  }
                ],
                "disabled": "{{rootValue.num === 3}}"
              }
            }
          },
          "props": {
            "foldable": true,
            "hideDelete": "{{rootValue.arrDemo.length === 1}}",
            "buttons": [
              {
                "text": "复制",
                "icon": "CopyOutlined",
                "callback": "copyLast"
              }
            ]
          }
        }
      }
    },
    preview: {
      title: '哈哈哈',
      description: 'ksjfdfhdfhdkfjd',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
    },
    template: '',
  },
  {
    path: '3',
    name: '3',
    model: {
      schema: {
        type: 'object',
        properties: {
          string: { title: '字符串', type: 'string' },
          select: {
            title: '单选',
            type: 'string',
            enum: ['a', 'b', 'c'],
            enumNames: ['选项1', '选项2', '选项3'],
          },
        },
      },
      formData: { string: '', select: 'a' },
    },
    schema: {
      type: 'object',
      properties: {
        string: { title: '字符串', type: 'string' },
        select: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['选项1', '选项2', '选项3'],
        },
      },
    },
    preview: {
      title: '哈哈哈',
      description: 'ksjfdfhdfhdkfjd',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
    },
    template: '',
  },
  {
    path: '4',
    name: '4',
    model: {
      schema: {
        type: 'object',
        properties: {
          string: { title: '字符串', type: 'string' },
          select: {
            title: '单选',
            type: 'string',
            enum: ['a', 'b', 'c'],
            enumNames: ['选项1', '选项2', '选项3'],
          },
        },
      },
      formData: { string: '', select: 'a' },
    },
    schema: {
      type: 'object',
      properties: {
        string: { title: '字符串', type: 'string' },
        select: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['选项1', '选项2', '选项3'],
        },
      },
    },
    preview: {
      title: '哈哈哈',
      description: 'ksjfdfhdfhdkfjd',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
    },
    template: '',
  },
  {
    path: '5',
    name: '5',
    model: {
      schema: {
        type: 'object',
        properties: {
          string: { title: '字符串', type: 'string' },
          select: {
            title: '单选',
            type: 'string',
            enum: ['a', 'b', 'c'],
            enumNames: ['选项1', '选项2', '选项3'],
          },
        },
      },
      formData: { string: '', select: 'a' },
    },
    schema: {
      type: 'object',
      properties: {
        string: { title: '字符串', type: 'string' },
        select: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['选项1', '选项2', '选项3'],
        },
      },
    },
    preview: {
      title: '哈哈哈',
      description: 'ksjfdfhdfhdkfjd',
      img: [
        'https://fastly.jsdelivr.net/gh/migrate-gitee/img-host/2020/11/05/1604587962875.jpg',
        'https://s1.ax1x.com/2023/04/16/p9CenKS.jpg',
      ],
    },
    template: '',
  },
];
