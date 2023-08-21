import { render as ejsRender } from 'ejs';
import material from '../webview/controllers/material';
import { IGetLocalMaterialsResult, find, camelCase, upperFirst } from '@root/utils';

export function findCodeTemplate(arr: string[], snakeCaseName: string) {
  const camelCaseName = camelCase(snakeCaseName);
  const pascalName = upperFirst(camelCaseName);

  let content = ejsRender(find(getSchema2code(), { name: arr.join('-') })!.template, {
    className: pascalName,
    camelClassName: camelCaseName,
    snakeName: snakeCaseName,
    dataClass: pascalName + 'Model',
    properties: []
  });

  if (arr.includes('item')) return content;

  ['detail', 'list', 'create'].forEach((item) => {
    ['Page', 'Controller'].forEach((item2) => {
      if (arr.includes(item))
        content = content.replaceAll(pascalName + upperFirst(item) + item2, pascalName + item2);
    });
    if (arr.includes('page'))
      content = content.replaceAll(`_${item}.dart`, '.dart');
  });

  return content;
}

let schema2codeMaterial: IGetLocalMaterialsResult[];
function getSchema2code() {
  if (schema2codeMaterial) return schema2codeMaterial;
  if (typeof material.getLocalMaterials() !== 'string') {
    schema2codeMaterial = (material.getLocalMaterials() as any).schema2code;
    return schema2codeMaterial;
  }
  return [];
}