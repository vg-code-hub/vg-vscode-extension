/*
 * @Author: zdd
 * @Date: 2023-07-20 15:14:05
 * @LastEditors: zdd dongdong@grizzlychina.com
 * @LastEditTime: 2024-01-25 18:18:13
 * @FilePath: index.tsx
 * @Description:
 */
import { genPagesCode } from '@/common';
import { useModel } from '@umijs/max';
import {
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Menu,
  Modal,
  Radio,
  Space,
  message,
} from 'antd';
import { render as ejsRender } from 'ejs';
import { camelCase, find, snakeCase, upperFirst } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import CodeMirror from '../CodeMirror';
import styles from './index.less';

interface IProps {
  visible: boolean;
  config: any;
  modelList: any;
  pageName: string;
  onClose: (ok?: boolean) => void;
}

const GenPage: React.FC<IProps> = ({
  visible,
  modelList,
  config,
  pageName: _pageName,
  onClose,
}) => {
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [menuWidth, setMenuWidth] = useState(100);
  const [checkAllDisable, setCheckAllDisable] = useState(false);
  const [checkedList, setCheckedList] = useState<any[]>([]);
  const [modelName, setModelName] = useState<string>('');
  const [plainOptions, setPlainOptions] = useState<any[]>([]);
  // 'list' ｜ 'detail' ｜ 'create'
  const [selectPageType, setSelectPageType] = useImmer<string>('');
  const { initialState } = useModel('@@initialState', ({ initialState }) => ({
    initialState,
  }));

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
        },
      ],
    },
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
  }, [initialState?.localMaterials]);

  useEffect(() => {
    setIndeterminate(
      !!checkedList.length && checkedList.length < plainOptions.length,
    );
    setCheckAll(checkedList.length === plainOptions.length);
  }, [checkedList]);

  useEffect(() => {
    if (!config) return;
    let model;
    if (config.methodName.startsWith('get')) {
      let returnType = config.returnType.type;
      if (returnType.startsWith('List'))
        returnType = returnType.substring(5, returnType.length - 1);

      model = find(modelList, { name: returnType });

      if (config.returnType.isPagination || config.returnType.isList) {
        setSelectPageType('list');
      } else {
        setSelectPageType('detail');
      }
      setModelName(returnType);
    } else if (config.methodName.startsWith('create')) {
      model = find(modelList, { name: config.body.type });
      setSelectPageType('create');
      setModelName(config.body.type);
    }
    if (!model) return;

    let { required = [], properties } = model.schema;
    const _checkedList: string[] = [];
    const _options = Object.keys(properties).map((key) => {
      _checkedList.push(key);
      return { label: key, value: key, disabled: required.includes(key) };
    });
    setPlainOptions(_options);
    setCheckedList(_checkedList);
    if (required.length != 0 && required.length === _checkedList.length) {
      setCheckAllDisable(true);
    }
  }, [config]);

  useEffect(() => {
    if (!config || !_pageName) return;
    const paths = _pageName.split('/');
    let names = snakeCase(config.methodName)
      .split('_')
      .filter((v) => !['2', 'v'].includes(v));
    names = [...new Set(names)];

    names.shift();
    if (paths[paths.length - 1] == names[0]) {
      names.shift();
    }
    setPageNameFull(_pageName + '/' + names.join('_'));
  }, [_pageName, config, selectPageType]);

  useEffect(() => {
    const pages = pageNameFull.split('/');
    let menuItem = {};
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
        };
        menuItem = current;
        continue;
      }
      if (!current.children) current.children = [];
      children = current.children;

      if (current && i !== pages.length - 1) {
        current = {
          key,
          label,
        };
        children.push(current);
      } else {
        let snakeCaseName = snakeCase(pages[pages.length - 1]);

        const _key = pages.slice(0, i).join('/');
        if (selectPageType.length === 0) {
          delete current.children;
          continue;
        }
        if (snakeCaseName.endsWith('by_id')) {
          snakeCaseName = snakeCaseName.replace('by_id', selectPageType);
        } else if (!snakeCaseName.includes(selectPageType)) {
          snakeCaseName += '_' + selectPageType;
        }
        current.children = [
          {
            key: `${_key}/controllers`,
            label: 'controllers',
            children: [
              {
                key: `${_key}/controllers/${snakeCaseName}.dart`,
                label: `${snakeCaseName}.dart`,
              },
            ],
          },
          ...(selectPageType === 'list'
            ? [
                {
                  key: `${_key}/widgets`,
                  label: 'widgets',
                  children: [
                    {
                      key: `${_key}/widgets/${snakeCaseName}_item.dart`,
                      label: `${snakeCaseName}_item.dart`,
                    },
                  ],
                },
              ]
            : []),
          {
            key: `${_key}/${snakeCaseName}_page.dart`,
            label: `${snakeCaseName}_page.dart`,
          },
          ,
        ];

        function findCodeTemplate(arr: string[]) {
          let model;
          if (config.methodName.startsWith('get')) {
            let returnType = config.returnType.type;
            if (returnType.startsWith('List'))
              returnType = returnType.substring(5, returnType.length - 1);

            model = find(modelList, { name: returnType });
          } else if (config.methodName.startsWith('create')) {
            model = find(modelList, { name: config.body.type });
          }
          if (!model) return '';
          let { required = [], properties } = model.schema;

          const reqMethod = `${upperFirst(camelCase(_pageName))}Request.${
            config.methodName
          }`;

          return ejsRender(
            find(schema2codeMaterial, { name: arr.join('-') })?.template,
            {
              className: upperFirst(camelCase(snakeCaseName)),
              camelClassName: camelCase(snakeCaseName),
              snakeName: snakeCaseName,
              dataClass: upperFirst(model.name),
              reqMethod,
              pageTitle: config.summary ?? upperFirst(model.name),
              properties: properties
                ? Object.keys(properties)
                    .filter((key) => checkedList.includes(key))
                    .map((key) => {
                      return {
                        key: key,
                        camelKey: camelCase(key),
                        title: properties[key].description,
                        required: required.includes(key),
                      };
                    })
                : [],
            },
          );
        }

        if (schema2codeMaterial) {
          let indexContent = '';

          if (selectPageType === 'create') {
            _codeMap[`${_key}/controllers/${snakeCaseName}.dart`] =
              findCodeTemplate(['dart', 'create', 'controller']);
            _codeMap[`${_key}/${snakeCaseName}_page.dart`] = findCodeTemplate([
              'dart',
              'create',
              'page',
            ]);
            indexContent += `export '${_key}/${snakeCaseName}_page.dart';\n`;
            _selectedKey = `${_key}/${snakeCaseName}_page.dart`;
          } else if (selectPageType === 'detail') {
            _codeMap[`${_key}/${snakeCaseName}_page.dart`] = findCodeTemplate([
              'dart',
              'detail',
              'page',
            ]);
            _codeMap[`${_key}/controllers/${snakeCaseName}.dart`] =
              findCodeTemplate(['dart', 'detail', 'controller']);
            indexContent += `export '${_key}/${snakeCaseName}_page.dart';\n`;
            _selectedKey = `${_key}/${snakeCaseName}_page.dart`;
          } else if (selectPageType === 'list') {
            _codeMap[`${_key}/${snakeCaseName}_page.dart`] = findCodeTemplate([
              'dart',
              'list',
              'page',
            ]);
            _codeMap[`${_key}/widgets/${snakeCaseName}_item.dart`] =
              findCodeTemplate(['dart', 'list', 'item']);
            _codeMap[`${_key}/controllers/${snakeCaseName}.dart`] =
              findCodeTemplate(['dart', 'list', 'controller']);
            indexContent += `export '${_key}/${snakeCaseName}_page.dart';\n`;
            _selectedKey = `${_key}/${snakeCaseName}_page.dart`;
          }
          _codeMap['index.dart'] = indexContent;
        }
      }
    }

    if (pages.length > 0) {
      setSelectedKey(_selectedKey);
      setFileItems((s) => {
        s[0].children[0] = menuItem;
      });
    }
    setCodeMap(_codeMap);
  }, [pageNameFull, selectPageType, checkedList]);

  useEffect(() => {
    const keys = selectedKey.split('/');
    const _openKeys: string[] = [];
    keys.forEach((_, i) => {
      _openKeys.push(keys.slice(0, i + 1).join('/'));
    });

    setOpenKeys(['pages', ..._openKeys]);

    if (keys.length > 1) {
      const pages = pageNameFull.split('/');
      const snakeCaseName = snakeCase(pages[pages.length - 1]);
      const width =
        keys.length * 8 +
        `${snakeCaseName}_create${
          keys.includes('controllers') || keys.includes('widgets')
            ? ''
            : '_page'
        }.dart`.length *
          9;
      setMenuWidth(width);
    }
  }, [selectedKey]);

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
      {config && (
        <>
          <Form
            fields={[
              { name: 'pageName', value: pageNameFull },
              { name: 'type', value: 'dart' },
            ]}
            layout={'inline'}
          >
            <Form.Item label="项目类别" name="type">
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
          </Form>
          <Space
            direction="horizontal"
            align="start"
            style={{
              width: '100%',
              marginTop: '20px',
              height: 'calc(100% - 130px)',
            }}
            classNames={{ item: styles['space-item'] }}
            size={16}
          >
            <Card size="small" title={`表名:${modelName}`}>
              <Checkbox
                disabled={checkAllDisable}
                indeterminate={indeterminate}
                onChange={(e) => {
                  setCheckedList(
                    e.target.checked
                      ? plainOptions.map((item) => item.label)
                      : [],
                  );
                }}
                checked={checkAll}
              >
                全选所有字段
              </Checkbox>
              <Divider style={{ margin: '8px 0' }} />
              <Checkbox.Group
                className={styles['checkbox-group']}
                style={{ display: 'flex', flexDirection: 'column' }}
                options={plainOptions}
                value={checkedList}
                onChange={setCheckedList}
              />
            </Card>
            <Card size="small" title="导出文件清单">
              <Menu
                onSelect={(e) => {
                  setSelectedKey(e.key as string);
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
            <Card size="small" title="文件预览">
              <CodeMirror
                domId="templateCodeMirror"
                height="100%"
                value={codeMap[selectedKey]}
              />
            </Card>
          </Space>
        </>
      )}
    </Modal>
  );
};

export default GenPage;
