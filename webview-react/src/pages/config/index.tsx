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
              "val": {
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
  const [formData, setFormDate] = useImmer({
    yapi: {
      domain: '',
      projects: [
        {
          name: '',
          token: '',
          domain: '',
        },
      ],
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
      setFormDate(data);
      form.setValues(data);
    });
  }, []);

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
            savePluginConfig(formData).then(() => {
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
