/*
 * @Author: zdd
 * @Date: 2023-06-27 22:07:27
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-19 19:58:06
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/materials/index.tsx
 * @Description: 
 */

import { useImmer } from 'use-immer';
import { useEffect } from 'react';
import { history, KeepAlive, useModel } from '@umijs/max';
import { ProColumns, ProList } from '@ant-design/pro-components';
import { Badge, Button, Card, Descriptions, Popconfirm, Space, Tag, message } from 'antd';
import { IDownloadMaterialsResult, IGetLocalMaterialsResult, deleteMaterialTemplate, insertSnippet, refreshIntelliSense } from '@/common';
import DownloadMaterials from '@/components/DownloadMaterials';
import JsonToTs from '@/components/JsonToTs';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';


const metasDefault: ProColumns<IGetLocalMaterialsResult> = {
  title: {
    dataIndex: ['name']
  },
  content: {
    dataIndex: ['preview', 'description'],
    render: (text: string) => {
      return (
        <Space size={0}>{text ?? ''}</Space>
      );
    },
  },
  subTitle: {
    search: false,
    dataIndex: ['preview', 'description'],
    render: (text: string, row: IGetLocalMaterialsResult, index: number, ...rests: any) => {
      return (
        <Space size={0}>
          <Tag color="blue">{row.preview?.schema ?? 'form-render'}</Tag>
        </Space>
      );
    },
  },
  actions: {}
}

const renderBadge = (count: number, active = false) => {
  return (
    <Badge
      count={count}
      style={{
        marginBlockStart: -2,
        marginInlineStart: 4,
        color: active ? '#1890FF' : '#999',
        backgroundColor: active ? '#E6F7FF' : '#eee',
      }}
    />
  );
};

const MaterialsPage: React.FC = () => {
  const { dataList, count, activeKey, setActiveKey } = useModel('useMaterial');
  const { loading, refresh } = useModel('@@initialState', ({ loading, refresh }) => ({ loading, refresh }));
  const [downloadMaterialsVisible, setDownloadMaterialsVisible] = useImmer(false);
  const [metas, setMetas] = useImmer<any>(metasDefault);
  const [jsonToTsModalVisble, setJsonToTsModalVisble] = useImmer(false);

  function onDetailClick(row: IGetLocalMaterialsResult) {
    if (activeKey === 'schema2code') {
      onEditClick(row);
      return
    }
    history.push(`/material-detail/${row.name}`, row);
  }

  function onEditClick(row: IGetLocalMaterialsResult) {
    history.push(`/material-create`, { record: row, type: activeKey });
  }

  const handleDownloadMaterialsOk = (materials: IDownloadMaterialsResult) => {
    if (materials.blocks.length === 0 && materials.snippets.length === 0) {
      message.warning('未设置物料');
    }
    setDownloadMaterialsVisible(false);
    refresh();
    message.success('下载成功');
  };

  useEffect(() => {
    refresh();
    setMetas((m: any) => {
      m.subTitle = activeKey === 'blocks' ? metasDefault.subTitle : null
      m.actions.render = (text: string, row: IGetLocalMaterialsResult) => [
        activeKey !== 'schema2code' && <Button
          type="link"
          block
          onClick={() => {
            onDetailClick(row)
          }}
        >
          使用模版
        </Button>,
        activeKey !== 'schema2code' && <Button
          type="link"
          block
          onClick={() => {
            if (!row.template) {
              message.error('添加失败，模板为空');
              return;
            }
            insertSnippet({
              template: row.template,
            }).then(() => {
              message.success('添加成功');
            });
          }}
        >
          直接添加
        </Button>,
        activeKey !== 'schema2code' && <Popconfirm
          title="Delete"
          description={`您确定要删除此${activeKey}吗?`}
          onConfirm={() => {
            deleteMaterialTemplate({
              name: row.name,
              type: activeKey
            }).then(() => {
              message.success('删除成功');
            })
          }}
          onCancel={() => { }}
          okText="Yes"
          cancelText="No"
        >
          <Button danger type="link">Delete</Button>
        </Popconfirm>,
      ]
    })
  }, [activeKey])


  return (
    <>
      <ProList<IGetLocalMaterialsResult, {}>
        loading={loading}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeKey, //'snippets' | 'blocks'
            items: [
              {
                key: 'snippets',
                label: <span>代码片段{renderBadge(count.snippets, activeKey === 'snippets')}</span>,
              },
              {
                key: 'blocks',
                label: <span>区块{renderBadge(count.blocks, activeKey === 'blocks')}</span>,
                // disabled: true
              },
              {
                key: 'schema2code',
                label: <span>schema2code{renderBadge(count.schema2code, activeKey === 'schema2code')}</span>,
              },
            ],
            onChange: (key: "snippets" | "blocks" | "schema2code") => {
              setActiveKey(key);
            },
          },
          actions: [
            <Button key="add" onClick={() => { setDownloadMaterialsVisible(true); }} type="primary">
              下载物料
            </Button>,
            <Button key="add" onClick={() => { history.push('/material-create'); }} type="primary">
              新建
            </Button>,
          ],
        }}
        search={false}
        onItem={(record: any) => ({
          onClick: () => {
            onEditClick(record)
          },
        })}
        dataSource={dataList}
        // request={(params: any) => handleSearch({ ...params, type: activeKey })}
        pagination={false}
        grid={{ gutter: 16, column: 2 }}
        rowKey="name"
        // showActions="hover"
        // showExtra="hover"
        tableExtraRender={(_: any, data: any) => (
          <Card>
            <Descriptions size="small" column={3}>
              <Descriptions.Item>
                <Button onClick={() => { setJsonToTsModalVisble(true) }}>JSON TO TS</Button>
              </Descriptions.Item>
              <Descriptions.Item>
                <Button type="primary" shape="circle" icon={loading ? <LoadingOutlined /> : <ReloadOutlined />} onClick={refresh}></Button>
              </Descriptions.Item>
              <Descriptions.Item>
                <Button type='primary' onClick={async () => {
                  await refreshIntelliSense();
                  message.success('刷新成功');
                }}>刷新代码智能提示</Button>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
        metas={metas}
      />
      <JsonToTs
        visible={jsonToTsModalVisble}
        json={{}}
        onCancel={() => {
          setJsonToTsModalVisble(false);
        }}
        onOk={(type) => {
          setJsonToTsModalVisble(false);
        }}
      />
      <DownloadMaterials
        visible={downloadMaterialsVisible}
        onOk={(data) => {
          handleDownloadMaterialsOk(data);
        }}
        onCancel={() => {
          setDownloadMaterialsVisible(false);
        }}
      />
    </>
  );
};

export default () => (
  <KeepAlive name="/materials" saveScrollPosition="screen">
    <MaterialsPage />
  </KeepAlive>
);
