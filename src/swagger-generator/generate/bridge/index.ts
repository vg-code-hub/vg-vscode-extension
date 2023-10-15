import { TypeParam } from '@root/swagger-generator/utils';
import { Method } from 'axios';
import { JSONSchema, SwaggerParameter, IParameter, IDescriptionOption } from '../../index.d';

export * from './dart_imp';
export * from './ts_imp';

// 实现接口角色
export interface PlatformImplementor {
  swagger2apiMaterialPath: string;
  baseTypes: string[];
  fileExtension: string;
  formDataType: string;
  getSchameType: ({ key, property, param }: TypeParam) => string;
  isArrPropType: (propType: string) => boolean;

  /**
   * Generates the request header for a specific file.
   *
   * @param {string} fileHeader - The file header string.
   * @param {number} deeps - The number of deeps.
   * @param {string} className - The name of the class.
   * @return {string} The generated request header.
   */
  getReqHeader(fileHeader: string, deeps: number, className: string): string;

  /**
   * Returns the class name from a given name, removing the 'List<' prefix and '>' suffix if present.
   *
   * @param {string} name - The name of the class.
   * @return {string} The modified class name.
   */
  arraySubClass(name: string): string;

  /**
   * Generates the content of the index file.
   *
   * @param {string} path - The path to the directory.
   * @param {boolean} hasModel - Indicates if the directory has a model.
   * @return {string} The generated content of the index file.
   */
  getIndexFileContnet(path?: string, hasModel?: boolean): string;

  /**
   * Writes a file with the given options.
   *
   * @param {boolean} overwrite - Whether to overwrite an existing file.
   * @param {string} dirPath - The directory path where the file should be written.
   * @param {Object} options - The options for writing the file.
   * @param {boolean} options.modelEmpty - Whether the model content is empty.
   * @param {string} options.apiContent - The content of the API.
   * @param {string} options.modelContent - The content of the model.
   */
  wirtFile(overwrite: boolean, dirPath: string, options: { sharedModelNames: string[]; apiContent: string; modelContent: string; deeps: number }): void;

  /**
   * Generates the function comment for the given function body.
   *
   * @param {SwaggerParameter} p - the Swagger parameter object
   * @return {{ name: string, type: string, description: string }} - an object containing the name, type, and description
   */
  pathParam(p: SwaggerParameter): IParameter;

  /**
   * Generates the content for an enum model based on the given class name and JSON schema value.
   *
   * @param {string} className - The class name.
   * @param {JSONSchema} value - The JSON schema value.
   * @return {string} The generated enum model content.
   */
  getEnumModelContent(className: string, value: JSONSchema): string;

  /**
   * Generates the content for an model based on the given class name and JSON schema value.
   *
   * @param {string} className - The class name.
   * @param {JSONSchema} value - The JSON schema value.
   * @return {string} The generated enum model content.
   */
  getModelContent(className: string, value: JSONSchema): string;

  /**
   * A description of the entire function.
   *
   * @param {IDescriptionOption} options - The options object containing the function parameters.
   * @param {string} options.summary - The summary of the function.
   * @param {string} options.description - The description of the function.
   * @param {string} options.operationId - The operation id of the function.
   * @param {string} options.returnType - The return type of the function.
   * @param {Array<{type: string, require: boolean, name: string, description: string}>} options.paths - The array of path parameters.
   * @param {Array<{type: string, require: boolean, name: string, description: string}>} options.querys - The array of query parameters.
   * @param {{type: string, name: string, description: string}} options.formData - The form data parameter.
   * @param {{type: string, name: string, description: string}} options.body - The body parameter.
   * @returns {string} The function description.
   */
  getDescription(options: IDescriptionOption): string;

  /**
   * Retrieves the function arguments based on the provided options.
   *
   * @param {Pick<IDescriptionOption, 'formData' | 'body' | 'paths' | 'querys'>} options - The options object containing the formData, body, paths, and querys properties.
   * @returns {string} A string representation of the function arguments.
   */
  getFunctionArgs(options: Pick<IDescriptionOption, 'formData' | 'body' | 'paths' | 'querys'>): string;

  /**
   * Returns the simple return type of the function.
   *
   * @param {JSONSchema | undefined} responses - The JSON schema or undefined.
   * @param {string} name - The name of the function.
   * @return {string} - The simple return type of the function.
   */
  getSimpleReturnType(responses: JSONSchema | undefined, name: string): string;

  /**
   * Computes and returns the return type of the function.
   *
   * @param {JSONSchema | undefined} responses - The responses parameter is used to compute the return type.
   * @param {string} resClassName - The resClassName parameter is used to compute the return type.
   * @return {string} The return type of the function.
   */
  getReturnType(responses: JSONSchema | undefined, resClassName: string): string;

  /**
   * Generates the request arguments for the given key, method, and options.
   *
   * @param {string} key - The key for the request.
   * @param {Method} method - The HTTP method for the request.
   * @param {Pick<IDescriptionOption, 'formData' | 'body' | 'paths' | 'querys'>} options - The options for the request.
   * @return {string} The generated request arguments.
   */
  getReqArgs(key: string, method: Method, options: Pick<IDescriptionOption, 'formData' | 'body' | 'paths' | 'querys'>): string;

  /**
   * Generate the content to be returned based on the responses and result class name.
   *
   * @param {JSONSchema | undefined} responses - The responses JSON schema.
   * @param {string} resClassName - The result class name.
   * @return {string} The content to be returned.
   */
  getReturnContent(responses: JSONSchema | undefined, resClassName: string): string;
}
