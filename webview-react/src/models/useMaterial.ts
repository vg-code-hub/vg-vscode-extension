import { IGetLocalMaterialsResult, IMaterialType } from '@/common';
import { ActionType } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';

export default function Page() {
  const actionRef = useRef<ActionType>();
  const { initialState } = useModel('@@initialState', ({ initialState }) => ({ initialState }));
  const [count, setCount] = useImmer({
    snippets: 0,
    blocks: 0,
    schema2code: 0,
  });
  const [dataList, setDataList] = useState<IGetLocalMaterialsResult[]>([]);
  const [activeKey, setActiveKey] = useImmer<IMaterialType>('snippets');

  useEffect(() => {
    if (initialState?.localMaterials) {
      setCount(s => {
        s.snippets = initialState.localMaterials.snippets.length
        s.blocks = initialState.localMaterials.blocks.length
        s.schema2code = initialState.localMaterials.schema2code.length
      })
    }
  }, [initialState?.localMaterials])

  useEffect(() => {
    if (initialState?.localMaterials) {
      setDataList(initialState.localMaterials[activeKey])
    }
  }, [initialState?.localMaterials, activeKey])

  return {
    activeKey,
    setActiveKey,
    dataList,
    count,
    actionRef
  }
}