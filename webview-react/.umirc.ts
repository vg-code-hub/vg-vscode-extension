/*
 * @Author: zdd
 * @Date: 2023-06-17 09:58:32
 * @LastEditors: zdd
 * @LastEditTime: 2023-06-18 00:25:00
 * @FilePath: /vg-vscode-extension/webview-react/.umirc.ts
 * @Description: 
 */
import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  styleLoader: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
  ],
  npmClient: 'pnpm',
  mfsu: false,
  history: {
    type: 'hash',
  },
  targets: {
    ie: 11,
  },
  legacy: {
    nodeModulesTransform: true
  },
  outputPath: '../webview-dist',
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // codeSplitting: { jsStrategy: 'bigVendors' },
  extraBabelPlugins: ['babel-plugin-dynamic-import-node'],
  headScripts: process.env.NODE_ENV === 'production' ? false : [
    { src: '/vendors.js' },
    // { src: '/main.js' },
  ],
  chainWebpack(memo, args) {
    memo.optimization.splitChunks.merge({
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@antv|antd|@ant-design)/,
          priority: 10,
        },
        // lfpvendors: {
        //   name: 'vendors',
        //   chunks: 'all',
        //   test: /[\\/]node_modules[\\/](lodash|moment|react|dva|postcss|mapbox-gl)/,
        //   priority: 10,
        // },
        // 最基础的
        // 'async-commons': {
        //   // 其余异步加载包
        //   name: 'async-commons',
        //   chunks: 'async',
        //   minChunks: 2,
        //   priority: 2,
        // },
        // lfpcommons: {
        //   name: 'main',
        //   // 其余同步加载包
        //   chunks: 'all',
        //   // minChunks: 2,
        //   priority: 1,
        //   // 这里需要注意下，webpack5会有问题， 需加上这个 enforce: true，
        //   // refer: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/257#issuecomment-432594711
        //   enforce: true,
        // },
      },
    });
    return memo;
  },
});

