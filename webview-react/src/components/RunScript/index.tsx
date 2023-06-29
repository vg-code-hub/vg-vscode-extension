/*
 * @Author: zdd
 * @Date: 2023-06-29 16:07:05
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-29 16:07:26
 * @FilePath: /vg-vscode-extension/webview-react/src/components/RunScript/index.tsx
 * @Description: 
 */
import { runScript } from '@/common';
import { Form, Input, Modal, Select } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';

interface IProps {
  visible: boolean;
  materialPath: string;
  model: object;
  scripts?: [{ method: string; remark: string }];
  onCancel: () => void;
  onOk: (model: object) => void;
}

const RunScript: React.FC<IProps> = (props) => {
  const [script, setScript] = useImmer('');
  const [params, setParams] = useImmer('');
  const [loading, setLoading] = useImmer(false);

  useEffect(() => {
    if (props.visible) {
      setScript('');
      setParams('');
      setLoading(false);
    }
  }, [props.visible]);

  const handleOk = () => {
    setLoading(true);
    runScript({
      script,
      params,
      model: props.model,
      materialPath: props.materialPath,
    })
      .then((result) => {
        props.onOk(result);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title="执行脚本"
      visible={props.visible}
      okButtonProps={{ loading, disabled: !script }}
      maskClosable={false}
      onCancel={props.onCancel}
      onOk={handleOk}
    >
      <Form layout="vertical">
        <Form.Item label="方法">
          <Select
            mode="tags"
            placeholder="请输入或选择"
            value={script ? [script] : undefined}
            onChange={(value) => {
              setScript(value && value.length ? value[value.length - 1] : '');
            }}
            notFoundContent={null}
          >
            {props.scripts?.map((item) => (
              <Select.Option value={item.method} key={item.method}>
                {`${item.method}${item.remark ? `（${item.remark}）` : ''}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="参数">
          <Input.TextArea
            value={params}
            onChange={(e) => {
              const value = e.target.value;
              setParams(value);
            }}
          ></Input.TextArea>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RunScript;
