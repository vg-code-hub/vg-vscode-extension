/*
 * @Author: zdd
 * @Date: 2023-06-29 15:19:34
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-29 18:46:09
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/snippets/detail.tsx
 * @Description: 
 */
import { useEffect } from 'react';
import { useMount } from 'ahooks';
import { DownOutlined } from '@ant-design/icons';
import { Form, Space, Button, Dropdown, message, MenuProps } from 'antd';
import { useImmer } from 'use-immer';
import FormRender, { useForm } from 'form-render';
import { useLocation } from '@umijs/max';

import { IGetLocalMaterialsResult, genCodeBySnippetMaterial } from '@/common';
import CodeMirror from '@/components/CodeMirror';
import AmisComponent from '@/components/AmisComponent';
import './index.less';

const SnippetDetailPage: React.FC = () => {
  const { state }: { state: any } = useLocation();
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'JSON TO TS',
      onClick: () => {

      }
    },
    {
      key: '2',
      label: '根据 YAPI 接口追加模板数据',
      onClick: () => {

      }
    },
    {
      key: '3',
      label: '编辑模板',
      onClick: () => {

      }
    },
  ]
  const [formData, setFormData] = useImmer({});
  const form = useForm();
  const [selectedMaterial, setSelectedMaterial] = useImmer<IGetLocalMaterialsResult>({ schema: {}, model: {} } as any);

  useEffect(() => {

  }, [selectedMaterial])

  useMount(() => {
    if (state && !state.preview.schema) {
      state.preview.schema = 'form-render';
    }

    setSelectedMaterial(state as any);
  })

  const watch = {
    '#': (val: any) => {
      setFormData(JSON.parse(JSON.stringify(val)));
    },
  };

  return (
    <>
      <Form layout="vertical">
        <Form.Item
          label={<span style={{ fontWeight: 'bold' }}>模板</span>}
          style={{ display: selectedMaterial.path ? 'block' : 'none' }}
        >
          <CodeMirror
            domId="templateCodeMirror"
            lint={false}
            value={selectedMaterial.template}
            onChange={(value) => {
              // model.setSelectedMaterial((s) => ({
              //   ...s,
              //   template: value,
              // }));
            }}
          />
        </Form.Item>
        {Object.keys(selectedMaterial.schema).length > 0 && (
          <Form.Item
            label={<span style={{ fontWeight: 'bold' }}>Schema 表单</span>}
          >
            {selectedMaterial.preview.schema === 'form-render' && (
              <>
                <FormRender
                  schema={selectedMaterial.schema}
                  form={form}
                  watch={watch}
                  maxWidth={360}
                />
                <br></br>
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      // model.setScriptModalVisible(true);
                    }}
                  >
                    执行脚本设置模板数据
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      // model.setSelectedMaterial((s) => ({
                      //   ...s,
                      //   model: model.formData,
                      // }));
                    }}
                  >
                    重新生成模板数据
                  </Button>
                </Space>
              </>
            )}
            {selectedMaterial.preview.schema === 'amis' && (
              <AmisComponent
                schema={selectedMaterial.schema}
                path={selectedMaterial.path}
                scripts={selectedMaterial.preview.scripts}
                onFormChange={(values) => {
                  setSelectedMaterial((s) => ({
                    ...s,
                    model: values,
                  }));
                }}
              />
            )}
          </Form.Item>
        )}
        <Form.Item
          label={<span style={{ fontWeight: 'bold' }}>模板数据</span>}
          style={{ display: selectedMaterial.path ? 'block' : 'none' }}
        >
          <CodeMirror
            domId="modelCodeMirror"
            lint
            value={JSON.stringify(selectedMaterial.model, null, 2)}
            onChange={(value) => {
              // model.setSelectedMaterial((s) => ({
              //   ...s,
              //   model: JSON.parse(value),
              // }));
            }}
          />
          <br></br>
          <Space>
            <Dropdown menu={{ items }}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                更多功能 <DownOutlined />
              </a>
            </Dropdown>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                genCodeBySnippetMaterial({
                  model: selectedMaterial.model,
                  template: selectedMaterial.template,
                  name: selectedMaterial.name,
                }).then(() => {
                  message.success('生成成功');
                });
              }}
            >
              生成代码
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Button
          shape="round"
          onClick={() => {
            history.back();
          }}
          style={{ width: '50%' }}
        >
          返回
        </Button>
      </div>
    </>
  )
}

export default SnippetDetailPage;
