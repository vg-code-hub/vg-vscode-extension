/*
 * @Author: zdd
 * @Date: 2023-06-17 18:03:33
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-05 11:33:36
 * @FilePath: /vg-vscode-extension/src/utils/download.ts
 * @Description:
 */
import axios from 'axios';
import * as path from 'path';
import * as execa from 'execa';
import * as fs from 'fs-extra';
import { tempGlobalDir } from './env';

const tar = require('tar');

export const download = (url: string, filePath: string, fileName: string) =>
  new Promise((resolve, reject) => {
    fs.ensureDir(filePath)
      .then(() => {
        const file = fs.createWriteStream(path.join(filePath, fileName));
        axios({
          url,
          responseType: 'stream',
        })
          .then((response) => {
            response.data
              .pipe(file)
              .on('finish', () => resolve(0))
              .on('error', (err: any) => {
                fs.unlink(filePath, () => reject(err));
              });
          })
          .catch((ex: any) => {
            reject(ex);
          });
      })
      .catch((ex: any) => {
        reject(ex);
      });
  });

export const downloadMaterialsFromNpm = async (packageName: string) => {
  const result = execa.execaSync('npm', ['view', packageName, 'dist.tarball']);
  const tarball = result.stdout;
  fs.removeSync(tempGlobalDir.materials);
  await download(tarball, tempGlobalDir.temp, `temp.tgz`);
  if (!fs.existsSync(tempGlobalDir.materials)) fs.mkdirSync(tempGlobalDir.materials);

  await tar.x({
    file: path.join(tempGlobalDir.temp, `temp.tgz`),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    C: tempGlobalDir.materials,
    strip: 1,
  });
};

export const downloadMaterialsFromGit = (remote: string) => {
  fs.removeSync(tempGlobalDir.materials);
  execa.execaSync('git', ['clone', ...remote.split(' '), tempGlobalDir.materials]);
};

export const copyMaterialsFromTemp = (from: { blocks: string[]; snippets: string[] }, to: string) => {
  from.blocks.map((s) => {
    fs.copySync(
      path.join(tempGlobalDir.blockMaterials, s),
      fs.existsSync(path.join(to, 'blocks', s)) ? path.join(to, 'blocks', `${s} copy`) : path.join(to, 'blocks', s)
    );
  });
  from.snippets.map((s) => {
    fs.copySync(
      path.join(tempGlobalDir.snippetMaterials, s),
      fs.existsSync(path.join(to, 'snippets', s)) ? path.join(to, 'snippets', `${s} copy`) : path.join(to, 'snippets', s)
    );
  });

  fs.removeSync(tempGlobalDir.materials);
};
