import * as path from 'path';
import * as fs from 'fs';
import { getFileContent } from './file';
import { getTemplateFilePath } from './config';
import { rootPath, snippetMaterialsPath } from './vscodeEnv';

/**
 * 获取本地 物料模板
 *
 * @param {('blocks' | 'snippets')} type
 */
export const getLocalMaterials = (
  type: 'blocks' | 'snippets',
  materialsFullPath: string,
) => {
  let materials: {
    path: string;
    name: string;
    model: {};
    schema: {};
    preview: {
      title?: string;
      description?: string;
      img?: string | string[];
      category?: string[];
      notShowInCommand?: boolean;
      notShowInSnippetsList?: boolean;
      notShowInintellisense?: boolean;
      schema?: string;
      chatGPT?: {
        commandPrompt?: string;
        viewPrompt?: string;
      };
    };
    template: string;
  }[] = [];
  try {
    materials = fs.readdirSync(materialsFullPath).map((s) => {
      const fullPath = path.join(materialsFullPath, s);
      let model = {} as any;
      let schema = {} as any;
      let preview = { img: '', category: [], schema: 'form-render' };
      let template = '';
      try {
        model = JSON.parse(
          getFileContent(path.join(fullPath, 'config', 'model.json'), true),
        );
      } catch { }
      try {
        schema = JSON.parse(
          getFileContent(path.join(fullPath, 'config', 'schema.json'), true),
        );
      } catch { }
      try {
        preview = JSON.parse(
          getFileContent(path.join(fullPath, 'config', 'preview.json'), true),
        );
      } catch { }
      if (!preview.img)
        preview.img =
          'https://gitee.com/img-host/img-host/raw/master/2020/11/05/1604587962875.jpg';

      if (!preview.schema)
        preview.schema = 'form-render';

      if (type === 'snippets')
        try {
          template = getFileContent(
            path.join(fullPath, 'src', 'template.ejs'),
            true,
          );
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
 */
export function getSnippets() {
  const templates: {
    path: string;
    name: string;
    model: {};
    schema: {};
    preview: {
      title?: string;
      description?: string;
      img?: string | string[];
      category?: string[];
      notShowInCommand?: boolean;
      notShowInSnippetsList?: boolean;
      notShowInintellisense?: boolean;
      schema?: string;
      chatGPT?: {
        commandPrompt?: string;
        viewPrompt?: string;
      };
    };
    template: string;
  }[] = getCodeTemplateListFromFiles().map((s) => ({
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