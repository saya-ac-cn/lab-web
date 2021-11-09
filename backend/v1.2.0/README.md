# 项目说明

本项目作为实验室运营后端项目，主题采用react+less+antd。其中第一个tag版本作为标准化的模板项目，可以直接使用。

## 重要说明！！！
* 本版本使用了较高版本的antd，不完全兼容上一个版本
* 页面路由绝对禁止出现/backend、/warehouse
* 在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404

## 构建步骤
### 检查镜像源，为了加速下载，请切换到国内。
```shell script
# 检查镜像源
  npm config get registry
  # 镜像源默认是：https://registry.npmjs.org/
  # 切换到阿里
  npm config set registry https://registry.npm.taobao.org
```
### 升级node->https://segmentfault.com/a/1190000021739166

### 创建一个react项目
```shell script
 create-react-app v1.2.0
```

### 安装antd
```shell script
   npm install antd
```

### 按需加载
```shell script
    npm install  react-app-rewired customize-cra babel-plugin-import
```
* 在根目录创建config-overrides.js文件，并写入内容
* 修改package.json文件
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
改为：
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
  目的是启动运行项目时加载config-overrides.js配置文件

### 自定义主题

```shell script
  npm install less less-loader
```
> 注意 less4.*版本 对于当前适配有问题（Unrecognized input. Possibly missing '(' in mixin call.），只能降低版本，问题反馈：https://github.com/ant-design/ant-design/issues/28427
* 修改config-overrides.js
``` javascript
/**
 * 针对antd按需加载配置
 */
const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
    // 针对antd实现按需打包: 根据import来打包(使用babel-plugin-import)
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,  // 自动打包相关的样式
    }),

    // 使用less-loader对源码中的less的变量进行重新指定
    addLessLoader({
        lessOptions:{
            javascriptEnabled: true,
            modifyVars: {'@primary-color': '#ED2553'}
        }
    }),
)
```

### 引入路由

```shell script
  npm add react-router-dom
```

### 安装 axios
```shell script
    npm add axios
```
### 安装 store
```shell script
    npm install store
```
### 安装 http-proxy-middleware 用于设置多个代理
```shell script
    npm install http-proxy-middleware
```

## 安装react-document-title用于设置页面标题
```shell script
   npm install --save react-document-title
```

## 安装cropper（图片裁剪）
```shell script
  npm install react-cropper
```

## 安装MarkDown（for-editor）
```shell script
  npm install for-editor -S
```

## 安装antd图表
```shell script
  npm install @ant-design/charts
```

### 重大变更历程事件

> ## 2021-01-31 修改记录-完成核心功能
* 完成数据统计功能
* 完成账单、动态以及笔记页面
* 改造菜单配置，使之支持一级菜单功能

> ## 2020-12-28 修改记录-项目初始化
* 完成项目初始架构，及标准化模板构建
* 标准化模板版本号1.0.0.0816(20200816)
https://detail.vip.com/detail-1710614587-6918962173439374363.html
https://detail.vip.com/detail-1710613857-6919159356746165185.html