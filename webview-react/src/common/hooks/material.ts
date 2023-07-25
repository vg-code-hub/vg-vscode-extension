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
import { find } from 'lodash';

export const useMaterial = () => {
  const [count, setCount] = useImmer<
    {
      snippets: number;
      blocks: number;
      schema2code: number;
    }
  >({
    snippets: 0,
    blocks: 0,
    schema2code: 0,
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

  const [schema2codeMaterial, setSchema2codeMaterial] = useImmer<any[]>([]);


  function configSchema2code(schema2code: any[]) {
    const titles = ['dart/create', 'dart/detail', 'dart/refresh-list'];
    const _schema2code: any[] = []
    function findCodeTemplate(arr: string[]) {
      let children = schema2code
      for (let i = 0; i < arr.length; i++) {
        const name = arr[i];
        if (!children) return '';
        if (i !== arr.length - 1) {
          children = find(children, { name })?.children;
        } else {
          return find(children, { name })?.template
        }
      }
    }
    titles.forEach((title) => {
      _schema2code.push({
        type: title.split('/')[0],
        title: title.split('/')[1] + '_page',
        template: findCodeTemplate([...title.split('/'), 'page']),
      }, {
        type: title.split('/')[0],
        title: title.split('/')[1] + '_controller',
        template: findCodeTemplate([...title.split('/'), 'controller']),
      })
    })
    _schema2code.push({
      type: 'dart',
      title: 'refresh-list_item',
      template: findCodeTemplate(['dart', 'refresh-list', 'item']),
    })

    setCount(s => {
      s.schema2code = _schema2code.length
    })

    setSchema2codeMaterial(_schema2code)
  }

  const handleSearch = async ({ type, ...params }: any) => {
    const data = await getLocalMaterials();
    const filter = (item: any) => {
      return item?.preview?.title
    }

    setCount(s => {
      s.snippets = data.snippets.filter(filter).length
      s.blocks = data.blocks.filter(filter).length
    })

    configSchema2code(data.schema2code)

    return {
      data: data[type as 'blocks' | 'snippets'].filter(filter),
      success: true,
    }
  }

  return {
    count,
    materials,
    setMaterials,
    handleSearch,
    schema2codeMaterial
  }
};