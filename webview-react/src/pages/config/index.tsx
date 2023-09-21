/*
 * @Author: zdd
 * @Date: 2023-06-27 22:01:26
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-17 20:22:00
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/config/index.tsx
 * @Description: 
 */
import { PageContainer } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import FormRender, { useForm } from 'form-render';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { getLocalMaterials, getPluginConfig, savePluginConfig } from '@/common';

const schame: any = {
  "type": "object",
  "displayType": "row",
  "labelWidth": 80,
  "properties": {
    "type": {
      "title": "项目类别",
      "type": "string",
      "labelWidth": 120,
      "style": { "backgroundColor": "#fff" },
      "ui:options": {
        "labelAlign": "left"
      },
      "enum": [
        "dart",
        "typescript"
      ],
      "enumNames": [
        "dart",
        "typescript"
      ],
      "widget": "radio"
    },
    "swagger": {
      "title": "swagger配置",
      "type": "object",
      "theme": "collapse",
      "column": 3,
      "style": { "backgroundColor": "#fff" },
      "properties": {
        "jsonUrl": {
          "title": "域名",
          "type": "string",
          "description": "",
          "labelWidth": 140,
          "required": true,
          "width": "100%",
          "ui:readonly": false,
          "ui:options": {
            "labelAlign": "left"
          },
          "props": {}
        },
        "outputDir": {
          "title": "目标位置",
          "type": "string",
          "description": "",
          "labelWidth": 140,
          "required": true,
          "ui:readonly": false,
          "ui:options": {},
          "props": {}
        },
        "urlPrefix": {
          "title": "urlPrefix",
          "type": "string",
          "description": "",
          "labelWidth": 140,
          "ui:readonly": false,
          "props": {}
        },
        "overwrite": {
          "title": "覆盖",
          "type": "boolean",
          "labelWidth": 100,
          "widget": "switch"
        },
        "ignoreResponse": {
          "title": "忽略响应类",
          "tooltip": "例：$1.data (表示取第一层data字段)，$1从第一层开始取值。",
          "type": "string",
          "labelWidth": 140,
          "props": {}
        },
        "pageResponse": {
          "type": "object",
          "title": "分页响应类",
          "widget": "card",
          "column": 2,
          "properties": {
            "name": {
              "title": "类名",
              "tooltip": "例：PageData.data (PageData 表示公共分页类，data 表示数据字段)",
              "type": "string",
              "props": {}
            },
            "props": {
              "title": "参数",
              "tooltip": "参数最后一项会映射为类名数据字段[data]。",
              "type": "string",
              "props": {}
            }
          }
        },
        "folderFilter": {
          "title": "过滤路径",
          "type": "array",
          "description": "只显示过滤的swagger路径",
          "items": {
            "type": "object",
            "properties": {
              "value": {
                "title": "源路径",
                "type": "string",
                "props": {}
              }
            }
          },
          "ui:options": {},
          "props": {}
        },
        "folderMap": {
          "title": "路径映射",
          "type": "array",
          "ui:options": {},
          "props": {},
          "description": "生成文件目录替换",
          "items": {
            "type": "object",
            "column": 2,
            "displayType": "row",
            "properties": {
              "source": {
                "title": "源路径",
                "type": "string",
                "ui:labelWidth": 0,
                "ui:options": {},
                "props": {}
              },
              "folder": {
                "title": "目标路径",
                "type": "string",
                "ui:options": {},
                "props": {}
              }
            }
          }
        },
        "customPathFolder": {
          "title": "请求路径映射",
          "type": "array",
          "items": {
            "type": "object",
            "column": 2,
            "displayType": "row",
            "properties": {
              "source": {
                "title": "源路径",
                "type": "string",
                "ui:labelWidth": 0,
                "ui:options": {},
                "props": {}
              },
              "folder": {
                "title": "位置",
                "type": "string",
                "ui:options": {},
                "props": {}
              }
            }
          },
          "ui:options": {},
          "props": {}
        },
        "customModelFolder": {
          "title": "model 路径映射",
          "type": "array",
          "items": {
            "type": "object",
            "column": 2,
            "displayType": "row",
            "properties": {
              "source": {
                "title": "modelName",
                "type": "string",
                "ui:labelWidth": 0,
                "ui:options": {},
                "props": {}
              },
              "folder": {
                "title": "位置",
                "type": "string",
                "ui:options": {},
                "props": {}
              }
            }
          },
          "ui:options": {},
          "props": {}
        }
      }
    },
    // "mock": {
    //   "title": "mock 配置",
    //   "type": "object",
    //   "theme": "collapse",
    //   "labelWidth": 130,
    //   "style": { "backgroundColor": "#fff" },
    //   "properties": {
    //     "mockNumber": {
    //       "title": "模拟number数据",
    //       "type": "string",
    //       "ui:options": {}
    //     },
    //     "mockBoolean": {
    //       "title": "模拟boolean数据",
    //       "type": "string",
    //       "ui:labelWidth": 0,
    //       "ui:options": {}
    //     },
    //     "mockString": {
    //       "title": "模拟string数据",
    //       "type": "string",
    //       "ui:options": {}
    //     },
    //     "mockKeyWordEqual": {
    //       "title": "模拟关键词-全等匹配",
    //       "type": "array",
    //       "items": {
    //         "type": "object",
    //         "properties": {
    //           "key": {
    //             "title": "关键字",
    //             "type": "string",
    //             "ui:width": "50%",
    //             "ui:options": {}
    //           },
    //           "value": {
    //             "title": "替换为",
    //             "type": "string",
    //             "ui:width": "50%",
    //             "ui:options": {}
    //           }
    //         }
    //       },
    //       "ui:options": {}
    //     },
    //     "mockKeyWordLike": {
    //       "title": "模拟关键词-相似匹配",
    //       "type": "array",
    //       "items": {
    //         "type": "object",
    //         "properties": {
    //           "key": {
    //             "title": "关键字",
    //             "type": "string",
    //             "ui:width": "50%",
    //             "ui:options": {}
    //           },
    //           "value": {
    //             "title": "替换为",
    //             "type": "string",
    //             "ui:width": "50%",
    //             "ui:options": {}
    //           }
    //         }
    //       },
    //       "ui:options": {},
    //       "props": {}
    //     }
    //   }
    // }
  }
};

