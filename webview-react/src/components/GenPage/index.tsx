/*
 * @Author: zdd
 * @Date: 2023-07-20 15:14:05
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-21 17:54:58
 * @FilePath: /vg-vscode-extension/webview-react/src/components/GenPage/index.tsx
 * @Description: 
 */
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Checkbox, Card, Space, Divider, Menu, Radio, Select, message } from 'antd';
import CodeMirror from '../CodeMirror';

import styles from "./index.less";
import { camelCase, find, snakeCase, upperFirst } from 'lodash';
import { render as ejsRender } from 'ejs';
import { useImmer } from 'use-immer';
import { useMount } from 'ahooks';
import { getLocalMaterials, genPagesCode } from '@/common';

interface IProps {
  visible: boolean;
  config: any;
  pageName: string;
  onClose: (ok?: boolean) => void;
}


const GenPage: React.FC<IProps> = ({ visible, config, pageName: _pageName, onClose }) => {
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [checkAllDisable, setCheckAllDisable] = useState(false);
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [plainOptions, setPlainOptions] = useState<any[]>([]);
  const [selectPages, setSelectPages] = useImmer<string[]>(['list', 'detail', 'create']);


  const [fileItems, setFileItems] = useImmer<any[]>([
    {
      key: 'pages',
      label: 'pages',
      children: [
        {
          key: 'pages-name',
          label: 'pages-name',
        },
        {
          key: 'index.dart',
          label: 'index.dart',
        }
      ],
    }
  ]);
  const [pageNameFull, setPageNameFull] = useState('');
  const [openKeys, setOpenKeys] = useImmer<string[]>([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [schema2codeMaterial, setSchema2codeMaterial] = useState<any[]>([]);
  const [codeMap, setCodeMap] = useImmer<Record<string, string>>({});


  useMount(async () => {
    const { schema2code } = await getLocalMaterials();
    setSchema2codeMaterial(schema2code);
  })


  useEffect(() => {
    setIndeterminate(!!checkedList.length && checkedList.length < plainOptions.length);
    setCheckAll(checkedList.length === plainOptions.length);
  }, [checkedList])

  useEffect(() => {
    if (config) {
      let { required = [], properties } = config.value;
      const _checkedList: string[] = [];
      const _options = Object.keys(properties).map((key) => {
        if (required.includes(key)) _checkedList.push(key);
        return { label: key, value: key, disabled: required.includes(key) };
      });
      setPlainOptions(_options);
      setCheckedList(_checkedList)
      if (required.length != 0 && required.length === _checkedList.length) {
        setCheckAllDisable(true);
      }
    }
  }, [config])

  useEffect(() => {
    if (_pageName) {
      setPageNameFull(_pageName)
    }
  }, [_pageName])

  useEffect(() => {
    const pages = pageNameFull.startsWith('entitys/') ? pageNameFull.substring(8).split('/') : pageNameFull.split('/');
    const snakeCaseName = snakeCase(pages[pages.length - 1]);
    let menuItem = {}
    let current: any = {};
    let _codeMap: any = {};
    let children: any[] = [];

    for (let i = 0; i < pages.length; i++) {
      const label = pages[i];
      const key = pages.slice(0, i + 1).join('/');

      if (i == 0) {
        current = {
          key,
          label,
        }
        menuItem = current;
        continue;
      }
      if (!current.children) current.children = [];
      children = current.children

      if (current && i !== pages.length - 1) {
        current = {
          key,
          label,
        }
        children.push(current)
      } else {
        const _key = pages.slice(0, i).join('/');
        if (selectPages.length === 0) {
          delete current.children;
          continue;
        }
        current.children = [
          {
            key: `${_key}/controllers`,
            label: 'controllers',
            children: selectPages.map(p => ({
              key: `${_key}/controllers/${snakeCaseName}_${p}.dart`,
              label: `${snakeCaseName}_${p}.dart`,
            }))
          },
          ...selectPages.includes('list') ? [
            {
              key: `${_key}/widgets`,
              label: 'widgets',
              children: [
                {
                  key: `${_key}/widgets/${snakeCaseName}_item.dart`,
                  label: `${snakeCaseName}_item.dart`,
                },
              ]
            },
          ] : [],
          ...selectPages.map(p => ({
            key: `${_key}/${snakeCaseName}_${p}_page.dart`,
            label: `${snakeCaseName}_${p}_page.dart`,
          })),
        ]

        function findCodeTemplate(arr: string[]) {
          let children = schema2codeMaterial
          for (let i = 0; i < arr.length; i++) {
            const name = arr[i];
            if (!children) return '';
            if (i !== arr.length - 1) {
              children = find(children, { name })?.children;
            } else {
              let { required = [], properties } = config.value;

              return ejsRender(find(children, { name })?.template, {
                className: upperFirst(camelCase(snakeCaseName)),
                camelClassName: camelCase(snakeCaseName),
                snakeName: snakeCaseName,
                dataClass: upperFirst(config.key),
                properties: properties ? Object.keys(properties).map((key) => {
                  return { key: key, title: properties[key].title, required: required.includes(key) };
                }) : []
              });
            }
          }
        }
        if (schema2codeMaterial) {
          _codeMap[`${_key}/${snakeCaseName}_create_page.dart`] = findCodeTemplate(['dart', 'create', 'page'])
          _codeMap[`${_key}/${snakeCaseName}_detail_page.dart`] = findCodeTemplate(['dart', 'detail', 'page'])
          _codeMap[`${_key}/${snakeCaseName}_list_page.dart`] = findCodeTemplate(['dart', 'refresh-list', 'page'])
          _codeMap[`${_key}/widgets/${snakeCaseName}_item.dart`] = findCodeTemplate(['dart', 'refresh-list', 'item'])

          _codeMap[`${_key}/controllers/${snakeCaseName}_create.dart`] = findCodeTemplate(['dart', 'create', 'controller'])
          _codeMap[`${_key}/controllers/${snakeCaseName}_detail.dart`] = findCodeTemplate(['dart', 'detail', 'controller'])
          _codeMap[`${_key}/controllers/${snakeCaseName}_list.dart`] = findCodeTemplate(['dart', 'refresh-list', 'controller'])
        }
        _codeMap['index.dart'] = `export '${_key}/${snakeCaseName}_create_page.dart';\nexport '${_key}/${snakeCaseName}_detail_page.dart';\nexport '${_key}/${snakeCaseName}_list_page.dart';\n`
      }
    }
    if (pages.length > 0) {
      var _selectedKey = [...pages.slice(0, pages.length - 1), snakeCaseName].join('/') + '_list_page.dart';
      setSelectedKey(_selectedKey);
      setFileItems(s => {
        s[0].children[0] = menuItem
      })
    }

    setCodeMap(_codeMap)
  }, [pageNameFull, selectPages])

  useEffect(() => {
    const keys = selectedKey.split('/');
    const _openKeys: string[] = []
    keys.forEach((_, i) => {
      _openKeys.push(keys.slice(0, i + 1).join('/'));
    })

    setOpenKeys(['pages', ..._openKeys]);
  }, [selectedKey])


  return (
    <Modal
      title="schema2code"
      width={'calc(100% - 80px)'}
      open={visible}
      onCancel={() => {
        onClose();
      }}
      onOk={async () => {
        await genPagesCode(codeMap);
        onClose();
        message.success('生成成功');
      }}
      cancelText="取消"
      okText="确定"
      className={styles['gen-page-modal']}
    >
      {config &&
        <>
          <Form
            fields={[
              { name: 'pageName', value: pageNameFull },
              { name: 'type', value: 'dart' },
              { name: 'pages', value: selectPages },
            ]}
            layout={'inline'}
          >
            <Form.Item label="项目类别" name="type" >
              <Radio.Group value={'dart'} disabled={true} optionType="default">
                <Radio.Button value="dart">dart</Radio.Button>
                <Radio.Button value="typescript">typescript</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="页面名"
              name="pageName"
              tooltip="默认pages下，支持'/'分割"
              rules={[{ required: true }]}
            >
              <Input
                onBlur={({ target }) => {
                  setPageNameFull(target.value);
                }}
              />
            </Form.Item>
            <Form.Item
              name="pages"
              label="要生成页面"
              rules={[{ required: true, type: 'array' }]}
            >
              <Select
                onChange={(value) => {
                  setSelectPages(value)
                }}
                mode="multiple" style={{ minWidth: 160 }} placeholder="请选择">
                <Select.Option disabled={true} value="list">list</Select.Option>
                <Select.Option value="create">create</Select.Option>
                <Select.Option value="detail">detail</Select.Option>
              </Select>
            </Form.Item>
          </Form>
          <Space direction="horizontal" align="start" style={{ width: '100%', marginTop: '36px' }} classNames={{ item: styles['space-item'] }} size={16}>
            <Card size='small' title={`表名:${config.key}`} style={{ width: '100%' }}>
              <Checkbox disabled={checkAllDisable} indeterminate={indeterminate} onChange={(e) => {
                setCheckedList(e.target.checked ? plainOptions.map((item) => item.label) : []);
              }} checked={checkAll}>
                全选所有字段
              </Checkbox>
              <Divider style={{ margin: '8px 0' }} />
              <Checkbox.Group className={styles['checkbox-group']} style={{ display: 'flex', flexDirection: 'column' }} options={plainOptions} value={checkedList} onChange={setCheckedList} />
            </Card>
            <Card size='small' title="导出文件清单" style={{ width: '100%' }}>
              <Menu
                onSelect={(e) => {
                  setSelectedKey(e.key as string)
                }}
                style={{ width: 256 }}
                openKeys={openKeys}
                selectedKeys={[selectedKey]}
                onOpenChange={setOpenKeys}
                items={fileItems}
                mode="inline"
              />
            </Card>
            <Card size='small' title="文件预览" style={{ width: '100%' }}>
              <CodeMirror domId='templateCodeMirror' height='60vh' value={codeMap[selectedKey]} />
            </Card>
          </Space>
        </>}
    </Modal>
  );
};

export default GenPage;
