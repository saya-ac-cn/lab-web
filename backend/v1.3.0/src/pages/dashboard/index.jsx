import React, {Component} from 'react';
import './index.less'
import storageUtils from '../../utils/storageUtils'

/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/7/18 - 10:33 上午
 * 描述：
 */

// 定义组件（ES6）
class DashBoard extends Component {

    constructor(props) {
        super(props)
    }


    render() {
        storageUtils.get(storageUtils.ACCESS_KEY)
        return (
            <div className='child-container'>
                <div className='header-tools'>
                    控制台
                </div>
                <div className='child-content'>
                    <div>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                        控制台<br/>
                    </div>
                </div>
            </div>
        );
    }
}

// 对外暴露
export default DashBoard;
