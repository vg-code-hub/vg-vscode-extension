/*
 * @Author: zdd
 * @Date: 2023-06-27 22:01:26
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 16:20:42
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
  type: 'object',
  properties: {
    yapi: {
      title: 'yapi配置',
      type: 'object',
      properties: {
        domain: {
          title: '域名',
          type: 'string',
          description: '',
          'ui:labelWidth': 146,
          'ui:readonly': false,
          'ui:options': {},
        },
        projects: {
          title: '项目列表',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                title: '名称',
                type: 'string',
                'ui:labelWidth': 0,
                'ui:options': {},
              },
              token: {
                title: 'token',
                type: 'string',
                'ui:options': {},
              },
              domain: {
                title: '域名',
                type: 'string',
                description: '单独定义 yapi 项目的域名',
                'ui:options': {},
              },
            },
          },
          'ui:options': {},
        },
      },
    },
    mock: {
      title: 'mock 配置',
      type: 'object',
      properties: {
        mockNumber: {
          title: '模拟number数据',
          type: 'string',
          'ui:options': {},
        },
        mockBoolean: {
          title: '模拟boolean数据',
          type: 'string',
          'ui:labelWidth': 0,
          'ui:options': {},
        },
        mockString: {
          title: '模拟string数据',
          type: 'string',
          'ui:options': {},
        },
        mockKeyWordEqual: {
          title: '模拟关键词-全等匹配',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                title: '关键字',
                type: 'string',
                'ui:width': '50%',
                'ui:options': {},
              },
              value: {
                title: '替换为',
                type: 'string',
                'ui:width': '50%',
                'ui:options': {},
              },
            },
          },
          'ui:options': {},
        },
        mockKeyWordLike: {
          title: '模拟关键词-相似匹配',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: {
                title: '关键字',
                type: 'string',
                'ui:width': '50%',
                'ui:options': {},
              },
              value: {
                title: '替换为',
                type: 'string',
                'ui:width': '50%',
                'ui:options': {},
              },
            },
          },
          'ui:options': {},
          props: {},
        },
      },
    },
    commonlyUsedBlock: {
      title: '常用区块',
      description: '',
      type: 'array',
      items: {
        type: 'string',
      },
      enum: [],
      enumNames: [],
      widget: 'multiSelect',
    },
  },
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
    getLocalMaterials('blocks').then((res) => {
      form.setSchemaByPath('commonlyUsedBlock', {
        enum: res.map((s) => s.name),
        enumNames: res.map((s) => s.name),
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
        displayType="column"
        // showDescIcon={true}
        labelWidth={170}
        column={1}
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
