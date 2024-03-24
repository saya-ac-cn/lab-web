import React, { Component } from 'react';
import './index.less'
import DocumentTitle from "react-document-title";
import {Button, Col, Popover, Row,Calendar} from "antd";
import {WechatOutlined, GithubOutlined,SmileOutlined} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/9/6 - 10:46 下午
 * 描述：https://blog.csdn.net/u012790987/article/details/47683625,https://www.jq22.com/webqd6339
 */
const content = (
  <div style={{width:"10em",height:"10em",backgroundSize:"100%",backgroundImage:`url('/img/wx/wechat.png')`}}>
  </div>
);
// 定义组件（ES6）
class Home extends Component {

  state = {
    // 阵列总宽度
    sectionWidth: 1536,// 初始宽度 1920 x 0.8
    // 单位标量
    scalar: 10,
    greetText: '好久不见，甚是想念，记得爱护自己！'
  };

  /**
   * 根据小时，得到问候词
   * @return
   */
  getGreetText = () => {
    let hour = moment().format("HH");
    let greetText = "好久不见，甚是想念，记得爱护自己！";
    if(hour >= 0 && hour < 7){
      greetText = "天还没亮，夜猫子，要注意身体哦！";
    }else if(hour>=7 && hour<12){
      greetText = "上午好！又是元气满满的一天，奥利给！";
    }else if(hour >= 12 && hour < 14){
      greetText = "中午好！吃完饭记得午休哦！";
    }else if(hour >= 14 && hour < 18){
      greetText = "下午茶的时间到了，休息一下吧！";
    }else if(hour >= 18 && hour < 22){
      greetText = "晚上到了，多陪陪家人吧！";
    }else if(hour >= 22 && hour < 24){
      greetText = "很晚了哦，注意休息呀！";
    }
    this.setState({greetText});
  };

  componentDidMount() {
    this.getGreetText()
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
    let {sectionWidth,scalar} = _this.state;
    // 总份数 宽 350份，最小正方形8x8，
    if (_width >= 1920){
      sectionWidth = _width * 0.8
    }else if(_width >= 1366){
      sectionWidth = _width * 0.8
    }else {
      sectionWidth = _width * 0.70
    }
    scalar = sectionWidth / 150.0;
    _this.setState({sectionWidth,scalar})
  };

  href = url => {
    // 跳转到管理界面 (不需要再回退回到登陆),push是需要回退,replace不需要
    //this.props.history.push(url)
    window.location.href = url;
  };

