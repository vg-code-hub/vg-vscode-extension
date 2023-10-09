/*
 * @Author: jimmyZhao
 * @Date: 2023-07-28 10:27:12
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-07 14:08:47
 * @FilePath: /vg-vscode-extension/webview-react/src/models/useMaterial.ts
 * @Description:
 */
import { IGetLocalMaterialsResult, IMaterialType } from '@/common';
import { ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

export default function Page() {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState', ({ initialState }) => ({
    initialState,
  }));
  const [count, setCount] = useImmer({
    snippets: 0,
    blocks: 0,
    schema2code: 0,
  });
  const [dataList, setDataList] = useState<IGetLocalMaterialsResult[]>([]);
  const [activeKey, setActiveKey] = useImmer<IMaterialType>('snippets');
  const [materialLocalKeys, setMaterialLocalKeys] = useState<string[]>([]);

  useEffect(() => {
    if (initialState?.localMaterials) {
      setCount((s) => {
        s.snippets = initialState.localMaterials.snippets.length;
        s.blocks = initialState.localMaterials.blocks.length;
        s.schema2code = initialState.localMaterials.schema2code.length;
      });
    }
  }, [initialState?.localMaterials]);

  useEffect(() => {
    if (initialState?.localMaterials) {
      setDataList(initialState.localMaterials[activeKey]);
    }
    setMaterialLocalKeys(initialState?.materialLocalKey ?? []);
  }, [initialState?.localMaterials, activeKey]);

  return {
    materialLocalKeys,
    activeKey,
    setActiveKey,
    dataList,
    count,
    actionRef,
  };
}
