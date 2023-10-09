export interface IMessage<T = any> {
  cmd: string;
  cbid: string;
  data: T;
}

export type MaterialType = 'swagger2api' | 'schema2code' | 'blocks' | 'snippets';
