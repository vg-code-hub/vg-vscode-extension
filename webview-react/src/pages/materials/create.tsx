import { useImmer } from 'use-immer';
import { useEffect, useState } from 'react';
import { useMount } from 'ahooks';
import { Button, Form, Input, message, Radio, Select } from 'antd';
import { history, useLocation, useModel } from '@umijs/max';
import CodeMirror from '@/components/CodeMirror';
import { IMaterialType, addSnippets } from "@/common";

export const getSchemaWebUrl = (
  schema: 'form-render' | 'amis' | 'formily' | string,
) => {
  if (schema === 'amis') {
    return 'https://aisuda.github.io/amis-editor-demo/#/edit/0';
  }
  if (schema === 'form-render') {
    return 'https://1.xrender.fun/~demos/generator-demo';
  }
  if (schema === 'formily') {
    return 'https://designable-antd.formilyjs.org/';
  }
};

export const defaultSchema = {
  formRender: {
    model: JSON.stringify({ name: 'vgcode' }, null, 2),
    schema: JSON.stringify(
      {
        formSchema: {
          schema: {
            type: 'object',
            column: 1,
            displayType: 'column',
            properties: {
              name: {
                title: '测试表单',
                type: 'string',
                props: {},
              },
            },
          },
        },
      },
      null,
      2,
    ),
  },
  amis: {
    model: JSON.stringify({ name: 'vgcode' }, null, 2),
    schema: JSON.stringify(
      {
        formSchema: {
          schema: {
            type: 'page',
            body: [
              {
                type: 'form',
                title: '',
                body: [
                  {
                    type: 'input-text',
                    name: 'name',
                    label: '测试表单',
                    id: 'u:4886baa626cf',
                    value: '',
                  },
                ],
                id: 'u:67967afb0e69',
                submitText: '',
              },
            ],
            id: 'u:d87dbf6bf8df',
            asideResizor: false,
            style: {
              boxShadow: ' 0px 0px 0px 0px transparent',
            },
            pullRefresh: {
              disabled: true,
            },
            regions: ['body'],
          },
        },
      },

      null,
      2,
    ),
  },
  formily: {
    model: JSON.stringify({ name: 'vgcode' }, null, 2),
    schema: JSON.stringify(
      {
        formSchema: {
          schema: {
            form: {
              labelCol: 6,
              wrapperCol: 12,
              layout: 'vertical',
              labelAlign: 'left',
              fullness: false,
              inset: false,
            },
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  title: '测试表单',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-validator': [],
                  'x-component-props': {},
                  'x-decorator-props': {},
                  'x-designable-id': 'v3zwx2xtcfx',
                  'x-index': 0,
                  name: 'name',
                },
              },
              'x-designable-id': 'd4ogui2afmr',
            },
          },
        },
      },
      null,
      2,
    ),
  },
};

const MaterialCreatePage: React.FC = () => {
  const location = useLocation();
  const [formData, setFormData] = useImmer<{
    name: string;
    template: string;
    model: string;
    schema: string;
    schemaType: 'form-render' | 'amis' | 'formily' | '';
    preview: string;
    commandPrompt: string;
    viewPrompt: string;
  }>({
    model: '{}',
    schemaType: 'amis',
    schema: '{}',
    preview: '',
  } as any);
  const [edit, setEdit] = useState(false);
  const { refresh } = useModel('@@initialState', ({ refresh }) => ({ refresh }));
  const [formType, setFormType] = useState<IMaterialType>('snippets');

  useEffect(() => {
    setFormData((f) => {
      f.schemaType = formType === 'blocks' ? 'amis' : '';
      f.preview = JSON.stringify(
        formType === 'blocks' ? {
          title: '',
          description: '',
          img: [
            'https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg',
          ],
          category: [],
          schema: 'amis',
          scripts: [
            {
              method: 'test',
              remark: '测试一下',
            },
          ],
        } : {
          title: '',
          description: '',
          notShowInCommand: false,
          notShowInintellisense: false,
        },
        null,
        2,
      )
    })
  }, [formType])

  useMount(() => {
    if (location.state) {
      const { record, type } = location.state as any
      setEdit(true);
      setFormType(type);
      setFormData(f => {
        f.name = record.name
        f.template = record.template
        f.model = JSON.stringify(record.model, null, 2)
        f.preview = JSON.stringify(record.preview, null, 2)
      });
    }
  })

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="类型">
          <Radio.Group
            options={
              [
                { label: 'Snippet', value: 'snippets' },
                { label: 'Block', value: 'blocks' },
                { label: 'Schema2code', value: 'schema2code', disabled: true },
              ]
            }
            disabled={edit}
            value={formType}
            optionType="button"
            buttonStyle="solid"
            onChange={(e) => setFormType(e.target.value)} />
        </Form.Item>
        <Form.Item label="名称" required>
          <Input
            value={formData.name}
            placeholder="输入名称"
            disabled={edit}
            onChange={(e) => {
              const { value } = e.target;
              setFormData((s) => ({
                ...s,
                name: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="代码片段" required>
          <CodeMirror
            domId="codeMirror"
            lint={false}
            value={formData.template}
            onChange={(value) => {
              setFormData((s) => ({
                ...s,
                template: value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item label="模板数据">
          <CodeMirror
            domId="modelCodeMirror"
            lint
            value={formData.model}
            onChange={(value) => {
              setFormData((s) => ({
                ...s,
                model: value,
              }));
            }}
          />
        </Form.Item>
        {formType == 'blocks' &&
          <>
            <Form.Item label="Schema 类型" required>
              <div style={{ display: 'flex' }}>
                <Select
                  value={formData.schemaType}
                  placeholder="输入名称"
                  options={[
                    { label: 'form-render', value: 'form-render' },
                    { label: 'amis', value: 'amis' },
                    { label: 'formily', value: 'formily' },
                  ]}
                  onChange={(value) => {
                    setFormData((s) => ({
                      ...s,
                      schemaType: value as any,
                    }));
                  }}
                />
                <Button
                  href={getSchemaWebUrl(formData.schemaType)}
                  type="link"
                  target="_blank"
                >
                  可视化配置
                </Button>
              </div>
            </Form.Item>
            <Form.Item label="模板 Schema">
              <CodeMirror
                domId="schemaCodeMirror"
                lint
                value={formData.schema}
                onChange={(value) => {
                  setFormData((s) => ({
                    ...s,
                    schema: value,
                  }));
                }}
              />
            </Form.Item>
          </>
        }
        <Form.Item label="更多配置">
          <CodeMirror
            domId="previewCodeMirror"
            lint
            value={formData.preview}
            onChange={(value) => {
              setFormData((s) => ({
                ...s,
                preview: value,
              }));
            }}
          />
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', width: '100%' }}>
        <Button
          shape="round"
          type="primary"
          onClick={() => {
            if (!formData.name || !formData.template) {
              message.error('请完善必填信息');
              return;
            }

            addSnippets(formData).then(async () => {
              message.success(`${edit ? '保存' : '添加'}成功`);
              await refresh();
              history.back();
            });
          }}
          style={{ width: '30%', marginRight: '30%' }}
        >
          {edit ? '保存' : '添加'} {formType}
        </Button>
        <Button
          shape="round"
          onClick={() => {
            history.back();
          }}
          style={{ width: '30%' }}
        >
          返回
        </Button>
      </div>
    </>
  );
}

export default MaterialCreatePage;
