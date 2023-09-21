/*
 * @Author: zdd
 * @Date: 2023-06-29 15:19:34
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-17 20:16:21
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/materials/detail.tsx
 * @Description: 
 */
import { useEffect } from 'react';
import { Form, Space, Button, message, Modal, Spin } from 'antd';
import { useImmer } from 'use-immer';
import FormRender, { useForm } from 'form-render';
import { useParams, useLocation, useModel } from '@umijs/max';

import { IGetLocalMaterialsResult, genCodeBySnippetMaterial } from '@/common';
import CodeMirror from '@/components/CodeMirror';
import AmisComponent from '@/components/AmisComponent';
import RunScript from '@/components/RunScript';

const MaterialDetailPage: React.FC = () => {
  const { name } = useParams();
  const location = useLocation();
  const form = useForm();
  const [formData, setFormData] = useImmer({});
  const { initialState, loading } = useModel('@@initialState', ({ initialState, loading }) => ({ initialState, loading }));
  const [selectedMaterial, setSelectedMaterial] = useImmer<IGetLocalMaterialsResult>({ schema: {}, model: {} } as any);
  const [templateModalVisble, setTemplateModalVisble] = useImmer(false);
  const [scriptModalVisible, setScriptModalVisible] = useImmer(false);

  useEffect(() => {
    if (location.state) {
      const selected = location.state as IGetLocalMaterialsResult;
      setFormData(selected.model);
      setSelectedMaterial(selected);
      form.setValues(selected.model);
    } else if (initialState?.localMaterials.snippets) {
      const selected = initialState?.localMaterials.snippets.find((s) => s.name === name)!;
      setFormData(selected.model);
      setSelectedMaterial(selected);
      form.setValues(selected.model);
    }
  }, [location.state, name, initialState])

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
