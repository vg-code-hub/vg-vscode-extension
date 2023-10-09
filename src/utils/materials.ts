import * as path from 'path';
import * as fs from 'fs';
import * as fsExtra from 'fs-extra';

import { getFileContent } from './file';
import { getTemplateFilePath } from './config';
import { materialsDir, tempGlobalDir, rootPath, snippetMaterialsPath, materialsPath } from './env';
import * as execa from 'execa';
import { MaterialType } from '@root/webview/type';

export type IMaterialType = 'blocks' | 'snippets' | 'schema2code' | 'swagger2api-dart' | 'swagger2api-ts';

export interface IGetLocalMaterialsResult {
  path: string;
  name: string;
  model: object;
  schema?: object;
  config?: object;
  preview: {
    title?: string;
    description?: string;
    img?: string | string[];
    category?: string[];
    schema?: 'form-render' | 'formily' | 'amis';
    scripts?: [{ method: string; remark: string }];
    notShowInintellisense?: boolean;
    notShowInCommand?: boolean;
  };
  template: string;
  script?: string;
  type?: IMaterialType;
}

/** 获取本地 物料模板 */
export const getLocalMaterials = (materialsFullPath: string) => {
  let materials: IGetLocalMaterialsResult[] = [];
  try {
    materials = fs.readdirSync(materialsFullPath).map((s) => {
      const fullPath = path.join(materialsFullPath, s);
      let model = {} as any;
      let schema = {} as any;
      let config = {} as any;
      let preview: IGetLocalMaterialsResult['preview'] = {};
      let template = '',
        script = '';
      try {
        model = JSON.parse(getFileContent(path.join(fullPath, 'config', 'model.json'), true));
      } catch {}
      try {
        schema = JSON.parse(getFileContent(path.join(fullPath, 'config', 'schema.json'), true));
      } catch {}
      try {
        preview = JSON.parse(getFileContent(path.join(fullPath, 'config', 'preview.json'), true));
      } catch {}
      try {
        config = JSON.parse(getFileContent(path.join(fullPath, 'config', 'config.json'), true));
      } catch {}
      try {
        if (fs.existsSync(path.join(fullPath, 'src', 'template'))) template = getFileContent(path.join(fullPath, 'src', 'template'), true);
        else if (fs.existsSync(path.join(fullPath, 'src', 'template.ejs'))) template = getFileContent(path.join(fullPath, 'src', 'template.ejs'), true);
      } catch {}
      try {
        if (fs.existsSync(path.join(fullPath, 'script', 'index.js'))) script = getFileContent(path.join(fullPath, 'script', 'index.js'), true);
      } catch {}

      if (schema.formSchema) {
        if (schema.formSchema.formData) model = schema.formSchema.formData;

        schema = schema.formSchema.schema;
      }
      if (Object.keys(schema).length > 0 && preview.schema === 'amis') {
        // 设置 page 默认 name
        schema.name = 'page';
        if (schema.body && Array.isArray(schema.body))
          schema.body.forEach((s: Record<string, unknown>) => {
            if (s.type === 'form') {
              s.name = 'form';
              if (s.data && Object.keys(model).length === 0) model = s.data;
              else if (!s.data && Object.keys(model).length > 0) s.data = model;
            }
          });
      }

      return {
        path: fullPath,
        name: s,
        script,
        config,
        model,
        schema,
        preview,
        template,
      };
    });
  } catch {}
  return materials.filter((s) => !s.name.startsWith('.'));
};

export const getCodeTemplateListFromFiles = () => {
  const list: { name: string; template: string; type: 'ejs' }[] = [];
  const templateFullPath = path.join(rootPath, getTemplateFilePath());

  try {
    const templateFiles = fs.readdirSync(templateFullPath).filter((s) => s.indexOf('.ejs') > -1);
    templateFiles.map((s) => {
      const fileBuffer = fs.readFileSync(path.join(templateFullPath, s));
      const fileContent = fileBuffer.toString();
      list.push({
        name: s,
        template: fileContent,
        type: 'ejs',
      });
    });
  } catch (error) {}
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
  return templates.concat(getLocalMaterials(snippetMaterialsPath));
}

export const deleteMaterialTemplate = (data: { name: string; type: MaterialType }) => {
  const snippetPath = path.join(tempGlobalDir.materials, materialsDir, data.type, data.name);
  execa.execaSync('rm', ['-rf', snippetPath]);
  return '删除成功';
};

export const saveMaterialLocal = (data: MaterialType) => {
  const srcPath = path.join(tempGlobalDir.materials, materialsDir, data);
  const destPath = path.join(materialsPath, data);

  fsExtra.copySync(srcPath, fsExtra.existsSync(destPath) ? destPath + '-copy' : destPath);
};

const getMaterialLocalList = () => {
  const arr = ['swagger2api', 'schema2code', 'blocks', 'snippets'];
  return arr.filter((key) => {
    const destPath = path.join(materialsPath, key);
    return fsExtra.existsSync(destPath);
  });
};

export class Material {
  static get localList(): string[] {
    return getMaterialLocalList();
  }

  static getDirPath(type: MaterialType) {
    if (this.localList.includes(type)) return path.join(materialsPath, type);
    return path.join(tempGlobalDir.materials, materialsDir, type);
  }
}
