import React, {Component} from 'react';
import './index.less'
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/7/18 - 10:33 上午
 * 描述：
 */

// 定义组件（ES6）
class Financial extends Component {

    constructor(props) {
        super(props)
    }


    render() {
        return (
            <div className='child-container'>
                <div className='header-tools'>
                    财政中心
                </div>
                <div className='child-content'>
                    <div>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                        财政<br/>
                    </div>
                </div>
            </div>
        );
    }
}

// 对外暴露
export default Financial;
