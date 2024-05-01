import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React from "react";
import Home from "@/pages/home";
import Frontend from "@/pages/layout/frontend1";
import NotFound from "@/pages/404";
import {Navigate} from "react-router";
import 'antd/dist/antd.less'
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
                <Route path='/' exact={true} element={<Home/>}/>
                <Route path='/public/*' element={<Frontend/>}/>
                <Route path='/404' exact={true} element={<NotFound/>}/>
                {/*/!*默认、及匹配不到时的页面*!/*/}
                <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App