  render() {
    const {sectionWidth,scalar,greetText} = this.state;
    return (
      <DocumentTitle title="saya.ac.cn-主页">
        <div className="frontend-home">
          <header>
            <div className="header-content">
              <span>极客印记</span>
              <span style={{fontSize:'0.4em'}}><SmileOutlined />&nbsp;&nbsp;{greetText}</span>
            </div>
          </header>
          <section>
            <div className="section-content" style={{width:sectionWidth}}>
              {/*左侧阵列*/}
              <div className="section-left">
                {/*第一列*/}
                <div className="column-1" style={{marginRight:scalar}}>
                  <div onClick={() => this.href("/public/note")} style={{width:scalar*35,height:scalar*17,marginBottom:scalar,backgroundColor:'#CC99CC',backgroundImage:`url('/img/home/signboard.svg')`}} className="inithover hover1">技术专题</div>
                  <div className="row-2" style={{width:scalar*35,marginBottom:scalar,height:scalar*17}}>
                    <div onClick={() => this.href("/public/news")} style={{width:scalar*17,marginRight:scalar,height:scalar*17,backgroundColor:'#FF9966',backgroundImage:`url('/img/home/notice.svg')`}} className="inithover hover1">消息动态</div>
                    <div style={{width:scalar*17,height:scalar*17,backgroundColor:'#CC9999'}} className="inithover hover1"></div>
                  </div>
                  <div className="row-3" style={{width:scalar*35,marginBottom:scalar,height:scalar*17}}>
                    <div style={{width:scalar*17,marginRight:scalar,height:scalar*17,backgroundColor:'#99CC99'}} className="inithover hover1"></div>
                    <div style={{width:scalar*17,height:scalar*17,backgroundColor:'#FFCC99'}} className="inithover hover1"></div>
                  </div>
                  <div style={{width:scalar*35,height:scalar*17,backgroundColor:'#66CCCC',backgroundImage:`url('/img/home/home.svg')`}} className="inithover hover1">桌面</div>
                </div>
                {/*第二列*/}
                <div className="column-2" style={{marginRight:scalar}}>
                  <div onClick={() => this.href("/public/files")} style={{width:scalar*35,height:scalar*17,marginBottom:scalar,backgroundColor:'#FF9999',backgroundImage:`url('/img/home/viewlist.svg')`}} className="inithover hover1">共享资源</div>
                  <div style={{width:scalar*35,marginBottom:scalar,height:scalar*17,backgroundColor:'#66CCCC'}} className="inithover hover1"></div>
                  <div onClick={() => this.href("/public/growing")} style={{width:scalar*35,marginBottom:scalar,height:scalar*17,backgroundColor:'#6699CC',backgroundImage:`url('/img/home/history.svg')`}} className="inithover hover1">成长历程</div>
                  <div style={{width:scalar*35,height:scalar*17,backgroundColor:'#FFCCCC'}} className="inithover hover1"></div>
                </div>
                {/*第三列*/}
                <div className="column-3">
                  <div className="row-1" style={{width:scalar*35,height:scalar*17,marginBottom:scalar}}>
                    <div onClick={() => this.href("/public/egg")} style={{width:scalar*17,marginRight:scalar,height:scalar*17,backgroundColor:'#8080C0',backgroundImage:`url('/img/home/integral.svg')`}} className="inithover hover1">技术彩蛋</div>
                    <div className="field-grid" style={{width:scalar*17,height:scalar*17}}>
                      <div style={{width:scalar*8,height:scalar*8,marginBottom:scalar,backgroundColor:'#CCCC99'}} className="inithover hover1"></div>
                      <div style={{width:scalar*8,height:scalar*8,marginBottom:scalar, paddingLeft: '0.5em',paddingBottom: '0.5em',backgroundColor:'#99CC99',fontSize: '0.5em'}} className="inithover hover1"></div>
                      <div style={{width:scalar*8,height:scalar*8,backgroundColor:'#FFCC99'}} className="inithover hover1"></div>
                      <div style={{width:scalar*8,height:scalar*8,backgroundColor:'#FF9966'}} className="inithover hover1"></div>
                    </div>
                  </div>
                  <div onClick={() => this.href("/public/plan")} style={{width:scalar*35,height:scalar*17,marginBottom:scalar,backgroundColor:'#CCCC99',backgroundImage:`url('/img/home/calendar.svg')`}} className="inithover hover1">计划安排</div>
                  <div style={{width:scalar*35,height:scalar*35,backgroundColor:'#FF9966'}} className="inithover hover1"></div>
                </div>
              </div>
              {/*右侧阵列*/}
              <div className="section-right">
                <div style={{width:scalar*35,marginBottom:scalar,height:scalar*35,transition:'800ms ease all'}}>
                  <Calendar fullscreen={false}/>
                </div>
                <div onClick={() => this.href("/public/me")} style={{width:scalar*35,height:scalar*17,marginBottom:scalar,backgroundColor:'#CC6699',backgroundImage:`url('/img/home/prompt.svg')`}} className="inithover hover1">了解更多</div>
                <div className="row-4" style={{width:scalar*35,height:scalar*17}}>
                  <div style={{width:scalar*17,marginRight:scalar,height:scalar*17,backgroundColor:'#CC9999'}} className="inithover hover1"></div>
                  <div style={{width:scalar*17,height:scalar*17,backgroundColor:'#FFCCCC'}} className="inithover hover1"></div>
                </div>
              </div>
            </div>
          </section>
          <footer>
            <div className="footer-content">
              <Row>
                <Col span={18}>
                  <p>
                    Copyright &copy; 2016-{(new Date()).getFullYear() } Saya.ac.cn-极客印记 All rights reserved 国家工信部域名备案信息：[<a href="https://beian.miit.gov.cn/" rel="noopener noreferrer" target='_blank'>saya.ac.cn/蜀ICP备2021013893号-1</a>]
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
