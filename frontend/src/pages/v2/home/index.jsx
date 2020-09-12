import React, { Component } from 'react';
import './index.less'
import DocumentTitle from "react-document-title";
import {Button, Col, Popover, Row,Calendar} from "antd";
import {WechatOutlined, GithubOutlined} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
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

  state = {
    // 阵列总宽度
    sectionWidth: 1536,// 初始宽度 1920 x 0.8
    // 单位标量
    scalar: 10
  }

  componentDidMount() {
    this.adapterWidth(document.body.clientWidth)
    //监听窗口大小改变
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  componentWillUnmount() {
    //一定要最后移除监听器，以防多个组件之间导致this的指向紊乱
    window.removeEventListener('resize', this.handleResize.bind(this))
  }


  handleResize = e => {
    const _width = e.target.innerWidth
    this.adapterWidth(_width)
  }

  adapterWidth = _width => {
    let _this = this
    let {sectionWidth,scalar} = _this.state
    // 总份数 宽 350份，最小正方形8x8，
    if (_width >= 1920){
      sectionWidth = _width * 0.8
    }else if(_width >= 1366){
      sectionWidth = _width * 0.9
    }else {
      sectionWidth = _width * 0.95
    }
    scalar = sectionWidth / 150.0
    _this.setState({sectionWidth,scalar})
  }


  render() {
    const {sectionWidth,scalar} = this.state
    return (
      <DocumentTitle title="saya.ac.cn-主页">
        <div className="frontend2-home">
          <header>
            <div className="header-content">
              Start
            </div>
          </header>
          <section>
            <div className="section-content" style={{width:sectionWidth}}>
              {/*左侧阵列*/}
              <div className="section-left">
                {/*第一列*/}
                <div className="column-1" style={{marginRight:scalar}}>
                  <div style={{width:scalar*35,height:scalar*17,marginBottom:scalar,background:'#8FBC8B'}}>技术专题</div>
                  <div className="row-2" style={{width:scalar*35,marginBottom:scalar,height:scalar*17}}>
                    <div style={{width:scalar*17,marginRight:scalar,height:scalar*17,background:'#8FBC8B'}}>消息动态</div>
                    <div style={{width:scalar*17,height:scalar*17,background:'#8FBC8B'}}></div>
                  </div>
                  <div className="row-3" style={{width:scalar*35,marginBottom:scalar,height:scalar*17}}>
                    <div style={{width:scalar*17,marginRight:scalar,height:scalar*17,background:'#8FBC8B'}}></div>
                    <div style={{width:scalar*17,height:scalar*17,background:'#8FBC8B'}}></div>
                  </div>
                  <div style={{width:scalar*35,height:scalar*17,background:'#8FBC8B'}}>桌面</div>
                </div>
                {/*第二列*/}
                <div className="column-2" style={{marginRight:scalar}}>
                  <div style={{width:scalar*35,height:scalar*17,marginBottom:scalar,background:'#8FBC8B'}}>共享资源</div>
                  <div style={{width:scalar*35,marginBottom:scalar,height:scalar*17,background:'#8FBC8B'}}>12</div>
                  <div style={{width:scalar*35,marginBottom:scalar,height:scalar*17,background:'#8FBC8B'}}>成长历程</div>
                  <div style={{width:scalar*35,height:scalar*17,background:'#8FBC8B'}}>12</div>
                </div>
                {/*第三列*/}
                <div className="column-3">
                  <div className="row-1" style={{width:scalar*35,height:scalar*17,marginBottom:scalar}}>
                    <div style={{width:scalar*17,marginRight:scalar,height:scalar*17,background:'#8FBC8B'}}>技术彩蛋</div>
                    <div className="field-grid" style={{width:scalar*17,height:scalar*17}}>
                      <div style={{width:scalar*8,height:scalar*8,marginBottom:scalar,background:'#8FBC8B'}}>12</div>
                      <div style={{width:scalar*8,height:scalar*8,marginBottom:scalar,background:'#8FBC8B'}}>返回旧版</div>
                      <div style={{width:scalar*8,height:scalar*8,background:'#8FBC8B'}}>12</div>
                      <div style={{width:scalar*8,height:scalar*8,background:'#8FBC8B'}}>12</div>
                    </div>
                  </div>
                  <div style={{width:scalar*35,height:scalar*17,marginBottom:scalar,background:'#8FBC8B'}}>计划安排</div>
                  <div style={{width:scalar*35,height:scalar*35,background:'#8FBC8B'}}>12</div>
                </div>
              </div>
              {/*右侧阵列*/}
              <div className="section-right">
                <div style={{width:scalar*35,marginBottom:scalar,height:scalar*35}}>
                  <Calendar fullscreen={false}/>
                </div>
                <div style={{width:scalar*35,height:scalar*17,marginBottom:scalar,background:'#8FBC8B'}}>了解更多</div>
                <div className="row-4" style={{width:scalar*35,height:scalar*17}}>
                  <div style={{width:scalar*17,marginRight:scalar,height:scalar*17,background:'#8FBC8B'}}></div>
                  <div style={{width:scalar*17,height:scalar*17,background:'#8FBC8B'}}></div>
                </div>
              </div>
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
