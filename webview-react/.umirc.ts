/*
 * @Author: zdd
 * @Date: 2023-06-17 09:58:32
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-19 19:59:27
 * @FilePath: /vg-vscode-extension/webview-react/.umirc.ts
 * @Description: 
 */
import { defineConfig } from '@umijs/max';
import path from 'path';

export default defineConfig({
  alias: {
    ReactDOM: path.join(__dirname, `node_modules/react-dom`),
    React: path.join(__dirname, `node_modules/react`),
  },
  antd: {},
  theme: { '@primary-color': '#1DA57A' },
  plugins: ['umi-plugin-keep-alive'],
  access: {},
  dva: {},
  model: {},
  initialState: {},
  styleLoader: {},
  request: {},
  layout: {
    title: 'Vg Code',
  },
  routes: [
    {
      path: '/',
      redirect: '/schema2code',
    },
    {
      hideInMenu: true,
      name: 'snippets',
      path: '/snippets',
      component: './snippets',
    },
    {
      hideInMenu: true,
      name: '代码片段详情',
      path: '/material-detail/:name',
      component: './materials/detail',
    },
    {
      hideInMenu: true,
      name: '创建代码片段',
      path: '/material-create',
      component: './materials/create',
    },
    {
      name: 'schema2code',
      path: '/schema2code',
      component: './schema2code',
    },
    {
      name: '物料中心',
      path: '/materials',
      component: './materials',
    },
    {
      name: '脚手架',
      path: '/scaffold',
      component: './scaffold',
    },
    {
      name: '讯飞大模型',
      path: '/aigc_code',
      component: './aigc_code',
    },
    {
      name: '项目配置',
      path: '/config',
      component: './config',
    }
  ],
  npmClient: 'pnpm',
  mfsu: false,
  history: {
    type: 'hash',
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
    // memo.resolve.alias
    //   .set('ReactDOM', path.join(__dirname, `node_modules/react-dom`));

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
  },
  cssLoaderModules: {
    exportLocalsConvention: 'camelCase'
  }
});

