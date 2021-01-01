/**
 * 入口js
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './console'


// 国际化设置，设置中文
// 将App组件标签渲染到index页面的div上
ReactDOM.render(
<ConfigProvider locale={zhCN}>
  <App/>
  </ConfigProvider>, document.getElementById('root'));
