/*
 * @Author: zdd
 * @Date: 2023-07-04 16:34:35
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 17:53:40
 * @FilePath: /vg-vscode-extension/webview-react/src/components/FormModal/index.tsx
 * @Description: 
 */
import React from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';
import FormRender from 'form-render';
import { usePresenter } from './presenter';
import { IScaffoldResponse } from '@/common';

interface IProps {
  visible: boolean;
  config: {
    formSchema?: { schema?: object; formData?: object;[key: string]: any };
  } & IScaffoldResponse['scaffolds'][0];
  onClose: (ok?: boolean) => void;
}

const View: React.FC<IProps> = ({ visible, config, onClose }) => {
  const presenter = usePresenter({ visible, config, onClose });
  const { model } = presenter;

  return (
    <Modal
      title="创建项目"
      open={visible}
      onCancel={() => {
        onClose();
      }}
      onOk={() => {
        presenter.createProjectByVsCode();
        onClose();
      }}
      cancelText="取消"
      okText="确定"
    >
      {config.formSchema && (
        <FormRender
          form={presenter.form}
          schema={config.formSchema?.schema || {}}
          displayType="column"
          labelWidth={config.formSchema?.labelWidth}
          watch={presenter.watch}
        />
      )}
      <Form layout="vertical">
        <Form.Item label="项目名称" required>
          <Input
            value={model.config.projectName}
            onChange={(e) => {
              const { value } = e.target;
              model.setConfig((s) => {
                s.projectName = value;
              });
            }}
          />
        </Form.Item>
        <Form.Item label="生成目录" required>
          <Input
            value={model.config.createDir}
            readOnly
            onClick={() => {
              presenter.selectDirectoryByVsCode();
            }}
          />
        </Form.Item>
        <Form.Item label="创建后立即打开">
          <Checkbox
            checked={model.config.immediateOpen}
            onChange={(e) => {
              const { checked } = e.target;
              model.setConfig((s) => {
                s.immediateOpen = checked;
              });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default View;
