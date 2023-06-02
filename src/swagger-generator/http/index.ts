/*
 * @Author: zdd
 * @Date: 2023-06-01 16:31:38
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-01 17:52:58
 * @FilePath: /vg-vscode-extension/src/swagger-generator/http/index.ts
 * @Description: 
 */
import axios from "axios";

import { Swagger } from "../index.d";

export async function getSimpleData(url: string): Promise<Swagger> {
  try {
    const { data } = await axios.get(url);
    if (data.swagger?.split(".")[0] - 0 !== 2)
      swagger3to2(data);

    return {
      jsonUrl: url,
      swagger: data.swagger || "2.0",
      info: data.info,
      tags: data.tags,
      paths: data.paths,
      data: data.definitions
    };
  } catch (error) {
    const info = `服务地址可能错误，导致未能正确获取信息。（${url}）`;
    console.log(`\x1B[31m${info}\x1B[39m`);
    throw Error(info);
  }
}


export const swagger3to2 = (data: any) => {
  let schemas = data.components.schemas;
  let paths = data.paths;

  if (schemas)
    for (let key in schemas) {
      const properties = schemas[key].properties;
      if (properties)
        for (let key2 in properties) {
          if (properties[key2].$ref)
            properties[key2].$ref = properties[key2].$ref.replace(
              /components\/schemas/g,
              "definitions"
            );

          if (properties[key2]?.items?.$ref)
            properties[key2].items.$ref = properties[
              key2
            ].items.$ref.replace(
              /components\/schemas/g,
              "definitions"
            );

        }

    }

  data.definitions = schemas;
  data.swagger = 3;
  if (paths)
    for (let key in paths) {
      let path = paths[key];
      for (let key2 in path) {
        let methodData = path[key2];
        methodData.consumes = [];
        methodData.parameters = methodData.parameters || [];
        if (methodData.requestBody) {
          const { content } = methodData.requestBody;

          for (let key in content) {
            methodData.consumes.push(key);
            methodData.parameters.push({
              in: "body",
              name: "",
              contentType: key,
              required: true,
              schema:
                content[key].schema?.$ref?.replace(
                  /components\/schemas/g,
                  "definitions"
                ) || null,
            });
          }
        }
        if (methodData.responses) {
          let keys = Object.keys(
            methodData.responses["200"]?.content || {}
          );
          if (keys.length > 0) {
            let obj =
              methodData.responses["200"].content?.[keys[0]];
            methodData.responses["200"] = obj;
            if (methodData.responses["200"].schema?.$ref)
              methodData.responses["200"].schema.$ref =
                methodData.responses[
                  "200"
                ].schema?.$ref?.replace(
                  /components\/schemas/g,
                  "definitions"
                ) || null;

            if (methodData.responses["200"].schema?.items?.$ref)
              methodData.responses["200"].schema.items.$ref =
                methodData.responses[
                  "200"
                ].schema.items.$ref?.replace(
                  /components\/schemas/g,
                  "definitions"
                ) || null;


            delete methodData.responses["200"].content;
          }
        }
      }
    }

  data.components && delete data.components;
};
