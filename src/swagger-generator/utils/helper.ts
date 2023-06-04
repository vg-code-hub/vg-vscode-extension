//类型
import { Swagger } from "../index.d";
import { handleSpecialSymbol } from "./common";

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

  for (let key in values.paths) {
    let val = values.paths[key];

    // for (let method in val) {
    //   let dto = "";
    //   if (val[method]?.responses?.[200]?.schema) {
    //     val[method].responses[200].schema.$ref =
    //       val[method]?.responses?.[200]?.schema.$ref ||
    //       val[method]?.responses?.[200]?.schema.$$ref;
    //     const { $ref, items } = val[method]?.responses?.[200]?.schema;
    //     if ($ref)
    //       dto = $ref.replace("#/definitions/", "");

    //     if (items)
    //       dto = items.$ref ? items.$ref.replace("#/definitions/", "") : "";

    //   }

    //   dto.replace(/[\u4e00-\u9fa5]+/g, (el) => {
    //     chineseSet.add(el);
    //     return el;
    //   });
    // }
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
