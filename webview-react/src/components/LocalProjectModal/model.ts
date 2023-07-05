/*
 * @Author: zdd
 * @Date: 2023-07-04 16:34:35
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 16:36:05
 * @FilePath: /vg-vscode-extension/webview-react/src/components/LocalProjectModal/model.ts
 * @Description: 
 */
import { useImmer } from 'use-immer';


export const useModel = () => {
  const [processing, setProcessing] = useImmer(false);

  const [formModal, setFormModal] = useImmer<{ visible: boolean; config: any }>(
    {
      visible: false,
      config: {},
    },
  );

  const [openFolder, setOpenFolder] = useImmer('');

  return {
    processing,
    setProcessing,
    formModal,
    setFormModal,
    openFolder,
    setOpenFolder,
  };
};

export type Model = ReturnType<typeof useModel>;
