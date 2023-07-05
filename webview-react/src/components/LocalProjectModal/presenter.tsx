/*
 * @Author: zdd
 * @Date: 2023-07-04 16:34:35
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 16:36:18
 * @FilePath: /vg-vscode-extension/webview-react/src/components/LocalProjectModal/presenter.tsx
 * @Description: 
 */
import { selectDirectory, useLocalScaffold } from '@/common';
import { useModel } from './model';

export const usePresenter = () => {
  const model = useModel();

  const selectDirectoryByVsCode = () => {
    selectDirectory().then((res) => {
      model.setOpenFolder(res);
    });
  };

  const copyLocalScaffold = () => {
    model.setProcessing(true);
    useLocalScaffold({ localPath: model.openFolder })
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
    selectDirectoryByVsCode,
    copyLocalScaffold,
  };
};
