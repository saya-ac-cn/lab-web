import React, {Component} from 'react';
import {Button, Col, Popover, Row, Menu} from 'antd';
import DocumentTitle from 'react-document-title'
import "./index.less"
import {WechatOutlined, GithubOutlined} from '@ant-design/icons';
import frontendMenuListV2 from '../../../config/menuConfig'
import {Link, Redirect, Route, Switch} from "react-router-dom";
import NewsList from '../../news'
import NoteList from '../../note'
import NewsInfo from '../../newsInfo'
import NoteInfo from '../../noteInfo'
import Plan from '../../plan'
import About from '../../about'
import Growing from '../../growing'
const content = (
  <div style={{width:"10em",height:"10em",backgroundSize:"100%",backgroundImage:`url(${process.env.PUBLIC_URL}/picture/wx/wechat.png)`}}>
  </div>
);

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

	componentWillMount() {
    console.log(navigator.userAgent)
		if (/(Android|iPhone|iPod|iOS)/i.test(navigator.userAgent)) { //判断Android|iPhone|iPod|iOS
			// 弹出提示后，强行跳转
		 	alert("亲爱的访客，您好！本站不支持移动设备打开，建议您使用PC端进行访问。");
			//console.log("移动端");
		} else if (/(iPad)/i.test(navigator.userAgent)) { //判断iPad
		 	console.log("iPad");
		} else { //pc
			console.log("PC");
		}
    let _this = this; //声明一个变量指向vue实例this,保证作用域一致
    _this.menuNodes = _this.getMenuNodes(frontendMenuListV2)
	};

    /*
    执行异步任务: 发异步ajax请求
     */
    componentDidMount() {

    };

	render() {
		return (
			<DocumentTitle title='亲亲里'>
				<section className="frontend-container">
          {/*顶部菜单开始*/}
          <div className='frontend-menu'>
            <div className='frontend-menu-logo' style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/project.svg')`}}></div>
            <Menu mode='horizontal'>
              {
                this.menuNodes
              }
            </Menu>
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
            <Switch>
              {/*<Route path='/pandora/files' component={FilesDownload}/>*/}
              <Route path='/pandora/news' exact={true} component={NewsList}/>
              <Route path='/pandora/news/:id' component={NewsInfo}/>
              <Route path='/pandora/note' exact={true} component={NoteList}/>
              <Route path='/pandora/note/:id' component={NoteInfo}/>

              {/*<Route path='/pandora/newsInfo/:id' component={NewsInfo}/>*/}
              <Route path='/pandora/growing' component={Growing}/>
              <Route path='/pandora/plan' component={Plan}/>
              <Route path='/pandora/me' component={About}/>
              {/*默认、及匹配不到时的页面*/}
              <Redirect to='/404'/>
            </Switch>
					</section>
					{/*版权区域开始*/}
					<footer>
						{/*版权区域图片*/}
                <div className="frontend-copyright"></div>
                <div className="frontend-copyright-content">
                  <Row>
                      <Col span={18}>
                         <p>
                            Copyright &copy; 2016-{(new Date()).getFullYear() } Saya.ac.cn-亲亲里 All rights reserved 国家工信部域名备案信息：[saya.ac.cn/蜀ICP备19027394号]
                         </p>
                         <p>
                            通讯地址：四川省宜宾市五粮液大道东段酒圣路8号(宜宾学院本部) 邮编：644000 Email：saya@saya.ac.cn
                         </p>
                          <p>
                            建议您使用Google Chrome，分辨率1920*1080及以上浏览，获得更好用户体验
                         </p>
                      </Col>
                      <Col span={6}>
                      <Popover content={content}>
                        <WechatOutlined type="wechat" style={{ fontSize: '1.5em', color: '#9cb17e' }}/>
                      </Popover>
                      <Button target="_blank" href="https://github.com/saya-ac-cn" type="link" style={{marginLeft:"1em"}}>
                        <GithubOutlined style={{fontSize: '1.5em', color: '#9cb17e' }}/>
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
