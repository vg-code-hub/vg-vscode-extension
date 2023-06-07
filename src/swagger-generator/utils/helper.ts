//类型
import type { Swagger } from "../index.d";
import { resolve, existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from "@root/util";


/**
 * 删除文件
 * @param path string;
 * @param options.deleteCurrPath 默认true 删除所有文件和文件夹，保存当前文件，false保留当前文件夹
 * @param options.ignore 不删除某些文件或者文件夹
 */

export const delDir = (
  path: string,
  options?: { deleteCurrPath: boolean; ignore: Array<string> }
) => {
  let files = [];
  if (existsSync(path)) {
    files = readdirSync(path);
    files.forEach((file: string) => {
      let curPath = resolve(path, file);
      if (statSync(curPath).isDirectory()) {
        if (options && options?.ignore.includes(curPath)) return;
        delDir(curPath); //递归删除文件夹
      } else {
        if (options && options?.ignore.includes(curPath)) return;
        unlinkSync(curPath); //删除文件
      }
    });
    (!options || options.deleteCurrPath === true) && rmdirSync(path); // 删除文件夹自身
  }
};

/**
 * @param key 含有处理特殊字符«» 【】 {} [] () （），如a«b«c»» 转换成a_b_c;
 */
export const handleSpecialSymbol = (key: string | any) => {
  return typeof key !== "string"
    ? key
    : key
      .replace(/[\«|\(|\（|\【|\[|\{]/g, "_")
      .replace(/[\»|\)|\）|\】|\]|\}]/g, "")
      .replace(
        /[\?|\？|\,|\，|\.|\。|\-|\/|\、|\=|\'|\"|\’|\‘|\“|\”|\s]/g,
        ""
      );
};

// 处理后端内置得特殊情况
export const builtInDataHandle = (str: string): string => {
  if (typeof str !== "string") return "";
  let left = str.indexOf("«");
  let right = str.lastIndexOf("»");
  if (left > -1 && right > -1)
    return `${str.slice(0, left)}«${builtInDataHandle(
      str.slice(left + 1, right)
    )}»${str.slice(right + 1)}`;

  return handleSpecialSymbol(str);
};
// 处理 #/definitions/XXX 这种情况后面的数据

export const defHandle = (str: string): string => {
  if (typeof str !== "string") return "";
  let value = str.replace("#/definitions/", "");
  value = builtInDataHandle(value);

  // return "#/definitions/" + exchangeZhToEn(value).str;
  return '';
};

/**
 * 收集所有中文列表
 */
export const collectChinese = (values: Swagger): Array<string> => {
  let chineseSet = new Set();
  for (let key in values.data) {
    const folder = values.data[key]["x-apifox-folder"];
    if (folder) {
      const paths = folder.split('/');
      paths.forEach(path => {
        (handleSpecialSymbol(path).match(/[\u4e00-\u9fa5]+/g) || []).map(
          (el: any) => chineseSet.add(el)
        );
      });
    }
  }

  values.tags.forEach(({ name }: Swagger["tags"][0]) => {
    const paths = name.split('/');
    paths.forEach(path => {
      (handleSpecialSymbol(path).match(/[\u4e00-\u9fa5]+/g) || []).map(
        (el: any) => chineseSet.add(el)
      );
    });
  });

  return Array.from(chineseSet.values()) as Array<string>;
};


/**
 * 根据中英文映射对象，替换掉中文部分，返回新的字符串
 * @param str 待修改的字符串
 * @param zhToEnMap 中英文映射对象
 */
export const exchangeZhToEn = (str: string, zhToEnMap: Record<string, string>) => {
  if (typeof str !== "string")
    return {
      hasZh: false,
      str: "",
    };
  let hasZh = false;
  str.split('/').map((el) => {
    let list = el.match(/[\u4e00-\u9fa5]+/g) || [];
    if (list.length > 0) hasZh = true;
    list.map((el) => {
      let val = zhToEnMap[el];
      if (val) str = str.replace(new RegExp(el), val);
    });
  });
  return {
    hasZh,
    str,
  };
};

export function getRegExp(path: string) {
  if (/^\/.*\/[g]?[ism]?$/.test(path)) {
    var parts = /^\/(.*)\/([g]?[ism]?)$/.exec(path);
    return new RegExp(parts![1], parts![2]);
  }
  return path;
}