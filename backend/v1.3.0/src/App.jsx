import {BrowserRouter, Route, Routes} from 'react-router-dom'
import BackendV1 from './pages/layout/backend-v1'
import React from "react";
import Login from "@/pages/login";

/**
 * 应用根组件
 * @returns {*}
 * @constructor
 */

function App() {

    return (
        <BrowserRouter>
            {/*
            *只匹配其中一个，匹配到了就显示
            *重要说明！！！
            *因为，后台已对「/backend1，/frontend，/warehouse」接口代理,页面路由绝对禁止出现/backend1、/frontend、/warehouse（远景包括map）
            *在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
            */}
            <Routes>
                {/*要嵌套的路由这里一定要写/*  为了告诉这个路由后续会跟着其它路径*/}
                <Route path='/' exact={true} element={<Login/>}/>
                <Route path="/backstage/*" element={<BackendV1/>}/>
                {/*<Route path='/menu' element={<Menu/>}/>*/}
                {/*<Route path='/root' element={<Dashboard/>}/>*/}
            </Routes>
        </BrowserRouter>
    )
}

export default App
