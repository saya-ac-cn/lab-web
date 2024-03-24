import React from 'react'
import ReactDOM from 'react-dom/client'
import {ConfigProvider} from 'antd';
import locale from 'antd/es/locale/zh_CN';
import App from './App'
import './index.css'
import 'moment/dist/locale/zh-cn';
/**
 * 入口js
 */
ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider locale={locale}>
        <App/>
    </ConfigProvider>
)
