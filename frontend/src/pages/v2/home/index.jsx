import React, { Component } from 'react';
import './index.less'
import DocumentTitle from "react-document-title";
import {Button, Col, Popover, Row} from "antd";
import {WechatOutlined, GithubOutlined} from '@ant-design/icons';
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/9/6 - 10:46 下午
 * 描述：https://blog.csdn.net/u012790987/article/details/47683625
 */
const content = (
  <div style={{width:"10em",height:"10em",backgroundSize:"100%",backgroundImage:`url(${process.env.PUBLIC_URL}/picture/wx/wechat.png)`}}>
  </div>
);
// 定义组件（ES6）
class Home extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount() {
    //监听窗口大小改变
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  componentWillUnmount() {
    //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('resize', this.handleResize.bind(this))
  }


  handleResize = e => {
    const _width = e.target.innerWidth
    // 总份数 宽 350份，最小正方形8x8，折合百分比100/350
    if (_width >= 1920){
      console.log('浏览器窗口大小改变事件80', e.target.innerWidth)
    }else if(_width >= 1366){
      console.log('浏览器窗口大小改变事件90', e.target.innerWidth)
    }else {
      console.log('浏览器窗口大小改变事件95', e.target.innerWidth)
    }
  }


  render() {
    return (
      <DocumentTitle title="saya.ac.cn-主页">
        <div className="frontend2-home">
          <header>
            <div className="header-content">
              Start
            </div>
          </header>
          <section>
            <div className="section-content">
              <div className="section-left">
                <div className="column-1">1</div>
                <div className="column-2">2</div>
                <div className="column-3">3</div>
              </div>
              <div className="section-right"></div>
            </div>
          </section>
          <footer>
            <div className="footer-content">
              <Row>
                <Col span={18}>
                  <p>
                    Copyright &copy; 2016-{(new Date()).getFullYear() } Saya.ac.cn-亲亲里 All rights reserved 国家工信部域名备案信息：[saya.ac.cn/蜀ICP备19027394号]
                  </p>
                  <p>
                    通讯地址：四川省宜宾市五粮液大道酒圣路8号(宜宾学院本部) 邮编：644000 Email：saya@saya.ac.cn
                  </p>
                  <p>
                    建议您使用Google Chrome，分辨率1920*1080及以上浏览，获得更好用户体验
                  </p>
                </Col>
                <Col span={6}>
                  <Popover content={content}>
                    <WechatOutlined type="wechat" style={{ fontSize: '1.5em', color: '#fff' }}/>
                  </Popover>
                  <Button target="_blank" href="https://github.com/saya-ac-cn" type="link" style={{marginLeft:"1em"}}>
                    <GithubOutlined style={{fontSize: '1.5em', color: '#fff' }}/>
                  </Button>
                </Col>
              </Row>
            </div>
          </footer>
        </div>
      </DocumentTitle>
    );
  }
}

// 对外暴露
export default Home;
