const https = require("https");
const fs = require("fs");
const md5 = require("md5");
const paths = require("path");

import { handleSpecialSymbol } from "../utils";
import { ParamsBaidu, ParamsZhiyi } from "./index.d";

const options = {
    outputPath: '',
    fanyi: {
        baidu: {
            appid: "20210301000711374",
            secretKey: "qyjxl2zU20BwQ8sfdyxt",
            maxLimit: 2000,
        },
    }
};


/**
 * 获取中文转英文翻译
 * @param values
 */

export async function getTranslateInfo(values: Array<string>, translationPath: string) {

    let translationObj: { [key: string]: string } = getTranslateJson(
        translationPath
    );
    // 过滤掉已翻译的
    values = values.filter((el) => !translationObj.hasOwnProperty(el));
    try {
        await zhiyiTranslationHandle(values, translationObj);
    } catch (error) {
        console.log("知译翻译失败,使用百度翻译");
        // 百度翻译处理
        await baiduTranslationHandle(values, translationObj);
    }

    return translationObj;
}

// 百度翻译
export const baiduTranslationHandle = async (
    values: Array<string>,
    translationObj: { [key: string]: any }
) => {

    const { maxLimit, appid, secretKey } = options?.fanyi?.baidu;
    let qList = splitArray(values, maxLimit);
    let salt = Math.floor(Math.random() * 1e10);

    // 这里的一秒调用一次接口，第三方接口限制
    async function loop(index: number) {
        let q = qList[index];
        let sign = md5(appid + q + salt + secretKey);
        try {
            let msg = await new Promise((resolve, reject) => {
                https.get(
                    `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURI(
                        q
                    )}&from=zh&to=en&appid=${appid}&salt=${salt}&sign=${sign}`,
                    (val: any) => {
                        val.setEncoding("utf8");
                        let rawData = "";

                        val.on("data", (chunk: any) => {
                            rawData += chunk;
                        });

                        val.on("end", () => {
                            try {
                                let result: ParamsBaidu = JSON.parse(rawData);
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                const { trans_result = [] } = result;
                                // 把翻译的信息存到translationObj；
                                trans_result.map((el) => {
                                    translationObj[el.src] = handleEn(el.dst);
                                });
                                setTimeout(() => {
                                    resolve(JSON.parse(rawData));
                                }, 1000);
                            } catch (error) {
                                reject(error);
                            }
                        });

                        val.on("error", (error: any) => {
                            reject(error);
                        });
                    }
                );
            });
            if (index + 1 < qList.length)
                loop(index + 1);
            else
                Promise.resolve("完成");

        } catch (error) {
            Promise.resolve("失败");
        }
    }
    if (qList.length > 0)
        await loop(0);
};

// 知译翻译
export const zhiyiTranslationHandle = async (
    values: Array<string>,
    translationObj: { [key: string]: any }
) => {
    const maxLimit = 2000;
    let qList = splitArray(values, maxLimit);

    // 保留了百度一样处理
    async function loop(index: number) {
        let q = qList[index];

        let msg = await new Promise((resolve, reject) => {
            const content = {
                entityTag: "0",
                field: "common",
                lang: "chinese",
                src: values,
            };
            const req = https.request(
                "https://www.trialos.com/api/ai-translationservice/ai/translate/translateBatch",
                {
                    method: "POST",
                    headers: {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "Content-Type":
                            "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                },
                (val: any) => {
                    val.setEncoding("utf8");
                    let rawData = "";

                    val.on("data", (chunk: any) => {
                        rawData += chunk;
                    });

                    val.on("end", () => {
                        try {
                            let result: ParamsZhiyi = JSON.parse(rawData);
                            const { data } = result;
                            // 把翻译的信息存到translationObj；
                            for (let key in data.tgt)
                                translationObj[key] = handleEn(
                                    data.tgt[key].tgt
                                );


                            setTimeout(() => {
                                resolve(JSON.parse(rawData));
                            }, 1000);
                        } catch (error) {
                            reject(error);
                        }
                    });

                    val.on("error", (error: any) => {
                        reject(error);
                    });
                }
            );
            // write data to request body
            req.write(JSON.stringify(content));
            req.end();
        });
        if (index + 1 < qList.length)
            loop(index + 1);
        else
            Promise.resolve("完成");

    }
    if (qList.length > 0)
        try {
            await loop(0);
            // 判断文件夹是否存在，不存在则创建
            if (!fs.existsSync(options.outputPath))
                fs.mkdirSync(options.outputPath);

            // 把翻译的内容写入
            await new Promise((resolve, reject) => {
                // 判断 'swagger2ts文件是否存在

                fs.writeFile(
                    paths.resolve(options.outputPath, "translation.json"),
                    JSON.stringify(translationObj, null, 4),
                    (error: any) => {
                        if (error)
                            reject(error);
                        else
                            resolve("写入成功");

                    }
                );
            });
        } catch (error) {
            return Promise.reject();
        }

};

/**
 * 获取上次翻译的信息
 * @param uri 上一次缓存的翻译路径
 */
export const getTranslateJson = (uri: string) => {
    try {
        let file = fs.readFileSync(uri);
        return JSON.parse(file);
    } catch (error) {
        return {};
    }
};

/**
 * 根据最大长度限制，拆分成多个query
 * @param list
 * @param maxLimit
 * @example splitArray(['123','12','2'],4) // ['123','122']
 */

export const splitArray = (list: Array<string>, maxLimit: number) => {
    let splitList = [];
    // 临时字符串
    let arr = "";
    for (let val of list) {
        if (val.length > maxLimit) continue;
        let str = arr === "" ? val : arr + "\n" + val;
        if (str.length > maxLimit) {
            splitList.push(arr);
            arr = val;
        } else {
            arr = str;
        }
    }
    if (arr) splitList.push(arr);
    return splitList;
};

// 返回的英文处理
export const handleEn = (str: string) => {
    return str
        .split(/\s+/)
        .reduce(
            (a, b) =>
                a +
                handleSpecialSymbol(
                    b.substring(0, 1).toUpperCase() + b.substring(1).toLowerCase()
                ),
            ""
        );
};