const ConfigPage: React.FC = () => {
  const form = useForm();
  const [formData, setFormDate] = useImmer<any>({
    type: "dart",
    swagger: {
      jsonUrl: '',
      outputDir: '',
    },
    // mock: {
    //   mockNumber: '',
    //   mockBoolean: '',
    //   mockString: '',
    //   mockKeyWordEqual: [
    //     {
    //       key: '',
    //       value: '',
    //     },
    //   ],
    //   mockKeyWordLike: [
    //     {
    //       key: '',
    //       value: '',
    //     },
    //   ],
    // },
  });

  useEffect(() => {
    getLocalMaterials().then(({ blocks }) => {
      form.setSchemaByPath('commonlyUsedBlock', {
        enum: blocks.map((s) => s.name),
        enumNames: blocks.map((s) => s.name),
      });
    });
    getPluginConfig().then((data) => {
      console.log(data);
      const { folderFilter, folderMap, customPathFolder, customModelFolder } = data.swagger;

      setFormDate((s: any) => {
        for (const key in data) {
          s[key] = data[key as keyof typeof data];
          if (key === 'swagger' && folderFilter && Array.isArray(folderFilter)) {
            s[key].folderFilter = folderFilter.map((value) => ({ value }));
          }
          if (key === 'swagger' && folderMap) {
            s[key].folderMap = Object.keys(folderMap).map((source) => {
              return {
                source,
                folder: folderMap[source],
              };
            });
          }
          if (key === 'swagger' && customPathFolder) {
            s[key].customPathFolder = Object.keys(customPathFolder).map((source) => {
              return {
                source,
                folder: customPathFolder[source],
              };
            });
          }
          if (key === 'swagger' && customModelFolder) {
            s[key].customModelFolder = Object.keys(customModelFolder).map((source) => {
              return {
                source,
                folder: customModelFolder[source],
              };
            });
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    form.setValues(formData);
  }, [formData])

  const watch = {
    '#': (val: any) => {
      setFormDate(JSON.parse(JSON.stringify(val)));
    },
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '项目配置',
      }}
    >
      <FormRender
        form={form}
        schema={schame}
        watch={watch}
      />
      <div style={{ textAlign: 'center' }}>
        <Button
          shape="round"
          type="primary"
          style={{ width: '30%' }}
          onClick={() => {
            const { folderFilter, folderMap, customPathFolder, customModelFolder } = formData.swagger;
            const _formData = JSON.parse(JSON.stringify(formData));
            if (folderFilter && folderFilter.length > 0) {
              _formData.swagger.folderFilter = folderFilter.filter((f: any) => !!f).map(({ value }: any) => value);
            }
            if (folderMap && folderMap.length > 0) {
              _formData.swagger.folderMap = {}
              folderMap.filter((f: any) => !!f).forEach(({ source, folder }: any) => {
                _formData.swagger.folderMap[source] = folder;
              });
            }
            if (customPathFolder && customPathFolder.length > 0) {
              _formData.swagger.customPathFolder = {}
              customPathFolder.filter((f: any) => !!f).forEach(({ source, folder }: any) => {
                _formData.swagger.customPathFolder[source] = folder;
              });
            }
            if (customModelFolder && customModelFolder.length > 0) {
              _formData.swagger.customModelFolder = {}
              customModelFolder.filter((f: any) => !!f).forEach(({ source, folder }: any) => {
                _formData.swagger.customModelFolder[source] = folder;
              });
            }
            console.log(_formData);

            savePluginConfig(_formData).then(() => {
              message.success('保存成功');
            });
          }}
        >
          保存
        </Button>
      </div>
    </PageContainer>
  );
};

export default ConfigPage;
