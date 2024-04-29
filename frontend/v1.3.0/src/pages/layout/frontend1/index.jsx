import React, {Component} from 'react';
import {Button, Col, Popover, Row, Menu} from 'antd';
import DocumentTitle from 'react-document-title'
import "./index.less"
import {WechatOutlined, GithubOutlined} from '@ant-design/icons';
import frontendMenuList from '../../../config/menuConfig'
import {Route, Routes} from 'react-router-dom'
import About from '../../about'
import NewsList from '../../news'
import NoteList from '../../note'
import NewsInfo from '../../newsInfo'
import NoteInfo from '../../noteInfo'
import Plan from '../../plan'
import Growing from '../../growing'
import File from '../../file'
import Egg from "../../egg";

const content = (
    <div style={{
        width: "10em",
        height: "10em",
        backgroundSize: "100%",
        backgroundImage: `url(/img/wx/wechat.png)`
    }}>
    </div>
);

// 定义组件（ES6）
class Frontend extends Component {

    constructor(props) {
        super(props);
        this.state = {menu:[]}
    }

    /**
     * 根据menu的数据数组生成对应的标签数组使用reduce() + 递归调用
     * @param menuList
     */
    initMenuNodes = (menuList) => {
        const menu = menuList.reduce((pre, item) => {
            pre.push({ label: <a href={item.key}>{item.title}</a>, key: item.key });
            return pre
        }, []);
        this.setState({menu});
    }

    /**
     * 为第一次render()准备数据
     * 因为要异步加载数据，所以方法改为async执行
     */
    componentDidMount() {
        if (/(Android|iPhone|iPod|iOS)/i.test(navigator.userAgent)) { //判断Android|iPhone|iPod|iOS
            // 弹出提示后，强行跳转
            alert("亲爱的访客，您好！本站不支持移动设备打开，建议您使用PC端进行访问。");
            //console.log("移动端");
        } else if (/(iPad)/i.test(navigator.userAgent)) { //判断iPad
            console.log("iPad");
        } else { //pc
            console.log("PC");
        }
        let _this = this;
        _this.initMenuNodes(frontendMenuList)
    };

    render() {
        let {menu} = this.state;
        return (
            <DocumentTitle title='亲亲里'>
                <section className="frontend-container">
                    {/*顶部菜单开始*/}
                    <div className='frontend-menu'>
                        <div className='frontend-menu-logo' style={{backgroundImage: `url('/img/svg/project.svg')`}}></div>
                        <Menu mode='horizontal' items={menu}></Menu>
                    </div>
                    {/*页头区域开始*/}
                    <header>
                        {/*网站欢迎部分开始*/}
                        <div className="frontend-banner">
                        </div>
                        {/*网站欢迎部分结束*/}
                    </header>
                    {/*页头区域结束*/}
                    <section className="frontend-main">
                        <Routes>
                            <Route path='/news' exact element={<NewsList/>}/>
                            <Route path='/news/:id' element={<NewsInfo/>}/>
                            <Route path='/note' exact={true} element={<NoteList/>}/>
                            <Route path='/note/:id' element={<NoteInfo/>}/>
                            <Route path='/growing' element={<Growing/>}/>
                            <Route path='/plan' element={<Plan/>}/>
                            <Route path='/files' element={<File/>}/>
                            <Route path='/egg' element={<Egg/>}/>
                            <Route path='/me' element={<About/>}/>
                            {/*默认、及匹配不到时的页面*/}
                            {/*<Redirect to='/404'/>*/}
                        </Routes>
                    </section>
                    {/*版权区域开始*/}
                    <footer>
                        {/*版权区域图片*/}
                        <div className="frontend-copyright"></div>
                        <div className="frontend-copyright-content">
                            <Row>
                                <Col span={18}>
                                    <p>
                                        Copyright &copy; 2016-{(new Date()).getFullYear()} Saya.ac.cn-亲亲里 All rights
                                        reserved 国家工信部域名备案信息：[<a href="https://beian.miit.gov.cn/"
                                                                 rel="noopener noreferrer"
                                                                 target='_blank'>saya.ac.cn/蜀ICP备2021013893号-1</a>]
                                    </p>
                                    <p>
                                        通讯地址：四川省宜宾市五粮液大道东段酒圣路8号 邮编：644000 Email：saya@saya.ac.cn
                                    </p>
                                    <p>
                                        建议您使用Google Chrome，分辨率1920*1080及以上浏览，获得更好用户体验
                                    </p>
                                </Col>
                                <Col span={6}>
                                    <Popover content={content}>
                                        <WechatOutlined type="wechat" style={{fontSize: '1.5em', color: '#9cb17e'}}/>
                                    </Popover>
                                    <Button target="_blank" href="https://github.com/saya-ac-cn" type="link"
                                            style={{marginLeft: "1em"}}>
                                        <GithubOutlined style={{fontSize: '1.5em', color: '#9cb17e'}}/>
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </footer>
                    {/*版权区域结束*/}
                </section>
            </DocumentTitle>
        )
    }

}

export default Frontend;
