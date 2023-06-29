/*
 * @Author: zdd
 * @Date: 2023-06-27 22:01:26
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-28 17:30:23
 * @FilePath: /vg-vscode-extension/webview-react/src/models/global.ts
 * @Description: 
 */
// 全局共享数据示例
import { DEFAULT_NAME } from '@/common';
import { useState } from 'react';

const useUser = () => {
  const [name, setName] = useState<string>(DEFAULT_NAME);
  return {
    name,
    setName,
  };
};

export default useUser;
