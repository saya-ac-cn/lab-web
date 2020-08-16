# 项目说明

本项目作为个人网站前端部分项目，主题采用react+less+antd。其中第一个tag版本作为标准化的模板项目，可以直接使用。

## 重要说明！！！
* 本版本使用了较高版本的antd，不完全兼容上一个版本
* 页面路由绝对禁止出现/backend、/frontend、/warehouse（远景包括map）
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

### 创建一个react项目
```shell script
 npx create-react-app frontend
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
* 修改config-overrides.js

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

### 安装MarkDown
```shell script
  npm install for-editor
```

## 安装react-document-title用于设置页面标题
```shell script
   npm install --save react-document-title
```

## 安装jsonp
```shell script
    npm install jsonp --save
```

### 重大变更历程事件

> ## 2020-08-16 修改记录-重大修改
* 完成项目初始架构，及标准化模板构建
* 标准化模板版本号1.0.0.0816(20200816)
