/*
 * @Author: zdd
 * @Date: 2023-07-04 16:34:35
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 16:36:53
 * @FilePath: /vg-vscode-extension/webview-react/src/components/DownloadModal/model.ts
 * @Description: 
 */
import { useImmer } from "use-immer";

export const useModel = () => {
  const [formData, setFormData] = useImmer<{
    type: 'git' | 'npm';
    url: string;
    tag?: string;
  }>({
    type: 'git',
    url: ''
  });

  const [processing, setProcessing] = useImmer(false);
  const [formModal, setFormModal] = useImmer<{ visible: boolean; config: any }>(
    {
      visible: false,
      config: {},
    },
  );

  return {
    formData,
    setFormData,
    processing,
    setProcessing,
    formModal,
    setFormModal,
  };
};

export type Model = ReturnType<typeof useModel>;
