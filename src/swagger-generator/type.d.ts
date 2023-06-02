/*
 * @Author: zdd
 * @Date: 2023-05-31 22:10:27
 * @LastEditors: zdd
 * @LastEditTime: 2023-05-31 22:42:03
 * @FilePath: /vg-vscode-extension/src/json2dart/type.d.ts
 * @Description: 
 */

type Type = 'int32' | 'int64' | 'float' | 'double' | 'string' | 'byte' | 'binary' | 'date-time' | 'date' | 'password' | 'boolean' | 'object' | 'array' | 'any' | 'null' | 'file' | 'base64' | 'uuid';
type Schema = {
  type: string
  format?: Type
  items?: {
    type: string
    enum?: string[]
    default?: string
    collectionFormat?: string
  }
  $ref?: string
  required: string[]
  properties: {
    [key: string]: Schema
  }
  xml: {
    name?: string
    namespace?: string
    prefix?: string
    attribute?: string
    wrapped?: boolean
    explicit?: boolean
    version?: string
    encoding?: string
    standalone?: string
  }
  [key: string]: any
}
type ContentType = "multipart/form-data" | "application/xml" | "application/json" | "application/x-www-form-urlencoded" | "text/plain" | "text/html" | "*/*"
type Method = 'post' | 'get' | 'put' | 'delete';
interface Parameter {
  name: string
  in: string
  description: string
  required: boolean
  type: string
  format?: string
  schema?: Schema
  items?: {
    type: string,
    enum: string[],
    default: string
  }
  collectionFormat: string
}

type PathItem = {
  [key in Method]: {
    tags: string[]
    summary: string
    description: string
    operationId: string
    consumes: ContentType[]
    produces: ContentType[]
    parameters: Parameter[]
    responses: {
      200: {
        description: string
        schema: Schema
      }
      400: {
        description: 'Invalid ID supplied'
      }
      401: {
        description: string
      }
      404: {
        description: 'not found'
      }
      405: {
        description: "Invalid input" | 'Validation exception'
      }
      500: {
        description: string
      }
    }
    security: {
      [key: string]: string[] | undefined
    }
  };
};

export interface SwaggerJson {
  host: string
  basePath: string
  tags: Array<{
    name: string
    description: string
  }>
  paths: {
    [key: string]: PathItem;
  }
  securityDefinitions: {
    [key: string]: {
      type: string
      description: string
      name: string
    }
  }
  definitions: {
    [key: string]: Schema
  }
}