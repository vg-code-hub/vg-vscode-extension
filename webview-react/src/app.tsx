/*
 * @Author: zdd
 * @Date: 2023-06-27 22:01:26
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-29 16:48:16
 * @FilePath: /vg-vscode-extension/webview-react/src/app.tsx
 * @Description: 
 */
// 运行时配置
import { RunTimeLayoutConfig } from '@umijs/max';
import { theme } from 'antd';
import './app.less';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout: RunTimeLayoutConfig = () => {
  const { token } = theme.useToken();

  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    layout: 'top',
    fixedHeader: true,
    actionsRender: () => [<div></div>],
    token: {
      header: {
        colorMenuBackground: token.colorBgContainer,
        colorBgMenuItemSelected: token.colorPrimaryBg,
        colorTextMenuSelected: token.colorPrimary,
        colorTextCollapsedButton: token.colorPrimary,
        colorTextCollapsedButtonHover: token.colorPrimaryBgHover,
      },
      sider: {
        colorMenuBackground: token.colorBgContainer,
        colorBgMenuItemSelected: token.colorPrimaryBg,
        colorTextMenuSelected: token.colorPrimary,
        colorTextCollapsedButton: token.colorPrimary,
        colorTextCollapsedButtonHover: token.colorPrimaryBgHover,
      },
    },
  };
};
