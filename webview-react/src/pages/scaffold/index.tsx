/*
 * @Author: zdd
 * @Date: 2023-06-27 22:27:49
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-04 17:24:20
 * @FilePath: /vg-vscode-extension/webview-react/src/pages/scaffold/index.tsx
 * @Description: 
 */
import { Row, Col, Spin, Button, Tooltip } from 'antd';
import { useImmer } from 'use-immer';
import { SyncOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { IScaffoldResponse, downloadScaffoldByVsCode, getPluginConfig, getScaffolds } from '@/common';
import FormModal from '@/components/FormModal';
import DownloadModal from '@/components/DownloadModal';
import LocalProjectModal from '@/components/LocalProjectModal';
import './index.less';

type IScaffold = IScaffoldResponse['scaffolds'][0];

const ScaffoldPage: React.FC = () => {
  const [categories, setCategories] = useImmer<
    { name: string; icon: string; }[]
  >([]);

  const [allScaffolds, setAllScaffolds] = useState<IScaffoldResponse[]>([]);
  const [scaffolds, setScaffolds] = useState<IScaffold[]>([]);
  const [currentCategory, setCurrentCategory] = useImmer('');

  const [formModal, setFormModal] = useImmer<{ visible: boolean; config: any }>(
    {
      visible: false,
      config: {},
    },
  );

  const [downloadVisible, setDownloadVisible] = useImmer(false);

  const [localProjectModalVisible, setLocalProjectModalVisible] =
    useImmer(false);

  const [loading, setLoading] = useImmer<{ fetch: boolean; download: boolean }>(
    {
      fetch: true,
      download: false,
    },
  );


  useEffect(() => {
    fetchScaffolds();
  }, []);

  useEffect(() => {
    if (currentCategory && allScaffolds.length > 0) {
      setScaffolds(
        allScaffolds.find((s) => s.category === currentCategory)!.scaffolds,
      );
    }
  }, [currentCategory]);

  const fetchScaffolds = async () => {
    setLoading((s) => { s.fetch = true; });
    try {
      const { scaffoldJson } = await getPluginConfig();
      const res = await getScaffolds(scaffoldJson);

      setCategories(
        res.map((s) => ({
          name: s.category,
          icon: s.icon,
        })),
      );
      setAllScaffolds(res);
      if (res.length > 0) {
        setCurrentCategory(res[0].category);
      }
    } catch (error) { }
    setLoading((s) => { s.fetch = false; });
  };

  const changeCategory = (name: string) => {
    if (name === currentCategory) return;
    setCurrentCategory(name);
  };

  const downloadScaffold = (config: typeof scaffolds[0]) => {
    setLoading((s) => {
      s.download = true;
    });
    downloadScaffoldByVsCode({
      repository: config.repository,
      type: config.repositoryType,
      tag: config.tag,
    })
      .then((res) => {
        setFormModal((s) => {
          s.visible = true;
          s.config = Object.assign({}, config, res);
        });
      })
      .finally(() => {
        setLoading((s) => {
          s.download = false;
        });
      });
  };

  return (
    <Spin
      spinning={loading.fetch || loading.download}
      tip={loading.download ? '正在下载模板...' : undefined}
    >
      <div className="scaffold">
        <Row className="header">
          <Col span={20}>
            选择模板创建应用{' '}
            <Tooltip title="分享物料可提交到https://github.com/JimmyZDD/vg-materials">
              <QuestionCircleOutlined />
            </Tooltip>
          </Col>
          <Col span={4} className="control">
            <SyncOutlined
              spin={loading.fetch}
              onClick={() => {
                fetchScaffolds();
              }}
            />
          </Col>
        </Row>
        <Row className="content">
          <Col>
            <div className="category">
              {categories.map((item) => (
                <div
                  className={`category-item ${currentCategory === item.name ? 'checked-item' : ''
                    }`}
                  key={item.name}
                  onClick={() => {
                    changeCategory(item.name);
                  }}
                >
                  <div className="icon">
                    <img src={item.icon} />
                  </div>
                  <div className="title">{item.name}</div>
                  {currentCategory === item.name && (
                    <div className="badge">
                      <span className="tick">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              style={{ width: '45%', borderRadius: '0px' }}
              type="primary"
              onClick={() => {
                setDownloadVisible(true);
              }}
            >
              更多模板
            </Button>
            <Button
              style={{ width: '45%', borderRadius: '0px' }}
              onClick={() => {
                setLocalProjectModalVisible(true);
              }}
            >
              本地调试
            </Button>
          </Col>
          <Col>
            <div className="scaffold">
              {scaffolds.length}
              {scaffolds.map((s) => (
                <div
                  className="scaffold-item"
                  onClick={() => {
                    downloadScaffold(s);
                  }}
                >
                  <div className="screenshot">
                    <img
                      src={
                        s.screenshot?.includes('gitee.')
                          ? 'https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg'
                          : s.screenshot
                      }
                    />
                  </div>
                  <div className="title">{s.title}</div>
                  <div className="description">{s.description}</div>
                  {s.tag && <div className="description">tag: {s.tag}</div>}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
      <FormModal
        visible={formModal.visible}
        config={formModal.config}
        onClose={() => {
          setFormModal((s) => {
            s.visible = false;
          });
        }}
      />
      <DownloadModal
        visible={downloadVisible}
        onClose={() => {
          setDownloadVisible(false);
        }}
      />
      <LocalProjectModal
        visible={localProjectModalVisible}
        onClose={() => {
          setLocalProjectModalVisible(false);
        }}
      />
    </Spin>
  );
};

export default ScaffoldPage;
