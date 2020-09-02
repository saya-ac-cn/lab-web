import React, { Component } from 'react';
import DocumentTitle from "react-document-title";
import "./index.less"
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/8/30 - 2:56 下午
 * 描述：
 */

// 定义组件（ES6）
class About extends Component {

  constructor(props){
    super(props)
  }


  render() {
    return (
      <DocumentTitle title="saya.ac.cn-了解更多">
        <div className="frontend2-about">
          <div className="child-container">
            <div className="column-title">
              了解更多
            </div>
            <div className="about-web">
              <div className="web-picture"></div>
              <div className="web-desc">
                <h3>关于网站</h3>
                <article>
                  本站从2016年4月上线，最起初建立本站的初心，是希望能够随时随地，分享自己学习和生活相关动态的个人网站。
                </article>
                <article>
                  随着学习和工作技术的需要，喜欢把工作学习中遇到的问题记录到云笔记中。但迫于数据不互通，决定自建属于自己的博文网站。所以本站即是关注互联网以及分享Java、大数据和物联网相关知识的个人网站。
                </article>
                <article>
                  主要涵盖了Java基础、Java架构技术体系、物联网开发、大数据和面试等经验教程。
                </article>
                <article>
                  建站目标：把互联网开发中最实在、最主流、最前沿的技术经验，分享给每一位需要的读者，希望每一个来访的读者都能够有所收获！
                </article>
                <h3>关于个人</h3>
                <article>
                  Shmily，科班出身，软件开发工程师一枚。主要喜欢Java、大数据和物联网等技术开发，前端web略懂一二。喜欢写技术分享的博客，喜欢把工作学习中遇到的问题及时写下来，同样的错误不犯第二次。
                </article>
                <article>
                  平时爱好不多，乐观幽默，就喜欢捣鼓玩弄一些It作品，不乏一些作品通过版权保护注册。自己动手，丰衣足食。能自己开发出来的应用软件，绝不用第三方的，能用自己的，尽量不用别人的。
                </article>
                <article>
                  不喜欢刷抖音，快手。但喜欢玩GitHub，欢迎Start。
                </article>
                <article>
                  个性签名：将来你会明白，所谓的光辉岁月,并不是后来闪耀的日子，而是无人问津时,你对梦想的偏执，对梦想的执着，加油！
                </article>
                <article>
                  成长目标：致力于开发优质的互联网应用。
                </article>
                <h3>关于版权</h3>
                <article>
                  本站的文章采用知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议发布。【转载】的文章指的是由本站经过搜集整理后发布为文章，其余【原创】的文章均为本站原创撰写文章。转载时请务必以标明源文出处，否则拒绝转载！
                  若发现本站有任何侵犯您利益的内容，请及时通过邮件联系，本站会第一时间删除所有相关内容。
                </article>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

// 对外暴露
export default About;
