/*
 * @Author: zdd
 * @Date: 2023-06-27 22:07:27
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-19 19:58:06
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/materials/index.tsx
 * @Description: 
 */

import { ActionType, ProColumns, ProList } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, Button, Space, Tag, message } from 'antd';
import ImageViewer from 'react-simple-image-viewer';
import { useImmer } from 'use-immer';
import { IDownloadMaterialsResult, IGetLocalMaterialsResult, insertSnippet } from '@/common';
import { useMaterial } from '@/common/hooks';
import DownloadMaterials from '@/components/DownloadMaterials';
import { useEffect, useRef } from 'react';


const metas: ProColumns<IGetLocalMaterialsResult> = {
  title: {
    title: '关键字',
    dataIndex: ['preview', 'title']
  },
  schema: {
    title: '渲染器',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部 ', status: '' },
      'form-render': {
        text: 'form-render',
        status: 'form-render',
      },
      amis: {
        text: 'amis',
        status: 'amis',
      },
      formily: {
        text: 'formily',
        status: 'formily',
      },
    },
  },
  // avatar: {
  //   dataIndex: 'image',
  //   search: false,
  // },
  description: {
    dataIndex: ['preview', 'description'],
    search: false,
  },
  content: {
    search: false,
    dataIndex: ['preview', 'description'],
  },
  subTitle: {
    search: false,
    dataIndex: ['preview', 'description'],
    render: (text: string, row: IGetLocalMaterialsResult, index: number, ...rests: any) => {
      return (
        <Space size={0}>
          <Tag color="blue">{row.preview.schema ?? 'form-render'}</Tag>
        </Space>
      );
    },
  },
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
  const actionRef = useRef<ActionType>();
  const { count, handleSearch } = useMaterial();
  const [activeKey, setActiveKey] = useImmer<React.Key>('snippets');
  const [isViewerOpen, setIsViewerOpen] = useImmer(false);
  const [previewImages, setPreviewImages] = useImmer<string[]>([]);
  const [downloadMaterialsVisible, setDownloadMaterialsVisible] = useImmer(false);

  const actions = {
    cardActionProps: 'actions',
    search: false,
    render: (text: string, row: IGetLocalMaterialsResult) => [
      <a
        rel="noopener noreferrer"
        key="link"
        onClick={() => {
          history.push(`/material-detail/${row.name}`, row);
        }}
      >
        使用模版
      </a>,
      <a
        target="_blank"
        rel="noopener noreferrer"
        key="warning"
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
      </a>,
      <a
        target="_blank"
        rel="noopener noreferrer"
        key="view"
        onClick={() => {
          setIsViewerOpen(true)
          if (row.preview.img && Array.isArray(row.preview.img)) {
            setPreviewImages(row.preview.img);
          }
        }}
      >
        查看
      </a>,
    ],
  }

  const handleDownloadMaterialsOk = (materials: IDownloadMaterialsResult) => {
    if (materials.blocks.length === 0 && materials.snippets.length === 0) {
      message.warning('未设置物料');
    }
    setDownloadMaterialsVisible(false);
    actionRef.current?.reloadAndRest();
    message.success('下载成功');
  };

  useEffect(() => {
    actionRef.current?.reloadAndRest();
  }, [activeKey])

  return (
    <>
      <ProList<IGetLocalMaterialsResult, {}>
        actionRef={actionRef}
        toolbar={{
          // filter: (
          //   <LightFilter>
          //     <ProFormDatePicker name="startdate" label="响应日期" />
          //   </LightFilter>
          // ),
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
              },
            ],
            onChange: (key: string) => {
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
        search={{}}
        onItem={(record: any) => {
          return {
            onClick: () => {
              history.push(`/material-detail/${record.name}`, record);
            },
          };
        }}
        request={(params: any) => handleSearch({ ...params, type: activeKey })}
        pagination={{
          defaultPageSize: 8,
          showSizeChanger: false,
        }}
        rowSelection={{}}
        grid={{ gutter: 16, column: 2 }}
        rowKey="name"
        headerTitle="代码片段"
        showActions="hover"
        showExtra="hover"
        metas={{
          ...metas,
          actions,
        }}
      />
      {isViewerOpen && (
        <ImageViewer
          src={previewImages}
          currentIndex={0}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={() => {
            setIsViewerOpen(false);
          }}
        />
      )}
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

export default MaterialsPage;
