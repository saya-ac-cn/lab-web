import React, { Component } from 'react';
import DocumentTitle from "react-document-title";
import "./index.less"
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/8/30 - 2:56 下午
 * 描述：
 */

// 定义组件（ES6）
class Egg extends Component {


    render() {
        return (
            <DocumentTitle title="技术彩蛋">
                <div className="frontend-egg">
                    <div className="child-container">
                        <div className="column-title">
                            技术彩蛋
                        </div>
                        <div className="egg-web">
                            <article>
                                哈喽，欢迎来到技术彩蛋单元。本页面主要是分享一些互联网开发中相关的工具，不限于工作和开发、不限于前后端，相信总有一个惊艳到你！
                            </article>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Egg;
