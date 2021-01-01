import React, {Component} from 'react';
import frontendMenuListV1 from '../../../config/frontendMenuConfig1'
import './index.less'
import {Redirect, Route, Switch, Link} from 'react-router-dom'
import {Menu, Row, Col} from "antd";
import FilesDownload from '../../v1/files'
import NewsList from '../../v1/news'
import NewsInfo from '../../v1/newsInfo'
import NoteList from '../../v1/note'
import NoteInfo from '../../v1/noteInfo'
import Plan from '../../v1/plan'
import Board from '../../v1/board'
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
            pre.push( <Menu.Item key={item.key}><Link to={item.key}>{item.title}</Link></Menu.Item>)
            return pre
        },[])
    }

    /*
    * 为第一次render()准备数据
    */
    componentWillMount() {
        let _this = this; //声明一个变量指向vue实例this,保证作用域一致
        _this.menuNodes = _this.getMenuNodes(frontendMenuListV1)
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
                        <Route path='/v1/pandora/files' component={FilesDownload}/>
                        <Route path='/v1/pandora/news' component={NewsList}/>
                        <Route path='/v1/pandora/note' component={NoteList}/>
                        <Route path='/v1/pandora/newsInfo/:id' component={NewsInfo}/>
                        <Route path='/v1/pandora/noteInfo/:id' component={NoteInfo}/>
                        <Route path='/v1/pandora/plan' component={Plan}/>
                        <Route path='/v1/pandora/board' component={Board}/>
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
                                    Copyright &copy; 2016-{(new Date()).getFullYear() } Saya.ac.cn-亲亲里 All rights reserved<br/>
                                    国家工信部域名备案信息：[Saya.ac.cn/蜀ICP备19027394号]<br/>
                                    saya@Saya.ac.cn
                                </p>
                            </Col>
                            <Col xs={12} sm={12} md={8} xl={8}>
                                <p>
                                    地址：四川省成都市金牛区兴平路100号<br/>
                                    邮编：610036<br/>
                                    {/*<a href="/pandora/board">网站建议</a>*/}
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
