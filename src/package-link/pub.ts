/*
 * @Author: zdd
 * @Date: 2024-01-25 20:59:25
 * @LastEditors: zdd dongdong@grizzlychina.com
 * @LastEditTime: 2024-01-25 21:46:04
 * @FilePath: pub.ts
 */
import { DocumentLink, DocumentLinkProvider, Range, TextLine, Uri, workspace } from 'vscode';

function buildLinkFromPattern(line: TextLine, lineIndex: number, packageName: string) {
  const startCharacter = line.text.indexOf(packageName);
  const endCharacter = startCharacter + packageName.length;
  const linkRange = new Range(lineIndex, startCharacter, lineIndex, endCharacter);
  const registryUrlPattern = workspace.getConfiguration('pubDependencyLinks').registryUrlPattern;
  const registryUrl = registryUrlPattern.replace('{{pkg}}', packageName);
  const linkUri = Uri.parse(registryUrl);

  return new DocumentLink(linkRange, linkUri);
}

function shouldUseUrlPattern() {
  return !!workspace.getConfiguration('pubDependencyLinks').registryUrlPattern;
}

function buildLink(line: TextLine, lineIndex: number, packageName: string) {
  if (shouldUseUrlPattern()) return buildLinkFromPattern(line, lineIndex, packageName);

  const startCharacter = line.text.indexOf(packageName);
  const endCharacter = startCharacter + packageName.length;
  const linkRange = new Range(lineIndex, startCharacter, lineIndex, endCharacter);
  const registryUrl = workspace.getConfiguration('pubDependencyLinks').registryUrl;
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
        if (line.text.startsWith('flutter:')) {
          // no need to check for dependencies if block ended
          shouldCheckForDependency = false;
        } else {
          // find dependency
          const matches = line.text.trim().match(/^(\w+): \^?\d+/);
          if (matches && matches[1]) links.push(buildLink(line, lineIndex, matches[1]));
        }
      // check if we are in a dependencies block
      else shouldCheckForDependency = /(.*?)dependencies/i.test(line.text);

      lineIndex += 1;
    }

    return links;
  },
};
export default provider;
