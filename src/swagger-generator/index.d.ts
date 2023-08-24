/*
 * @Author: zdd
 * @Date: 2023-06-01 16:34:25
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-12 18:38:05
 * @FilePath: /vg-vscode-extension/src/swagger-generator/index.d.ts
 * @Description: 
 */

export interface Schema {
    $ref?: string;
    oneOf?: Schema[];
    type?: string;
}

export interface Swagger {
    jsonUrl: string;
    data: SwaggerSchemas;
    paths: {
        [endpointPath: string]: {
            get: SwaggerHttpEndpoint;
            post: SwaggerHttpEndpoint;
            put: SwaggerHttpEndpoint;
            delete: SwaggerHttpEndpoint;
        };
    };
    swagger: 2 | 3;
    tags: Array<{ name: string; description?: string }>;
    info: {
        title: string;
        description: string;
        version: string;
    };
}


export interface SwaggerSchemas {
    [namespace: string]: SwaggerSchema;
}

export interface SwaggerSchema extends Schema {
    properties: SwaggerSchemaProperties;
    // description?: string;
    required?: (keyof SwaggerSchemaProperties)[];
    allOf?: SwaggerSchema[];
    enum?: string[];
    items: any
    "x-apifox-folder"?: string;
}

export interface SwaggerSchemaProperties {
    [propertyName: string]: SwaggerPropertyDefinition;
}

export interface SwaggerPropertyDefinition extends SwaggerSchema {
    description?: string;
    title?: string;
    maxLength?: number;
    minLength?: number;
    maximum?: number;
    minimum?: number;
    format?: string;
    pattern?: string;
    items: SwaggerSchema;
    schema?: SwaggerSchema | string // swagger3
    readonly?: boolean;
    enum?: string[];
    anyOf?: SwaggerPropertyDefinition[]
    "x-apifox-refs"?: Record<string, any>
    "x-apifox-orders"?: string[]
}


export interface SwaggerHttpEndpoint {
    tags: string[];
    summary?: string;
    description?: string;
    operationId: string;
    consumes: Consumers[];
    produces: Producers[];
    parameters: {
        name: string;
        in: 'path' | 'query' | 'body' | 'formData';
        contentType: 'multipart/form-data' | 'application/json';
        required: boolean;
        description?: string;
        type?: string;
        format?: string;
        items?: SwaggerSchema;
        schema?: SwaggerSchema;
        maxLength?: number;
        minLength?: number;
    }[];
    responses: {
        [httpStatusCode: string]: {
            description: string;
            schema: SwaggerSchema;
        };
    };
    deprecated: boolean;
    'x-apifox-folder'?: string
}

type Consumers =
    | 'application/json'
    | 'text/json'
    | 'application/xml'
    | 'text/xml'
    | 'application/x-www-form-urlencoded';
type Producers = 'application/json' | 'text/json' | 'application/xml' | 'text/xml';

export type SwaggerPath = Swagger['paths'];
export type Method = keyof SwaggerPath[''];
export type Responses = SwaggerHttpEndpoint['responses'];