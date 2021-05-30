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
            <DocumentTitle title="saya.ac.cn-技术彩蛋">
                <div className="frontend-egg">
                    <div className="child-container">
                        <div className="column-title">
                            技术彩蛋
                        </div>
                        <div className="egg-web">

                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Egg;