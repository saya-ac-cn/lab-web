import {useLocation,useNavigate,useParams} from 'react-router'
import React from "react";
// ReactRouterV6获取当前路由参数
// https://blog.csdn.net/weixin_45620384/article/details/123747611
export default function withRouter(Child) {
    return (props) => {
        const location = useLocation();
        const navigate = useNavigate();
        const params = useParams()
        return <Child {...props} navigate={navigate} location={location} params={params}></Child>;
    }
}
