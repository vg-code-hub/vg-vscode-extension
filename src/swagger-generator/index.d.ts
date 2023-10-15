/*
 * @Author: zdd
 * @Date: 2023-06-01 16:34:25
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-10-15 15:39:42
 * @FilePath: /vg-vscode-extension/src/swagger-generator/index.d.ts
 * @Description:
 */

export type ProjectType = 'entitys' | 'requests';
type Type = 'string' | 'number' | 'integer' | 'object' | 'array' | 'boolean' | 'null' | 'file';

// https://apifox.com/help/reference/json-schema
interface JSONSchema {
  $ref?: string;
  // Apifox Swagger 扩展: 接口所属目录
  'x-apifox-folder'?: string;
  'x-enum-comments'?: Record<string, string>;
  'x-enum-varnames'?: string[];
  title?: string;
  description?: string;
  format?: string;
  type?: Type | Type[];
  // string 限定长度
  minLength?: number;
  // string 限定长度
  maxLength?: number;
  // string 模式匹配
  pattern?: string;
  // 值的枚举
  enum?: Type[];
  // multipleOf 数字倍数
  multipleOf?: number;
  // number 限定范围
  minimum?: number;
  // number 限定范围
  maximum?: number;
  // exclusiveMaximum 为 true 表示不包含边界值 maximum，类似的还有 exclusiveMinimum 字段.
  exclusiveMaximum?: boolean;
  // exclusiveMaximum 为 true 表示不包含边界值 maximum，类似的还有 exclusiveMinimum 字段.
  exclusiveMinimum?: boolean;
  // object 字段 properties
  properties?: Record<string, JSONSchema>;
  // object 是否允许有额外的字段
  // "additionalProperties": { "type": "string" }
  additionalProperties?: boolean | { type: Type };
  // object 必填字段
  required?: string[];
  // object 指定属性个数
  minProperties?: number;
  // object 指定属性个数
  maxProperties?: number;
  // dependentRequired 要求，如果对象中存在给定属性，则必须存在某些属性
  dependentRequired?: Record<string, string[]>;
  // Object 属性的模式匹配
  patternProperties?: Record<string, JSONSchema>;
  // array 指定数组成员类型
  // array 指定数组成员类型，逐个指定
  items?: JSONSchema;
  // array 指定数组成员类型，逐个指定，严格限定
  additionalItems: boolean;
  // array 数组长度限制
  minItems?: number;
  maxItems?: number;
  // array element uniqueness 数组元素的唯一性
  uniqueItems?: boolean;
  // schema 的合并
  // anyOf 包含了多条规则，符合任意一条即可
  anyOf?: JSONSchema[];
  /** allOf 是要满足所有 Schema */
  allOf?: JSONSchema[];
  // oneOf 是满足且只满足一个
  oneOf?: JSONSchema[];
  // 只要是非 xxx 类型即可
  not?: JSONSchema;
}

export interface SwaggerHttpEndpoint {
  tags: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  produces: Producers[];
  parameters: SwaggerParameter[];
  successResponse?: JSONSchema;
  deprecated: boolean;
  'x-apifox-folder'?: string;
}

type Consumers = 'application/json' | 'text/json' | 'application/xml' | 'text/xml' | 'application/x-www-form-urlencoded';
type Producers = 'application/json' | 'text/json' | 'application/xml' | 'text/xml';

export type SwaggerPath = Swagger['paths'];
export type Method = keyof SwaggerPath[''];
export type SwaggerParameter = Pick<JSONSchema, 'type' | 'description' | 'format' | 'items' | '$ref'> & {
  name: string;
  in: 'path' | 'query' | 'body' | 'formData' | 'header';
  contentType: 'multipart/form-data' | 'application/json';
  required: boolean;
  schema?: JSONSchema;
};

export interface Swagger {
  jsonUrl: string;
  data: Record<string, JSONSchema>;
  paths: {
    [endpointPath: string]: {
      get: SwaggerHttpEndpoint;
      post: SwaggerHttpEndpoint;
      put: SwaggerHttpEndpoint;
      delete: SwaggerHttpEndpoint;
    };
  };
  tags: Array<{ name: string; description?: string }>;
  info: {
    title: string;
    description: string;
    version: string;
  };
}

export interface IParameter {
  name: string;
  orgKey: string;
  type: string;
  description: string | undefined;
  require: boolean;
  schema?: JSONSchema;
}
export interface IDescriptionOption {
  summary?: string;
  description?: string;
  operationId?: string;
  returnType: string;
  paths: IParameter[];
  querys: IParameter[];
  formData?: IParameter;
  body?: IParameter;
}

export type FilesMap = Record<string, [api: string, model: [name: string, content: string][], deeps: number]>;

export type FilesMapModel = FilesMap[1][1];
