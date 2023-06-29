/*
 * @Author: zdd
 * @Date: 2023-06-28 17:32:53
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-28 18:26:58
 * @FilePath: /vg-vscode-extension/webview-react/src/common/hooks/snippets.ts
 * @Description: 
 */
import { useImmer } from 'use-immer';
import { useDebounceFn, useMount } from 'ahooks';
import { getLocalMaterials } from '..';

export const useSnippets = () => {
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

  const handleSearch = async (params: any) => {
    console.log({ params });
    const data = await getLocalMaterials('snippets');
    console.log(data);
    return {
      data,
      success: true,
    }
  }

  return {
    materials,
    setMaterials,
    handleSearch
  }
};