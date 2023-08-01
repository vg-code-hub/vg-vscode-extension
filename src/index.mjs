import * as execa from 'execa';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';
import fsextra from 'fs-extra';
import g2js from 'gradlejs';

const execPath = '/Users/dongdongzhao/.vgcode/scaffold';

async function main() {
  console.log('Hello World!');
  fsextra.removeSync(execPath);
  try {
    execa.execaSync('git', ['clone', 'git@git.grizzlychina.com:frontend/xt_app.git', execPath]);
    const { stdout } = await execa.execa('git', ['submodule', 'status'], { cwd: execPath }).pipeStdout('stdout2.txt');
    const map = {};
    stdout.split('\n').forEach((line) => {
      const [value, key] = line.trim().split(' ');
      map[key] = { commit: value.startsWith('-') ? value.substring(1) : value };
    });

    const contentArr = fs.readFileSync(path.join(execPath, '.gitmodules'), 'utf8').trim().split('\n');
    for (let i = 0; i < contentArr.length; i += 3) {
      const key = contentArr[i + 1].split('=')[1].trim();
      const url = contentArr[i + 2].split('=')[1].trim();
      map[key] = { ...map[key], url };
    }
    let name = '';
    if (fs.existsSync(path.join(execPath, 'pubspec.yaml'))) {
      const config = parse(fs.readFileSync(path.join(execPath, 'pubspec.yaml'), 'utf8'));
      name = config.name;
    }
    console.log(map, name);
    fsextra.removeSync(path.join(execPath, '.git'));
    await execa.execa('git', ['init'], { cwd: execPath });
    for (const key in map) {
      fsextra.removeSync(path.join(execPath, key));
      console.log(map[key]);
      await execa.execa('git', ['submodule', 'add', map[key].url, key], { cwd: execPath });
      await execa.execa('git', ['checkout', map[key].commit], { cwd: path.join(execPath, key) });
    }
  } catch (error) {
    console.error(error);
  }
}

// main();

async function testGradlejs() {
  function cleanGStr(str) {
    if (str.startsWith('"')) str = str.substring(1, str.length - 1);
    if (str.endsWith('"')) str = str.substring(0, str.length - 1);
    return str;
  }
  const { android } = await g2js.parseFile(path.join(execPath, 'android/app/build.gradle'));
  console.log(cleanGStr(android.namespace).split('.'));
}

testGradlejs();