const https = require('https');
const md5 = require('md5');

import { ParamsBaidu, ParamsZhiyi } from './index.d';
import { handleSpecialSymbol } from '../utils';
import { SHA256, enc } from 'crypto-js';

const fanyi = {
  baidu: {
    appid: '20210422000795232',
    secretKey: '3Pa0eeawc3SBmUBIskBK',
    maxLimit: 2000,
  },
};

// 百度翻译
export const baiduTranslationHandle = async (values: Array<string>, translationObj: { [key: string]: any }) => {
  const { maxLimit, appid, secretKey } = fanyi?.baidu;
  let qList = splitArray(values, maxLimit);
  let salt = Math.floor(Math.random() * 1e10);

  // 这里的一秒调用一次接口，第三方接口限制
  async function loop(index: number) {
    let q = qList[index];
    let sign = md5(appid + q + salt + secretKey);
    try {
      await new Promise((resolve, reject) => {
        https.get(
          `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURI(q)}&from=zh&to=en&appid=${appid}&salt=${salt}&sign=${sign}`,
          (val: any) => {
            val.setEncoding('utf8');
            let rawData = '';

            val.on('data', (chunk: any) => {
              rawData += chunk;
            });

            val.on('end', () => {
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

            val.on('error', (error: any) => {
              reject(error);
            });
          }
        );
      });
      if (index + 1 < qList.length) loop(index + 1);
      else Promise.resolve('完成');
    } catch (error) {
      Promise.resolve('失败');
    }
  }
  if (qList.length > 0)
    try {
      await loop(0);
    } catch (error) {
      return Promise.reject();
    }
};

// 知译翻译
export const zhiyiTranslationHandle = async (values: Array<string>, translationObj: { [key: string]: any }) => {
  const maxLimit = 2000;
  let qList = splitArray(values, maxLimit);

  var appKey = '174b0a38fcc259db';
  var key = 'kx85gxMIFMEFdq6pkBskPSpFktJ3kLvX'; //注意：暴露appSecret，有被盗用造成损失的风险
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  var from = 'zh-CHS';
  var to = 'en';

  function truncate(q: string) {
    var len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
  }

  // 保留了百度一样处理
  async function loop(index: number) {
    let query = qList[index];
    let salt = new Date().getTime();
    let curtime = Math.round(new Date().getTime() / 1000);

    await new Promise((resolve, reject) => {
      let str1 = appKey + truncate(query) + salt + curtime + key;
      let vocabId = '您的用户词表ID';
      let sign = SHA256(str1).toString(enc.Hex);

      const content = {
        q: query,
        appKey: appKey,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
        signType: 'v3',
        curtime: curtime,
        vocabId: vocabId,
      };
      const req = https.request(
        'https://openapi.youdao.com/api',
        {
          method: 'POST',
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
        (val: any) => {
          val.setEncoding('utf8');
          let rawData = '';

          val.on('data', (chunk: any) => {
            rawData += chunk;
          });

          val.on('end', () => {
            try {
              let result: ParamsZhiyi = JSON.parse(rawData);
              const { data } = result;
              // 把翻译的信息存到translationObj；
              for (let key in data.tgt) translationObj[key] = handleEn(data.tgt[key].tgt);

              setTimeout(() => {
                resolve(JSON.parse(rawData));
              }, 1000);
            } catch (error) {
              reject(error);
            }
          });

          val.on('error', (error: any) => {
            reject(error);
          });
        }
      );
      // write data to request body
      req.write(JSON.stringify(content));
      req.end();
    });
    if (index + 1 < qList.length) loop(index + 1);
    else Promise.resolve('完成');
  }
  if (qList.length > 0)
    try {
      await loop(0);
    } catch (error) {
      return Promise.reject();
    }
};

/**
 * 根据最大长度限制，拆分成多个query
 * @param list
 * @param maxLimit
 * @example splitArray(['123','12','2'],4) // ['123','122']
 */
const splitArray = (list: Array<string>, maxLimit: number) => {
  let splitList = [];
  // 临时字符串
  let arr = '';
  for (let val of list) {
    if (val.length > maxLimit) continue;
    let str = arr === '' ? val : arr + '\n' + val;
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
const handleEn = (str: string) => {
  return str.split(/\s+/).reduce((a, b) => a + handleSpecialSymbol(b.substring(0, 1).toUpperCase() + b.substring(1).toLowerCase()), '');
};
