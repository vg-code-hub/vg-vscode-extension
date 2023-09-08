import { pascalCase, snakeCase, writeFileSync } from '../utils';
import { PageType } from '@root/type.d';
import { findCodeTemplate } from './utils';
import { findIndex } from 'lodash';

// controller
export function controllerTemplate(pageName: string, targetDirectory: string, pageType: PageType) {
  const snakeCaseName = snakeCase(pageName);
  const targetPath = `${targetDirectory}/controllers/${snakeCaseName}.dart`;
  let template = '';

  switch (pageType) {
    case 'normal':
      template = findCodeTemplate(['dart', 'detail', 'controller'], snakeCaseName);
      break;
    case 'refresh list':
      template = findCodeTemplate(['dart', 'list', 'controller'], snakeCaseName);
      break;
    case 'form':
      template = findCodeTemplate(['dart', 'create', 'controller'], snakeCaseName);
      break;
  }

  return new Promise(async (resolve, reject) => {
    try {
      writeFileSync(targetPath, template, 'utf8');
      resolve('success');
    } catch (error) {
      reject(error);
    }
  });
}

// view
export function viewTemplate(pageName: string, targetDirectory: string, pageType: PageType) {
  const pascalCaseName = pascalCase(pageName);
  const snakeCaseName = snakeCase(pageName);
  const targetPath = `${targetDirectory}/${snakeCaseName}_page.dart`;
  let template = '';

  function transToKeepAlive(template: string) {
    const templateArr = template.replaceAll(`${pascalCaseName}Page`, `_${pascalCaseName}ViewGetX`).split('\n');
    const index = templateArr.findIndex((item) => item.startsWith('class'));
    templateArr.splice(
      index,
      0,
      `
class ${pascalCaseName}Page extends StatefulWidget {
  const ${pascalCaseName}Page({ Key? key }) : super(key: key);

  @override
  State<${pascalCaseName}Page> createState() => _${pascalCaseName}PageState();
}

class _${pascalCaseName}PageState extends State<${pascalCaseName}Page>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return const _${pascalCaseName}ViewGetX();
  }
}
`
    );
    return templateArr.join('\n');
  }

  switch (pageType) {
    case 'normal':
      template = findCodeTemplate(['dart', 'detail', 'page'], snakeCaseName);
      template = transToKeepAlive(template);
      break;
    case 'refresh list':
      template = findCodeTemplate(['dart', 'list', 'page'], snakeCaseName);
      template = transToKeepAlive(template);
      break;
    case 'form':
      template = findCodeTemplate(['dart', 'create', 'page'], snakeCaseName);
      template = transToKeepAlive(template);
      break;
  }

  return new Promise(async (resolve, reject) => {
    try {
      if (pageType === 'refresh list')
        writeFileSync(`${targetDirectory}/widgets/${snakeCaseName}_item.dart`, findCodeTemplate(['dart', 'list', 'item'], snakeCaseName), 'utf8');
      writeFileSync(targetPath, template, 'utf8');
      resolve('success');
    } catch (error) {
      reject(error);
    }
  });
}
