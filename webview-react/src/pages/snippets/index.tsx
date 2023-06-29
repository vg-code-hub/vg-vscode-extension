/*
 * @Author: zdd
 * @Date: 2023-06-27 22:07:27
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-29 18:43:18
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/snippets/index.tsx
 * @Description: 
 */
import { IGetLocalMaterialsResult, insertSnippet } from '@/common';
import { useSnippets } from '@/common/hooks';
import { ProList } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Space, Tag, message } from 'antd';
import { useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';


const metas: any = {
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

const SnippetsPage: React.FC = () => {

  const { handleSearch } = useSnippets();
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const actions = {
    cardActionProps: 'actions',
    search: false,
    render: (text: string, row: IGetLocalMaterialsResult) => [
      <a
        rel="noopener noreferrer"
        key="link"
        onClick={() => {
          history.push(`/snippet-detail`, row);
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

  return (
    <>
      <ProList<any>
        toolBarRender={() => {
          return [
            <Button key="add" onClick={() => { history.push('/snippet-create'); }} type="primary">
              新建
            </Button>,
          ];
        }}
        search={{}}
        onItem={(record: any) => {
          return {
            onClick: () => {
              history.push(`/snippet-detail`, record);
            },
          };
        }}
        request={handleSearch}
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
    </>
  );
};

export default SnippetsPage;
