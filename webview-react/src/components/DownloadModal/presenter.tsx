/*
 * @Author: zdd
 * @Date: 2023-07-04 16:34:35
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 16:37:01
 * @FilePath: /vg-vscode-extension/webview-react/src/components/DownloadModal/presenter.tsx
 * @Description: 
 */
import React, { useEffect } from 'react';
import { message } from 'antd';
import Service from './service';
import { downloadScaffoldByVsCode } from '@/common';
import { useModel } from './model';

export const usePresenter = (props: {
  visible: boolean;
  onClose: () => void;
}) => {
  const model = useModel();
  const service = new Service(model);

  useEffect(() => {
    if (props.visible) {
      model.setFormData({} as any);
    }
  }, [props.visible]);

  const downloadScaffold = () => {
    if (!model.formData.type || !model.formData.url) {
      message.error('请完善信息');
      return;
    }
    model.setProcessing(true);
    downloadScaffoldByVsCode({
      type: model.formData.type,
      repository: model.formData.url,
    })
      .then((res) => {
        model.setFormModal((s) => {
          s.config = res;
          s.visible = true;
        });
      })
      .finally(() => {
        model.setProcessing(false);
      });
  };

  return {
    model,
    service,
    downloadScaffold,
  };
};
