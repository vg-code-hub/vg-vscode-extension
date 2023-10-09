/*
 * @Author: zdd
 * @Date: 2023-07-20 15:14:05
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-09 10:26:25
 * @FilePath: /vg-vscode-extension/webview-react/src/components/GenPage/index.tsx
 * @Description: 
 */
import React, { useEffect, useState } from 'react';
import { camelCase, find, snakeCase, upperFirst } from 'lodash';
import { render as ejsRender } from 'ejs';
import { useModel } from '@umijs/max';
import { useImmer } from 'use-immer';
import { Modal, Form, Input, Checkbox, Card, Space, Divider, Menu, Radio, message } from 'antd';
import { genPagesCode } from '@/common';
import CodeMirror from '../CodeMirror';
import styles from "./index.less";

interface IProps {
  visible: boolean;
  config: any;
  modelList: any;
  pageName: string;
  onClose: (ok?: boolean) => void;
}


const GenPage: React.FC<IProps> = ({ visible, modelList, config, pageName: _pageName, onClose }) => {
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [menuWidth, setMenuWidth] = useState(100);
  const [checkAllDisable, setCheckAllDisable] = useState(false);
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [modelName, setModelName] = useState<string>('');
  const [plainOptions, setPlainOptions] = useState<any[]>([]);
  const [selectPages, setSelectPages] = useImmer<string[]>(['list', 'detail', 'create']);
  const { initialState } = useModel('@@initialState', ({ initialState }) => ({ initialState }));

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

  useEffect(() => {
    if (initialState?.localMaterials) {
      setSchema2codeMaterial(initialState?.localMaterials.schema2code);
    }
  }, [initialState?.localMaterials])

  useEffect(() => {
    setIndeterminate(!!checkedList.length && checkedList.length < plainOptions.length);
    setCheckAll(checkedList.length === plainOptions.length);
  }, [checkedList])

  useEffect(() => {
    if (!config) return;
    let model;
    if (config.methodName.startsWith('get')) {
      model = find(modelList, { name: config.returnType.type });
      if (config.returnType.isPagination || config.returnType.isList) {
        setSelectPages(['list'])
      } else {
        setSelectPages(['detail'])
      }
      setModelName(config.returnType.type)
    } else if (config.methodName.startsWith('create')) {
      model = find(modelList, { name: config.body.type });
      setSelectPages(['create'])
      setModelName(config.body.type)
    }
    if (!model) return;

    let { required = [], properties } = model.schema;
    const _checkedList: string[] = [];
    const _options = Object.keys(properties).map((key) => {
      _checkedList.push(key);
      return { label: key, value: key, disabled: required.includes(key) };
    });
    setPlainOptions(_options);
    setCheckedList(_checkedList)
    if (required.length != 0 && required.length === _checkedList.length) {
      setCheckAllDisable(true);
    }
  }, [config])

  useEffect(() => {
    if (!config || !_pageName) return;
    const paths = _pageName.split('/')
    const names = snakeCase(config.methodName).split('_')
    names.shift();
    if (paths[paths.length - 1] == names[0]) {
      names.shift();
    }
    setPageNameFull(_pageName + '/' + names.join('_'))
  }, [_pageName, config, selectPages])

  useEffect(() => {
    const pages = pageNameFull.split('/');
    const snakeCaseName = snakeCase(pages[pages.length - 1]);
    let menuItem = {}
    let current: any = {};
    let _codeMap: any = {};
    let children: any[] = [];
    let _selectedKey = '';
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

          let model;
          if (config.methodName.startsWith('get')) {
            model = find(modelList, { name: config.returnType.type });
          } else if (config.methodName.startsWith('create')) {
            model = find(modelList, { name: config.body.type });
          }
          if (!model) return '';
          let { required = [], properties } = model.schema;

          return ejsRender(find(schema2codeMaterial, { name: arr.join('-') })?.template, {
            className: upperFirst(camelCase(snakeCaseName)),
            camelClassName: camelCase(snakeCaseName),
            snakeName: snakeCaseName,
            dataClass: upperFirst(config.key),
            properties: properties ? Object.keys(properties).map((key) => {
              return { key: key, title: properties[key].title, required: required.includes(key) };
            }) : []
          });
        }

        if (schema2codeMaterial) {
          let indexContent = '';
          if (selectPages.includes('create')) {
            _codeMap[`${_key}/controllers/${snakeCaseName}_create.dart`] = findCodeTemplate(['dart', 'create', 'controller'])
            _codeMap[`${_key}/${snakeCaseName}_create_page.dart`] = findCodeTemplate(['dart', 'create', 'page'])
            indexContent += `export '${_key}/${snakeCaseName}_create_page.dart';\n`;
            _selectedKey = `${_key}/${snakeCaseName}_create_page.dart`;
          }
          if (selectPages.includes('detail')) {
            _codeMap[`${_key}/${snakeCaseName}_detail_page.dart`] = findCodeTemplate(['dart', 'detail', 'page'])
            _codeMap[`${_key}/controllers/${snakeCaseName}_detail.dart`] = findCodeTemplate(['dart', 'detail', 'controller'])
            indexContent += `export '${_key}/${snakeCaseName}_detail_page.dart';\n`;
            _selectedKey = `${_key}/${snakeCaseName}_detail_page.dart`;
          }
          if (selectPages.includes('list')) {
            _codeMap[`${_key}/${snakeCaseName}_list_page.dart`] = findCodeTemplate(['dart', 'list', 'page'])
            _codeMap[`${_key}/widgets/${snakeCaseName}_item.dart`] = findCodeTemplate(['dart', 'list', 'item'])
            _codeMap[`${_key}/controllers/${snakeCaseName}_list.dart`] = findCodeTemplate(['dart', 'list', 'controller'])
            indexContent += `export '${_key}/${snakeCaseName}_list_page.dart';\n`;
            _selectedKey = `${_key}/${snakeCaseName}_list_page.dart`;
          }
          _codeMap['index.dart'] = indexContent;
        }
      }
    }

    if (pages.length > 0) {
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

    if (keys.length > 1) {
      const pages = pageNameFull.split('/');
      const snakeCaseName = snakeCase(pages[pages.length - 1]);
      const width = (keys.length) * 8 + `${snakeCaseName}_create${keys.includes('controllers') || keys.includes('widgets') ? '' : '_page'}.dart`.length * 9;
      setMenuWidth(width)
    }
  }, [selectedKey])


  return (
    <Modal
      title="schema2code"
      width={'calc(100vw - 80px)'}
      style={{}}
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
            {/* <Form.Item
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
            </Form.Item> */}
          </Form>
          <Space direction="horizontal" align="start" style={{ width: '100%', marginTop: '20px', height: 'calc(100% - 130px)' }} classNames={{ item: styles['space-item'] }} size={16}>
            <Card size='small' title={`表名:${modelName}`}>
              <Checkbox disabled={checkAllDisable} indeterminate={indeterminate} onChange={(e) => {
                setCheckedList(e.target.checked ? plainOptions.map((item) => item.label) : []);
              }} checked={checkAll}>
                全选所有字段
              </Checkbox>
              <Divider style={{ margin: '8px 0' }} />
              <Checkbox.Group className={styles['checkbox-group']} style={{ display: 'flex', flexDirection: 'column' }} options={plainOptions} value={checkedList} onChange={setCheckedList} />
            </Card>
            <Card size='small' title="导出文件清单">
              <Menu
                onSelect={(e) => {
                  setSelectedKey(e.key as string)
                }}
                style={{ width: menuWidth }}
                openKeys={openKeys}
                selectedKeys={[selectedKey]}
                onOpenChange={setOpenKeys}
                items={fileItems}
                inlineIndent={8}
                mode="inline"
              />
            </Card>
            <Card size='small' title="文件预览">
              <CodeMirror domId='templateCodeMirror' height='100%' value={codeMap[selectedKey]} />
            </Card>
          </Space>
        </>}
    </Modal>
  );
};

export default GenPage;
