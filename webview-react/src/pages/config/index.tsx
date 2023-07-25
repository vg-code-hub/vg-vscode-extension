/*
 * @Author: zdd
 * @Date: 2023-06-27 22:01:26
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-19 18:03:05
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
      "style": { "backgroundColor": "#fff" },
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
    "yapi": {
      "title": "swagger配置",
      "type": "object",
      "theme": "collapse",
      "style": { "backgroundColor": "#fff" },
      "properties": {
        "jsonUrl": {
          "title": "域名",
          "type": "string",
          "description": "",
          "labelWidth": 100,
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
          "labelWidth": 100,
          "ui:readonly": false,
          "ui:options": {},
          "props": {}
        },
        "folderFilter": {
          "title": "过滤路径",
          "type": "array",
          "description": "源路径过滤不会显示",
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
    "mock": {
      "title": "mock 配置",
      "type": "object",
      "theme": "collapse",
      "labelWidth": 130,
      "style": { "backgroundColor": "#fff" },
      "properties": {
        "mockNumber": {
          "title": "模拟number数据",
          "type": "string",
          "ui:options": {}
        },
        "mockBoolean": {
          "title": "模拟boolean数据",
          "type": "string",
          "ui:labelWidth": 0,
          "ui:options": {}
        },
        "mockString": {
          "title": "模拟string数据",
          "type": "string",
          "ui:options": {}
        },
        "mockKeyWordEqual": {
          "title": "模拟关键词-全等匹配",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "key": {
                "title": "关键字",
                "type": "string",
                "ui:width": "50%",
                "ui:options": {}
              },
              "value": {
                "title": "替换为",
                "type": "string",
                "ui:width": "50%",
                "ui:options": {}
              }
            }
          },
          "ui:options": {}
        },
        "mockKeyWordLike": {
          "title": "模拟关键词-相似匹配",
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "key": {
                "title": "关键字",
                "type": "string",
                "ui:width": "50%",
                "ui:options": {}
              },
              "value": {
                "title": "替换为",
                "type": "string",
                "ui:width": "50%",
                "ui:options": {}
              }
            }
          },
          "ui:options": {},
          "props": {}
        }
      }
    }
  }
};

const ConfigPage: React.FC = () => {
  const form = useForm();
  const [formData, setFormDate] = useImmer<any>({
    type: "dart",
    yapi: {
      jsonUrl: '',
      outputDir: '',
    },
    mock: {
      mockNumber: '',
      mockBoolean: '',
      mockString: '',
      mockKeyWordEqual: [
        {
          key: '',
          value: '',
        },
      ],
      mockKeyWordLike: [
        {
          key: '',
          value: '',
        },
      ],
    },
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
      const { folderFilter, folderMap, customPathFolder, customModelFolder } = data.yapi;

      setFormDate((s: any) => {
        for (const key in data) {
          s[key] = data[key as keyof typeof data];
          if (key === 'yapi' && folderFilter) {
            s[key].folderFilter = folderFilter.map((value) => ({ value }));
          }
          if (key === 'yapi' && folderMap) {
            s[key].folderMap = Object.keys(folderMap).map((source) => {
              return {
                source,
                folder: folderMap[source],
              };
            });
          }
          if (key === 'yapi' && customPathFolder) {
            s[key].customPathFolder = Object.keys(customPathFolder).map((source) => {
              return {
                source,
                folder: customPathFolder[source],
              };
            });
          }
          if (key === 'yapi' && customModelFolder) {
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
            const { folderFilter, folderMap, customPathFolder, customModelFolder } = formData.yapi;
            const _formData = JSON.parse(JSON.stringify(formData));
            if (folderFilter && folderFilter.length > 0) {
              _formData.yapi.folderFilter = folderFilter.filter((f: any) => !!f).map(({ value }: any) => value);
            }
            if (folderMap && folderMap.length > 0) {
              _formData.yapi.folderMap = {}
              folderMap.filter((f: any) => !!f).forEach(({ source, folder }: any) => {
                _formData.yapi.folderMap[source] = folder;
              });
            }
            if (customPathFolder && customPathFolder.length > 0) {
              _formData.yapi.customPathFolder = {}
              customPathFolder.filter((f: any) => !!f).forEach(({ source, folder }: any) => {
                _formData.yapi.customPathFolder[source] = folder;
              });
            }
            if (customModelFolder && customModelFolder.length > 0) {
              _formData.yapi.customModelFolder = {}
              customModelFolder.filter((f: any) => !!f).forEach(({ source, folder }: any) => {
                _formData.yapi.customModelFolder[source] = folder;
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
