import React, {Component} from 'react';
import './index.less'
import {message} from 'antd';
import DocumentTitle from 'react-document-title'
import {requestLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
/*
 * 文件名：index.jsx
 * 作者：刘能凯
 * 创建日期：2020-7-15 - 14:22
 * 描述：登录的路由组件
 */

// 定义组件（ES6）
class Login extends Component {

  state = {
    active:'login',
    login:{
      // 给用户输入的文本框和密码框
      userName: '',
      passWord: '',
    },
    register:{
      email:'',
      // 给用户输入的文本框和密码框
      userName: '',
      passWord: '',
      repeat:''
    },
    loading: false
  };

  /**
   * 双向绑定用户文本框
   * @param event
   */
  userInputChange = (event) => {
    let _this = this;
    const value = event.target.value;
    _this.setState({
      userName: value.trim()
    })
  };

  /**
   * 双向绑定登录文本框
   * @param event
   */
  loginInputChange = (event,field) => {
    let _this = this;
    const value = event.target.value;
    let { login } = this.state;
    login[field] = value.trim();
    _this.setState({login});
  };

  /**
   * 双向绑定注册文本框
   * @param event
   */
  registerInputChange = (event,field) => {
    let _this = this;
    const value = event.target.value;
    let { register } = this.state;
    register[field] = value.trim();
    _this.setState({register});
  };

  /**
   * 登录&注册切换
   * @param type
   */
  go = (type) => {
    let _this = this;
    _this.setState({
      active: type
    })
  };

  /**
   * 响应登录事件
   */
  loginHandle = async () => {
    let _this = this;
    let {userName,passWord} = _this.state.login;
    if (null === userName || null === passWord || '' === userName || '' === passWord){
      message.error('请输入用户名和密码');
      return
    }
    let loginParams = {user: userName, password: passWord};
    _this.setState({loading: true});
    const result = await requestLogin(loginParams);
    let {code, data} = result;
    _this.setState({loading: false});
    if (code === 0) {
      memoryUtils.user = data;// 保存在内存中
      storageUtils.saveUser(data); // 保存到local中
      // 跳转到管理界面 (不需要再回退回到登陆),push是需要回退
      this.props.history.replace('/backstage/chart')
    } else if (code === 5) {
      message.error('请输入用户名和密码');
    } else {
      message.error('用户名或密码错误');
    }
  };

  render() {
    // 读取状态数据
    const {active,login, register} = this.state;
    return (
      <DocumentTitle title='亲亲里·统一身份认证入口'>
        <div className="login-register-container" style={{backgroundImage: `url('${process.env.PUBLIC_URL}/picture/login/sunflower.jpg')`}}>
          <div className='logo-area'>
            <div className='logo' style={{backgroundImage: `url('${process.env.PUBLIC_URL}/picture/login/project.svg')`}}>
            </div>
            <span>亲亲里·统一身份认证入口</span>
          </div>
          <div className="panel">
              <div className="content">
                <div className="switch">
                  {'register'===active ?
                      <article>
                        <div className='hello-title'>欢迎注册</div>
                        <span className='extra-title'>已有账号？</span><span className='active' onClick={event => this.go('login')}>登录</span>
                      </article>
                      :
                      <article>
                        <div className='hello-title'>欢迎登录</div>
                        <span className='extra-title'>没有账号？</span><span className='active' onClick={event => this.go('register')}>注册</span>
                      </article>
                  }
                </div>
                <div className='form' id="fromLogin">
                  {'register'===active?
                      <div className='section'>
                        <div className="input">
                          <input className={`${!register.email?'':'hasValue'}`} value={register.email} onChange={(e)=>this.registerInputChange(e,'email')} type="text"/>
                          <label>邮箱</label>
                        </div>
                        <div className="input">
                          <input className={`${!register.userName?'':'hasValue'}`} value={register.userName} onChange={(e)=>this.registerInputChange(e,'userName')} type="text"/>
                          <label>用户名</label>
                        </div>
                        <div className="input">
                          <input className={`${!register.passWord?'':'hasValue'}`} value={register.passWord} onChange={(e)=>this.registerInputChange(e,'passWord')} type="password"/>
                          <label>密码</label>
                        </div>
                        <div className="input">
                          <input className={`${!register.repeat?'':'hasValue'}`} value={register.repeat} onChange={(e)=>this.registerInputChange(e,'repeat')} type="password"/>
                          <label>重复密码</label>
                        </div>
                        <div className="input auto-height">
                          <button type="button">注册</button>
                        </div>
                      </div>
                      :
                      <div className='section'>
                        <div className="input">
                          <input className={`${!login.userName?'':'hasValue'}`} value={login.userName} type="text" onChange={(e)=>this.loginInputChange(e,'userName')} />
                          <label>用户名</label>
                        </div>
                        <div className="input">
                          <input className={`${!login.passWord?'':'hasValue'}`} value={login.passWord} type="password" onChange={(e)=>this.loginInputChange(e,'passWord')} />
                          <label>密码</label>
                        </div>
                        <div className="input auto-height">
                          <button type="button" onClick={this.loginHandle}>登录</button>
                        </div>
                      </div>
                  }
              </div>
          </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default Login;
