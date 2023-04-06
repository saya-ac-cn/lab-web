import {useState,useEffect} from "react";
import DocumentTitle from 'react-document-title'
import "./index.less"
import Storage from '@/utils/storage'
import {openNotificationWithIcon} from "@/utils/window";
import {loginApi,ownOrganizeUserApi} from "@/http/api"
import {LoadingOutlined} from "@ant-design/icons";


const Login = () => {

    const [active,setActive] = useState<String>('login')
    const [login, setLogin] = useState({userName:'',passWord:''});
    const [register, setRegister] = useState({email:'', userName:'',passWord:'',repeat:''});
    const [loading, setLoading] = useState(false);

    useEffect(()=>{

    },[])


    /**
     * 双向绑定登录文本框
     * @param event
     */
    const loginInputChange = (event,field) => {
        const value = event.target.value;
        const _login= {...login}
        _login[field] = value.trim();
        setLogin(_login)
    };

    /**
     * 双向绑定注册文本框
     * @param event
     */
    const registerInputChange = (event,field) => {
        const value = event.target.value;
        const _register = {...register}
        _register[field] = value.trim();
        setRegister(_register)
    };

    /**
     * 登录&注册切换
     * @param type
     */
    const go = (type) => {
        setActive(type)
    };

    /**
     * 响应登录事件
     */
    const loginHandle = async () => {
        let {userName,passWord} = login;
        if (null === userName || null === passWord || '' === userName || '' === passWord){
            openNotificationWithIcon("error", "错误提示", '请输入用户名和密码');
            return
        }
        let loginParams = {account: userName, password: passWord};
        setLoading(true);
        const result = await loginApi(loginParams);
        let {code, data} = result;
        setLoading(false);
        // if (code === 0) {
        //     let {access_token,log,plan,user} = data
        //     // 保存到local中
        //     Storage.add(Storage.ACCESS_KEY,access_token)
        //     Storage.add(Storage.USER_KEY,user)
        //     Storage.add(Storage.PLAN_KEY,plan)
        //     Storage.add(Storage.LOG_KEY,log)
        //     // 获取组织用户列表信息
        //     await getOwnOrganizeUser()
        //     if (values.remember){
        //         const cache = { account: values.account}
        //         Storage.add(Storage.LOGIN_KEY,cache)
        //     }
        //     // 跳转到管理界面 (不需要再回退回到登陆),push是需要回退
        //     window.location.href = '/backstage/financial/note'
        // } else if (code === 5) {
        //     openNotificationWithIcon("error", "错误提示", '请输入用户名和密码');
        // } else {
        //     openNotificationWithIcon("error", "错误提示", '用户名或密码错误');
        // }
    };

    /**
     * 获取自己所在组织下的用户
     */
    const getOwnOrganizeUser = async () => {
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await ownOrganizeUserApi()
        if (code === 0) {
            let organize = {};
            for (let index in data) {
                const item = data[index]
                organize[item.account] = item.name
            }
            Storage.add(Storage.ORGANIZE_KEY,organize)
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    }

    return (
        <DocumentTitle title='亲亲里·统一身份认证入口'>
            <div className="login-register-container" style={{backgroundImage: `url(/img/sunflower.jpg`}}>
                <div className='logo-area'>
                    <div className='logo' style={{backgroundImage: `url('/svg/project.svg')`}}>
                    </div>
                    <span>亲亲里·统一身份认证入口</span>
                </div>
                <div className="panel">
                    <div className="content">
                        <div className="switch">
                            {'register'===active ?
                                <article>
                                    <div className='hello-title'>欢迎注册</div>
                                    <span className='extra-title'>已有账号？</span><span className='active' onClick={event => go('login')}>登录</span>
                                </article>
                                :
                                <article>
                                    <div className='hello-title'>欢迎登录</div>
                                    <span className='extra-title'>没有账号？</span><span className='active' onClick={event => go('register')}>注册</span>
                                </article>
                            }
                        </div>
                        <div className='form' id="fromLogin">
                            {'register'===active?
                                <div className='section'>
                                    <div className="input">
                                        <input className={`${!register.email?'':'hasValue'}`} value={register.email} onChange={(e)=> registerInputChange(e,'email')} type="text"/>
                                        <label>邮箱</label>
                                    </div>
                                    <div className="input">
                                        <input className={`${!register.userName?'':'hasValue'}`} value={register.userName} onChange={(e)=> registerInputChange(e,'userName')} type="text"/>
                                        <label>用户名</label>
                                    </div>
                                    <div className="input">
                                        <input className={`${!register.passWord?'':'hasValue'}`} value={register.passWord} onChange={(e)=> registerInputChange(e,'passWord')} type="password"/>
                                        <label>密码</label>
                                    </div>
                                    <div className="input">
                                        <input className={`${!register.repeat?'':'hasValue'}`} value={register.repeat} onChange={(e)=> registerInputChange(e,'repeat')} type="password"/>
                                        <label>重复密码</label>
                                    </div>
                                    <div className="input auto-height">
                                        <button type="button">注册</button>
                                    </div>
                                </div>
                                :
                                <div className='section'>
                                    <div className="input">
                                        <input className={`${!login.userName?'':'hasValue'}`} value={login.userName} type="text" onChange={(e)=> loginInputChange(e,'userName')} />
                                        <label>用户名</label>
                                    </div>
                                    <div className="input">
                                        <input className={`${!login.passWord?'':'hasValue'}`} value={login.passWord} type="password" onChange={(e)=> loginInputChange(e,'passWord')} />
                                        <label>密码</label>
                                    </div>
                                    <div className="input auto-height">
                                        {loading?
                                            <button type="button"><LoadingOutlined className='loading'/></button>
                                            :
                                            <button type="button" onClick={loginHandle}>登录</button>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </DocumentTitle>
    )
}

export default Login
