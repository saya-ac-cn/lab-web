import React, { Component } from 'react';
import './index.less'
import DocumentTitle from "react-document-title";
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2021/3/6 - 下午12:04
 * 描述：404页面
 */

// 定义组件（ES6）
class NotFound extends Component {


  render() {
    return (
      <DocumentTitle title="This page could not be found">
        <div className="notfound-page">
          <div style={{backgroundImage:`/img/svg/planets.svg`}} className="dialog">
            <div className="wrapper-top">
              <h1 className="message">This page could not be found</h1>
            </div>
            <span style={{background:`url(/img/svg/404.svg) no-repeat center`}} className="number">404</span>
            <div className="wrapper-bottom">
              <p className="warning">Do not panic</p>
              <p className="suggestion">Perhaps you misspelled the url or it has been removed.</p>
            </div>
          </div>
          <footer style={{background:`url(/img/svg/footer.svg) no-repeat center bottom`}} className="footer"></footer>
        </div>
      </DocumentTitle>
    );
  }
}

// 对外暴露
export default NotFound;