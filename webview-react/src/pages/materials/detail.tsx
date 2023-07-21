/*
 * @Author: zdd
 * @Date: 2023-06-29 15:19:34
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-21 18:03:03
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/materials/detail.tsx
 * @Description: 
 */
import { useEffect } from 'react';
import { useMount } from 'ahooks';
import { DownOutlined } from '@ant-design/icons';
import { Form, Space, Button, Dropdown, message, MenuProps, Modal, Spin } from 'antd';
import { useImmer } from 'use-immer';
import FormRender, { useForm } from 'form-render';
import { useParams } from '@umijs/max';

import { IGetLocalMaterialsResult, genCodeBySnippetMaterial, getLocalMaterials } from '@/common';
import CodeMirror from '@/components/CodeMirror';
import AmisComponent from '@/components/AmisComponent';
import JsonToTs from '@/components/JsonToTs';
import YapiModal from '@/components/YapiModal';
import RunScript from '@/components/RunScript';

// import './index.less';

const MaterialDetailPage: React.FC = () => {
  const { name } = useParams();
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'JSON TO TS',
      onClick: () => {
        setJsonToTsModalVisble(true)
      }
    },
    {
      key: '2',
      label: '根据 YAPI 接口追加模板数据',
      onClick: () => {
        setYapiModalVsible(true)
      }
    },
    {
      key: '3',
      label: '编辑模板',
      onClick: () => {
        setTemplateModalVisble(true);
      }
    },
  ]
  const [formData, setFormData] = useImmer({});
  const [loading, setLoading] = useImmer(false);
  const form = useForm();
  const [selectedMaterial, setSelectedMaterial] = useImmer<IGetLocalMaterialsResult>({ schema: {}, model: {} } as any);
  const [templateModalVisble, setTemplateModalVisble] = useImmer(false);
  const [jsonToTsModalVisble, setJsonToTsModalVisble] = useImmer(false);
  const [yapiModalVsible, setYapiModalVsible] = useImmer(false);
  const [scriptModalVisible, setScriptModalVisible] = useImmer(false);

  useEffect(() => {

  }, [selectedMaterial])

  useMount(async () => {
    setLoading(true);
    getLocalMaterials().then(({ snippets }) => {
      if (snippets.length) {
        const selected = snippets.find((s) => s.name === name);
        if (selected && !selected.preview.schema) {
          selected.preview.schema = 'form-render';
        }
        console.log(snippets, name);

        setFormData(selected?.model);
        setSelectedMaterial(selected!);
        form.setValues(selected?.model);
        setLoading(false);
      }
    });
  })

  const watch = {
    '#': (val: any) => {
      setFormData(JSON.parse(JSON.stringify(val)));
    },
  };

  return (
    <Spin spinning={loading}>
      {!loading && (<Form layout="vertical">
        <Form.Item
          label={<span style={{ fontWeight: 'bold' }}>模板</span>}
          style={{ display: selectedMaterial.path ? 'block' : 'none' }}
        >
          <CodeMirror
            domId="templateCodeMirror"
            lint={false}
            value={selectedMaterial.template}
            onChange={(value) => {
              setSelectedMaterial((s) => ({
                ...s,
                template: value,
              }));
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
                      setScriptModalVisible(true);
                    }}
                  >
                    执行脚本设置模板数据
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      setSelectedMaterial((s) => ({
                        ...s,
                        model: formData,
                      }));
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
              setSelectedMaterial((s) => ({
                ...s,
                model: JSON.parse(value),
              }));
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
      </Form>)}
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
      <YapiModal
        visible={yapiModalVsible}
        onOk={(m) => {
          setSelectedMaterial((s) => ({
            ...s,
            model: { ...selectedMaterial.model, ...m },
          }));
          setYapiModalVsible(false);
        }}
        onCancel={() => {
          setYapiModalVsible(false);
        }}
      />
      <JsonToTs
        visible={jsonToTsModalVisble}
        json={selectedMaterial.model}
        onCancel={() => {
          setJsonToTsModalVisble(false);
        }}
        onOk={(type) => {
          setSelectedMaterial((s) => ({
            ...s,
            model: { ...selectedMaterial.model, type },
          }));
          setJsonToTsModalVisble(false);
        }}
      />
      <Modal
        open={templateModalVisble}
        title="编辑模板"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setTemplateModalVisble(false);
        }}
        onOk={() => {
          setTemplateModalVisble(false);
        }}
      >
        <CodeMirror
          domId="templateCodeMirrorDialog"
          lint={false}
          value={selectedMaterial.template}
          onChange={(value) => {
            setSelectedMaterial((s) => ({
              ...s,
              template: value,
            }));
          }}
        />
      </Modal>
      <RunScript
        visible={scriptModalVisible}
        materialPath={selectedMaterial.path}
        model={selectedMaterial.model}
        scripts={selectedMaterial.preview?.scripts}
        onCancel={() => {
          setScriptModalVisible(false);
        }}
        onOk={(result) => {
          setSelectedMaterial((s) => ({
            ...s,
            model: result,
          }));
          setFormData(result);
          form.setValues(result);
          setScriptModalVisible(false);
        }}
      />
    </Spin>
  )
}

export default MaterialDetailPage;
