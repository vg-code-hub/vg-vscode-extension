
import * as changeCase from "change-case";
import * as path from "path";
import Jimp from "jimp";
import { Uri, window } from "vscode";
import {
  readdirSync,
  statSync,
  existsSync,
  readdir,
  stat,
  appendFileSync,
  rmSync,
} from "fs";
import { mkdirp } from "mkdirp";

export const imageGenerate = async (uri: Uri) => {
  let targetDirectory = uri.fsPath;
  try {
    /**/
    imagesGen(targetDirectory);
    svgsGen(targetDirectory);

    window.showInformationMessage(`Successfully Generated Images Directory`);
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

function imagesGen(targetDirectory: string) {
  let isFirst = true;
  walkSync(targetDirectory, async (filePath: string, stat: object) => {
    var imgPath = path.parse(filePath);
    let lowExt = imgPath.ext.toLowerCase();
    if (
      lowExt !== ".jpeg" &&
      lowExt !== ".jpg" &&
      lowExt !== ".png"
      // imgPath.dir.toLowerCase().indexOf("3.0x") === -1
    )
      return;


    let dirPath = imgPath.dir.toLowerCase();
    let find3x = dirPath.indexOf("3.0x");
    if (find3x === -1)
      return;


    let workDir = path.resolve(imgPath.dir, ".."); // 上一级目录

    // 创建 2.0x 1.0x
    if (!existsSync(`${workDir}/2.0x`))
      createDirectory(`${workDir}/2.0x`);


    if (!existsSync(`${workDir}/${imgPath.base}`))
      await scaleImage(`${workDir}/${imgPath.base}`, filePath, 3);

    if (!existsSync(`${workDir}/2.0x/${imgPath.base}`))
      await scaleImage(`${workDir}/2.0x/${imgPath.base}`, filePath, 2);


    // 删除文件
    if (isFirst === true) {
      isFirst = false;
      if (existsSync(`${workDir}/files.txt`))
        rmSync(`${workDir}/files.txt`);

    }
    // 写入列表
    appendFileSync(
      `${workDir}/files.txt`,
      `static const ${changeCase.camelCase(imgPath.base)} = 'assets/images/${imgPath.base
      }';\r\n`,
      "utf8"
    );
  });
}

function svgsGen(targetDirectory: string) {
  let isFirst = true;
  walkSync(targetDirectory, async (filePath: string, stat: object) => {
    var imgPath = path.parse(filePath);
    let lowExt = imgPath.ext.toLowerCase();
    if (lowExt !== ".svg")
      return;


    let workDir = imgPath.dir;

    // 删除文件
    if (isFirst === true) {
      isFirst = false;
      if (existsSync(`${workDir}/files.txt`))
        rmSync(`${workDir}/files.txt`);

    }
    // 写入列表
    appendFileSync(
      `${workDir}/files.txt`,
      `static const ${changeCase.camelCase(imgPath.base)} = 'assets/svgs/${imgPath.base
      }';\r\n`,
      "utf8"
    );
  });
}

function fileDisplay(filePath: string, fileList: string[]) {
  //根据文件路径读取文件，返回文件列表
  readdir(filePath, function (err, files) {
    if (err)
      console.warn(err);
    else
      //遍历读取到的文件列表
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
          } else {
            var isFile = stats.isFile(); //是文件
            var isDir = stats.isDirectory(); //是文件夹
            if (isFile)
              fileList.push(filedir);

            if (isDir)
              fileDisplay(filedir, fileList); //递归，如果是文件夹，就继续遍历该文件夹下面的文件

          }
        });
      });

  });
}

function walkSync(currentDirPath: string, callback: Function) {
  readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = statSync(filePath);
    if (stat.isFile())
      callback(filePath, stat);
    else if (stat.isDirectory())
      walkSync(filePath, callback);

  });
}

function createDirectory(targetDirectory: string): Promise<string | void | undefined> {
  return mkdirp(targetDirectory);
}

const scaleImage = (
  destinationImagePath: string,
  imagePath: string,
  scale: number
) => {
  return new Promise<void>((resolve, reject) => {
    Jimp.read(imagePath, (error, image) => {
      if (error) {
        reject(error);
        console.error(error);
        throw error;
      }
      let w = image.bitmap.width / scale;
      let h = image.bitmap.height / scale;
      image.resize(w, h).write(destinationImagePath);
      resolve();
    });
  });
};
