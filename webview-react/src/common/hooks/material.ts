/*
 * @Author: zdd
 * @Date: 2023-06-28 17:32:53
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 18:28:13
 * @FilePath: /vg-vscode-extension/webview-react/src/common/hooks/material.ts
 * @Description: 
 */
import { useImmer } from 'use-immer';
import { getLocalMaterials } from '..';

export const useMaterial = () => {
  const [count, setCount] = useImmer<
    {
      snippets: number;
      blocks: number;
    }
  >({
    snippets: 0,
    blocks: 0,
  });
  const [materials, setMaterials] = useImmer<
    {
      path: string;
      name: string;
      model: object;
      schema: object;
      preview: {
        title?: string;
        description?: string;
        img?: string[];
        category?: string[];
      };
      template: string;
    }[]
  >([]);

  const handleSearch = async ({ type, ...params }: any) => {
    const data = await getLocalMaterials();
    const filter = (item: any) => {
      return item?.preview?.title
    }

    setCount({
      snippets: data.snippets.filter(filter).length,
      blocks: data.blocks.filter(filter).length,
    })

    return {
      data: data[type as 'blocks' | 'snippets'].filter(filter),
      success: true,
    }
  }

  return {
    count,
    materials,
    setMaterials,
    handleSearch
  }
};