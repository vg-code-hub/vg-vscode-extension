/*
 * @Author: zdd
 * @Date: 2024-01-25 20:59:19
 * @LastEditors: zdd dongdong@grizzlychina.com
 * @LastEditTime: 2024-01-25 21:05:47
 * @FilePath: npm.ts
 */
import { DocumentLink, DocumentLinkProvider, Range, TextLine, Uri, workspace } from 'vscode';

function buildLinkFromPattern(line: TextLine, lineIndex: number, packageName: string) {
  const startCharacter = line.text.indexOf(packageName);
  const endCharacter = startCharacter + packageName.length;
  const linkRange = new Range(lineIndex, startCharacter, lineIndex, endCharacter);
  const registryUrlPattern = workspace.getConfiguration('npmDependencyLinks').registryUrlPattern;
  const registryUrl = registryUrlPattern.replace('{{pkg}}', packageName);
  const linkUri = Uri.parse(registryUrl);

  return new DocumentLink(linkRange, linkUri);
}

function shouldUseUrlPattern() {
  return !!workspace.getConfiguration('npmDependencyLinks').registryUrlPattern;
}

function buildLink(line: TextLine, lineIndex: number, packageName: string) {
  if (shouldUseUrlPattern()) return buildLinkFromPattern(line, lineIndex, packageName);

  const startCharacter = line.text.indexOf(packageName);
  const endCharacter = startCharacter + packageName.length;
  const linkRange = new Range(lineIndex, startCharacter, lineIndex, endCharacter);
  const registryUrl = workspace.getConfiguration('npmDependencyLinks').registryUrl;
  const linkUri = Uri.parse(`${registryUrl}${packageName}`);
  return new DocumentLink(linkRange, linkUri);
}

const provider: DocumentLinkProvider = {
  provideDocumentLinks(document, token) {
    let links = [];
    let lineIndex = 0;
    let shouldCheckForDependency = false;

    while (lineIndex < document.lineCount) {
      const line = document.lineAt(lineIndex);

      if (shouldCheckForDependency)
        if (line.text.includes('}')) {
          // no need to check for dependencies if block ended
          shouldCheckForDependency = false;
        } else {
          // find dependency
          const matches = line.text.match(/"(.*?)"/);

          if (matches) links.push(buildLink(line, lineIndex, matches[1]));
        }
      // check if we are in a dependencies block
      else shouldCheckForDependency = /"(.*?)dependencies"/i.test(line.text);

      lineIndex += 1;
    }

    return links;
  },
};
export default provider;
