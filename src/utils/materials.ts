import * as path from 'path';
import * as fs from 'fs';
import { getFileContent } from './file';
import { getTemplateFilePath } from './config';
import { rootPath, snippetMaterialsPath } from './vscodeEnv';
import { materialsDir, tempGlobalDir } from './env';
import * as execa from 'execa';

export type IMaterialType = 'blocks' | 'snippets' | 'schema2code';

export interface IGetLocalMaterialsResult {
  path: string;
  name: string;
  model: any;
  schema: any;
  preview: {
    title?: string;
    description?: string;
    img?: string | string[];
    category?: string[];
    schema?: 'form-render' | 'formily' | 'amis';
    scripts?: [{ method: string; remark: string; }];
    notShowInintellisense?: boolean
    notShowInCommand?: boolean
  };
  template: string;
  type?: string
}

/**
 * 获取本地 物料模板
 *
 * @param {(IMaterialType)} type
 */
export const getLocalMaterials = (
  type: IMaterialType,
  materialsFullPath: string,
) => {
  let materials: IGetLocalMaterialsResult[] = [];
  try {
    materials = fs.readdirSync(materialsFullPath).map((s) => {
      const fullPath = path.join(materialsFullPath, s);
      let model = {} as any;
      let schema = {} as any;
      let preview: IGetLocalMaterialsResult['preview'] = { description: '', img: '', category: [], schema: 'form-render' };
      let template = '';
      try {
        model = JSON.parse(getFileContent(path.join(fullPath, 'config', 'model.json'), true));
      } catch { }
      try {
        schema = JSON.parse(getFileContent(path.join(fullPath, 'config', 'schema.json'), true));
      } catch { }
      try {
        preview = JSON.parse(getFileContent(path.join(fullPath, 'config', 'preview.json'), true));
      } catch { }
      if (type !== 'blocks')
        try {
          template = getFileContent(path.join(fullPath, 'src', type === 'schema2code' ? 'template' : 'template.ejs'), true);
        } catch { }

      if (schema.formSchema) {
        if (schema.formSchema.formData)
          model = schema.formSchema.formData;

        schema = schema.formSchema.schema;
      }
      if (Object.keys(schema).length > 0 && preview.schema === 'amis') {
        // 设置 page 默认 name
        schema.name = 'page';
        if (schema.body && Array.isArray(schema.body))
          schema.body.forEach((s: Record<string, unknown>) => {
            if (s.type === 'form') {
              s.name = 'form';
              if (s.data && Object.keys(model).length === 0)
                model = s.data;
              else if (!s.data && Object.keys(model).length > 0)
                s.data = model;
            }
          });

      }

      return {
        path: fullPath,
        name: s,
        model,
        schema,
        preview,
        template,
      };
    });
  } catch { }
  return materials.filter((s) => s.name !== '.DS_Store');
};

export const getCodeTemplateListFromFiles = () => {
  const list: { name: string; template: string; type: 'ejs' }[] = [];
  const templateFullPath = path.join(rootPath, getTemplateFilePath());

  try {
    const templateFiles = fs
      .readdirSync(templateFullPath)
      .filter((s) => s.indexOf('.ejs') > -1);
    templateFiles.map((s) => {
      const fileBuffer = fs.readFileSync(path.join(templateFullPath, s));
      const fileContent = fileBuffer.toString();
      list.push({
        name: s,
        template: fileContent,
        type: 'ejs',
      });
    });
  } catch (error) { }
  return list;
};

/**
 * 获取 codeTemplate 目录下ejs文件作为代码模板并且合并代码片段
 *
 * @export
 * @returns
 * @deprecated This is a legacy alias tempGlobalDir
 * TODO: remove it
 */
export function getSnippets() {
  const templates: IGetLocalMaterialsResult[] = getCodeTemplateListFromFiles().map((s) => ({
    path: s.name,
    name: s.name,
    model: {},
    schema: {},
    preview: {
      img: 'https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg',
      category: [],
    },
    template: s.template,
  }));
  return templates.concat(getLocalMaterials('snippets', snippetMaterialsPath));
}

export const deleteMaterialTemplate = (data: {
  name: string;
  type: 'schema2code' | 'blocks' | 'snippets';
}) => {
  const snippetPath = path.join(tempGlobalDir.materials, materialsDir, data.type, data.name);
  execa.execaSync('rm', ['-rf', snippetPath]);
  return '删除成功';
};