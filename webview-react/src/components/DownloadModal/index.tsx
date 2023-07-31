/*
 * @Author: zdd
 * @Date: 2023-07-04 16:34:35
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 17:53:29
 * @FilePath: /vg-vscode-extension/webview-react/src/components/DownloadModal/index.tsx
 * @Description: 
 */
import React from 'react';
import { Modal, Form, Input, Checkbox, Select } from 'antd';
import { usePresenter } from './presenter';
import FormModal from '../FormModal';

interface IProps {
  visible: boolean;
  onClose: () => void;
}

const View: React.FC<IProps> = ({ visible, onClose }) => {
  const presenter = usePresenter({ visible, onClose });
  const { model } = presenter;

  return (
    <Modal
      open={visible}
      title="直接根据git仓库或者npm包创建项目"
      onCancel={() => {
        if (model.processing) {
          return;
        }
        onClose();
      }}
      onOk={() => {
        presenter.downloadScaffold();
      }}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ disabled: model.processing, loading: model.processing }}
    >
      <Form layout="vertical">
        <Form.Item label="仓库类型" required>
          <Select
            placeholder="请选择"
            value={model.formData.type}
            onChange={(value) => {
              model.setFormData((s) => ({
                url: '',
                tag: '',
                type: value,
              }));
            }}
          >
            <Select.Option value="git">git仓库</Select.Option>
            <Select.Option value="npm" disabled>
              npm包
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="项目类型" required>
          <Select
            placeholder="请选择"
            value={model.formData.projectType}
            onChange={(value) => {
              model.setFormData((s) => {
                s.projectType = value
              });
            }}
            options={[
              { label: 'flutter', value: 'flutter' },
              { label: 'vue', value: 'vue' },
              { label: 'react', value: 'react' },
            ]}
          >
          </Select>
        </Form.Item>
        {model.formData.type && (
          <>
            <Form.Item
              label={model.formData.type === 'git' ? '仓库地址' : '包名称'}
              required
            >
              <Input
                placeholder={`输入${model.formData.type === 'git' ? 'git仓库地址' : 'npm包名称'
                  }`}
                value={model.formData.url}
                onChange={(e) => {
                  const { value } = e.target;
                  model.setFormData((s) => {
                    s.url = value
                  });
                }}
              />
            </Form.Item>
            {model.formData.type === 'git' && <Form.Item label='tag'>
              <Input
                placeholder='输入tag'
                value={model.formData.tag}
                onChange={(e) => {
                  const { value } = e.target;
                  model.setFormData((s) => {
                    s.url = value
                  });
                }}
              />
            </Form.Item>}
          </>
        )}
      </Form>
      <FormModal
        visible={model.formModal.visible}
        config={model.formModal.config}
        onClose={(ok) => {
          model.setFormModal((s) => {
            s.visible = false;
          });
          if (ok) {
            onClose();
          }
        }}
      />
    </Modal>
  );
};

export default View;
