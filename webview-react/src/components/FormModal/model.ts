/*
 * @Author: zdd
 * @Date: 2023-07-04 16:34:35
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 16:35:10
 * @FilePath: /vg-vscode-extension/webview-react/src/components/FormModal/model.ts
 * @Description: 
 */
import { useImmer } from 'use-immer';

export const defaultConfig = {
  projectName: '',
  createDir: '',
  immediateOpen: true,
};

export const useModel = () => {
  const [formData, setFormData] = useImmer<any>({});

  const [config, setConfig] = useImmer<{
    projectName: string;
    createDir: string;
    immediateOpen: boolean;
  }>(defaultConfig);

  return {
    formData,
    setFormData,
    config,
    setConfig,
  };
};

export type Model = ReturnType<typeof useModel>;
