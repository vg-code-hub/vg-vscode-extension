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
import { useEffect } from 'react';
import { downloadScaffoldByVsCode, getScaffolds } from '@/common';
import FormModal from '@/components/FormModal';
import DownloadModal from '@/components/DownloadModal';
import LocalProjectModal from '@/components/LocalProjectModal';
import './index.less';

const ScaffoldPage: React.FC = () => {
  const [categories, setCategories] = useImmer<
    { name: string; icon: string; uuid: string }[]
  >([]);

  const [allScaffolds, setAllScaffolds] = useImmer<
    {
      category: string;
      title: string;
      description: string;
      screenshot: string;
      repository: string;
      repositoryType: 'git' | 'npm';
      uuid: string;
    }[]
  >([]);

  const [scaffolds, setScaffolds] = useImmer<
    {
      category: string;
      title: string;
      description: string;
      screenshot: string;
      repository: string;
      repositoryType: 'git' | 'npm';
      uuid: string;
    }[]
  >([]);

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
    if (currentCategory) {
      setScaffolds(
        allScaffolds.filter((s) => s.category === currentCategory),
      );
    }
  }, [currentCategory]);

  const fetchScaffolds = () => {
    setLoading((s) => {
      s.fetch = true;
    });
    const promises: ReturnType<typeof getScaffolds>[] = [
      getScaffolds(
        'https://gitee.com/lowcoding/scaffold/raw/master/index.json',
      ),
    ];
    Promise.all(promises)
      .then((allRes) => {
        const res = allRes.flat();
        setCategories(
          res.map((s) => ({
            name: s.category,
            icon: s.icon,
            uuid: s.uuid,
          })),
        );
        const scaffolds: typeof allScaffolds = [];
        res.map((r) => {
          r.scaffolds.map((s) => {
            scaffolds.push({
              category: r.uuid,
              title: s.title,
              description: s.description,
              screenshot: s.screenshot,
              repository: s.repository,
              repositoryType: s.repositoryType,
              uuid: s.uuid,
            });
          });
        });
        setAllScaffolds(scaffolds);
        if (res.length > 0) {
          setCurrentCategory(res[0].uuid);
        }
      })
      .finally(() => {
        setLoading((s) => {
          s.fetch = false;
        });
      });
  };

  const changeCategory = (uuid: string) => {
    if (uuid === currentCategory) {
      return;
    }
    setCurrentCategory(uuid);
  };

  const downloadScaffold = (config: typeof scaffolds[0]) => {
    setLoading((s) => {
      s.download = true;
    });
    downloadScaffoldByVsCode({
      repository: config.repository,
      type: config.repositoryType,
    })
      .then((res) => {
        setFormModal((s) => {
          s.visible = true;
          s.config = res;
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
            <Tooltip title="分享物料可提交到https://github.com/lowcoding/scaffold">
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
                  className={`category-item ${currentCategory === item.uuid ? 'checked-item' : ''
                    }`}
                  key={item.uuid}
                  onClick={() => {
                    changeCategory(item.uuid);
                  }}
                >
                  <div className="icon">
                    <img src={item.icon} />
                  </div>
                  <div className="title">{item.name}</div>
                  {currentCategory === item.uuid && (
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
              {scaffolds.map((s) => (
                <div
                  key={s.uuid}
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
