import React, { Component } from 'react';
import DocumentTitle from "react-document-title";
import './index.less'
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/8/30 - 4:31 下午
 * 描述：
 */

// 定义组件（ES6）
class Growing extends Component {


  render() {
    return (
      <DocumentTitle title="saya.ac.cn-建设历程">
        <div className="frontend-growing">
          <div className="child-container">
            <div className="column-title">
              建设历程
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-icon orange">
                </div>
                <div className="timeline-content">
                  <h3>2016年4月</h3>
                  <article>发布第一个里程碑版本，个人网站正式上线。最原始，最初的版本采用ASP.NET开发，采用ip地址的形式进行访问。追求极简主义，轻量级开发部署。</article>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon blue">
                </div>
                <div className="timeline-content right">
                  <h3>2016年5月</h3>
                  <article>前期准备的域名facetub.cn，通过国家工信部域名备案审核，网站就此开启域名访问。</article>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon green">
                </div>
                <div className="timeline-content">
                  <h3>2016年7月</h3>
                  <div className='des-div'>
                    <img alt="2016年7月" src={`/img/growing/psb3.png`}/>
                    <div className="des-div-text">
                      对网站进行持续更新，本版本对引导页及主页进行了大幅度的改版。更加的简洁，分类进一步完善。
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon pink">
                </div>
                <div className="timeline-content right">
                  <h3>2016年8月</h3>
                  <div className='des-div'>
                    <img alt="2016年8月" src={`/img/growing/psb5.png`}/>
                    <div className="des-div-text">
                      针对上一个版本存在的问题进行了修复，重构了主页和后端管理模块。增加了后端操作功能，对前端留言功能进行了完善，增加了留言提醒。
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon green">
                </div>
                <div className="timeline-content">
                  <h3>2016年12月</h3>
                  <article>早期的域名facetub.cn停止服务，已申请注销。采用全新的域名saya.ac.cn进行访问。</article>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon pink">
                </div>
                <div className="timeline-content right">
                  <h3>2017年3月</h3>
                  <div className='des-div'>
                    <img alt="2017年3月" src={`/img/growing/psb1.png`}/>
                    <div className="des-div-text">
                      第二个里程碑版本，对网站整体进行了大幅度的改版升级，摒弃了早期不合理的设计，引入了全新的UI设计。另外，网站整体从原来的ASP.NET升级到PHP，使用Yii框架开发，数据库也做了相应的迁移。
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon orange">
                </div>
                <div className="timeline-content">
                  <h3>2017年10月</h3>
                  <div className='des-div'>
                    <img alt="2017年10月" src={`/img/growing/psb4.png`}/>
                    <div className="des-div-text">
                      第三个里程碑版本，进一步对网站的用户交互界面进行改版，统一各终端的访问方式，对各种设备能够做到自适应访问。整体框架切换到Laravel，部署运行更加快速。
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon blue">
                </div>
                <div className="timeline-content right">
                  <h3>2019年3月</h3>
                  <div className='des-div'>
                    <img alt="2019年3月" src={`/img/growing/psb2.png`}/>
                    <div className="des-div-text">
                      第四个里程碑版本，时隔一年，网站再次更新。本次更新，主要对页面和功能进行了大幅度改版。前后端完全分离，前端采用Vue，后端采用Java，对静态资源实现了动静分离，加快访问速度。
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon green">
                </div>
                <div className="timeline-content">
                  <h3>2019年10月</h3>
                  <article>对前端部分进行了重构，前端框架从Vue更换到React。</article>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon orange">
                </div>
                <div className="timeline-content right">
                  <h3>2020年10月</h3>
                  <div className='des-div'>
                    <img alt="2019年3月" src={`/img/growing/psb6.png`}/>
                    <div className="des-div-text">
                      第五个里程碑版本。整体重构，持续改进页面布局、丰富完善功能。
                    </div>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon pink">
                </div>
                <div className="timeline-content">
                  <h3>2021年5月</h3>
                  <article>因服务器整体到期，域名重新进行通信管理局备案。</article>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon blue">
                </div>
                <div className="timeline-content right">
                  <h3>2020年10月</h3>
                  <div className='des-div'>
                    第六个里程碑版本。接口服务全部从Java转战到Rust，前端从webpack切换到vite打包部署，完成react以及antd的整体升级。
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

// 对外暴露
export default Growing;
