import React, {Component} from 'react';
import frontendMenuList from '../../../config/menuConfig'
import './index.less'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Menu, Row, Col} from "antd";
import FilesDownload from '../../files'
import NewsList from '../../news'
import NewsInfo from '../../newsInfo'
import NoteList from '../../note'
import NoteInfo from '../../noteInfo'
import Plan from '../../plan'
import Board from '../../board'
/*
 * 文件名：index.jsx
 * 作者：shmily
 * 创建日期：2020-08-16 - 19:53
 * 描述：
 */
// 定义组件（ES6）
class Frontend extends Component {

    state = {

    }

    /*
     根据menu的数据数组生成对应的标签数组
     使用reduce() + 递归调用
     */
    getMenuNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
          pre.push( <Menu.Item key={item.key}><a href={item.key}>{item.title}</a></Menu.Item>)
            return pre
        },[])
    }

    /*
    * 为第一次render()准备数据
    */
    componentWillMount() {
        let _this = this; //声明一个变量指向vue实例this,保证作用域一致
        _this.menuNodes = _this.getMenuNodes(frontendMenuList)
    };

    render() {
        return (
            <section className='frontend1-container'>
                {/*顶部菜单开始*/}
                <div className='frontend1-menu'>
                    <div className='frontend-menu1-logo' style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/project.svg')`}}></div>
                    <Menu mode='horizontal'>
                        {
                            this.menuNodes
                        }
                    </Menu>
                </div>
                {/*顶部菜单结束*/}
                {/*页头区域开始*/}
                <header>
                    {/*网站欢迎部分开始*/}
                    <div className="banner" style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/layout/banner.png')`}}>
                    </div>
                    {/*网站欢迎部分结束*/}
                </header>
                {/*页头区域结束*/}

                {/*主体部分开始*/}
                <section className="main-section">
                    <Switch>
                        <Route path='/pandora/files' component={FilesDownload}/>
                        <Route path='/pandora/news' component={NewsList}/>
                        <Route path='/pandora/note' component={NoteList}/>
                        <Route path='/pandora/newsInfo/:id' component={NewsInfo}/>
                        <Route path='/pandora/noteInfo/:id' component={NoteInfo}/>
                        <Route path='/pandora/plan' component={Plan}/>
                        <Route path='/pandora/board' component={Board}/>
                        {/*默认、及匹配不到时的页面*/}
                        <Redirect to='/'/>
                    </Switch>
                </section>
                {/*主体部分结束*/}

                {/*版权区域*/}
                <footer>
                    {/*版权区域图片*/}
                    <div className="copyright-img" style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/layout/copyright.png')`}}></div>
                    {/*版权区域主体*/}
                    <div className="copyright-content">
                        <Row>
                            <Col xs={0} sm={0} md={8} xl={8} className='copyright-logo'>
                                <div style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/project.svg')`}}></div>
                            </Col>
                            <Col xs={12} sm={12} md={8} xl={8}>
                                <p>
                                    Copyright &copy; 2016-{(new Date()).getFullYear() } Saya.ac.cn-极客印记 All rights reserved<br/>
                                    国家工信部域名备案信息：[<a href="https://beian.miit.gov.cn/" rel="noopener noreferrer" target='_blank'>Saya.ac.cn/蜀ICP备2021013893号-1</a>]<br/>
                                    saya@Saya.ac.cn
                                </p>
                            </Col>
                            <Col xs={12} sm={12} md={8} xl={8}>
                                <p>
                                    地址：四川省宜宾市五粮液大道东段酒圣路8号(宜宾学院本部)<br/>
                                    邮编：644000<br/>
                                </p>
                            </Col>
                        </Row>
                    </div>
                </footer>
            </section>
        );
    }
}

// 对外暴露
export default Frontend;
