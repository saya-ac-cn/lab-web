import React, {Component} from 'react';
import './index.less'
import {Redirect, Route, Switch, Link} from 'react-router-dom'
import { MenuOutlined } from '@ant-design/icons';
import menuConfig from '../../../config/backendMenuConfig'
import memoryUtils from "../../../utils/memoryUtils";
import storageUtils from '../../../utils/storageUtils'
import {isEmptyObject} from "../../../utils/var"
import { Button, Input, Menu, Popover, Avatar, Breadcrumb, Badge, Modal} from 'antd';
import {HomeOutlined,NotificationOutlined,MessageOutlined, DatabaseOutlined,StockOutlined,FieldTimeOutlined,SearchOutlined,UserOutlined,AccountBookOutlined,ScheduleOutlined,PushpinOutlined,CarryOutOutlined,MoneyCollectOutlined,SwitcherOutlined} from '@ant-design/icons';
import {requestLogout} from '../../../api'
import Info from '../../me/info'
import Logs from '../../me/logs'
import Transaction from '../../financial/transaction'
import Memo from '../../memory/memo'
import Notes from "../../memory/notes";
import News from "../../memory/news";
import Plan from "../../memory/plan";
import DB from "../../oss/db";
import Files from "../../oss/file";
import Wallpaper from "../../oss/wallpaper";
import Illustration from "../../oss/illustration";
import Chart from "../../me/chart";
import FinancialForDay from "../../financial/day";
import FinancialForMonth from "../../financial/month";
import FinancialForYear from "../../financial/year";
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/7/15 - 10:20 下午
 * 描述：后台主页
 */
const {SubMenu} = Menu;
// 定义组件（ES6）
class LayoutBackend extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // 默认让左侧的菜单展开
            collapsed: false,
            // 当前展开的菜单数组
            openKeys: [],
            searchfocus: false,
            searchValue: null
        };
    }

    /***
     * 将字符串转换成组件
     * @param value
     * @returns {*}
     */
    transformComponent = (value) => {
        switch(value) {
            case 'DatabaseOutlined': {
                return <DatabaseOutlined/>
            }
            case 'UserOutlined':{
              return <UserOutlined/>
            }
            case 'AccountBookOutlined':{
              return <AccountBookOutlined/>
            }
            case 'ScheduleOutlined':{
              return <ScheduleOutlined/>
            }
            case 'HomeOutlined':{
              return <HomeOutlined/>
            }
            default: {
                return <MessageOutlined/>
            }
        }
    };

    // 切换面板
    handlTabClick = () => {
        const collapsed = !this.state.collapsed;
        // 更新状态
        this.setState({collapsed: collapsed})
    };


    /**
     * 失去焦点
     */
    inputOnBlur = () => {
        this.setState({
            searchfocus: false
        })
    };


    /**
     * 获得焦点
     */
    inputOnFocus = () =>{
        this.setState({
            searchfocus: true
        })
    }

    /**
     * 初始化头像下拉菜单
     */
    initHeaderMenu = () => (
        <div className="backend-layout-header-info-hover">
            <div className='user-img-div'>
                <Avatar size={64} icon={<UserOutlined/>} src={this.userCatche.user.logo}/>
                <div className='operator-img'>
                    <span>{this.userCatche.user.user}</span>
                    <Link to='/backstage/set/info'>更换头像</Link>
                </div>
            </div>
            <div className='system-operator'>
                <Button type="link" href='/backstage/set/info'>设置</Button>
                <Button type="link" onClick={this.logout}>退出</Button>
            </div>
        </div>
    )

    /*
     根据menu的数据数组生成对应的标签数组
     使用reduce() + 递归调用
     */
    getMenuNodes = (menuList) => {
        let _this = this;
        // 得到当前请求的路由路径
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            // 向pre添加<Menu.Item>
            if (!item.children && item.hidden === false) {
              if(item.root){
                // 处理只有根节点，无子节点的菜单
                if(path===item.key){
                  // 当前打开的是根节点且无子节点，无须展开
                  _this.setState({
                    openKeys:[]
                  })
                }
                pre.push((
                  <Menu.Item key={item.key} icon={_this.transformComponent(item.icon)}><Button type="link" style={{padding:0,color:'rgba(255, 255, 255, 0.7)'}} href={item.key}>{item.title}</Button></Menu.Item>
                ))
              }else{
                pre.push((
                  <Menu.Item key={item.key}><Button type="link" href={item.key}>{item.title}</Button></Menu.Item>
                ))
              }
            } else if (item.children && item.hidden === false) {
                // 查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
                // 如果存在, 说明当前item的子列表需要打开
                if (cItem) {
                    _this.setState({
                        openKeys:[item.key]
                    })
                }
                // 向pre添加<SubMenu>
                pre.push((
                    <SubMenu key={item.key} icon={_this.transformComponent(item.icon)} style={{color:'rgba(255, 255, 255, 0.7)'}} title={<span>{item.title}</span>}>
                        {_this.getMenuNodes(item.children)}
                    </SubMenu>
                ));
            }
            return pre
        }, [])
    };

    /**
     * 提取当前页面的标题
     **/
    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname;
        let titles = {title: [], local: ''};
        menuConfig.forEach(item => {
            if (item.key === path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
                titles.title.push((<Breadcrumb.Item key={item.key}>{item.title}</Breadcrumb.Item>));
                titles.local = item.title
            } else if (item.children) {
                // 在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
                // 如果有值才说明有匹配的
                if (cItem) {
                    // 取出它的一级和二级title
                    titles.title.push((<Breadcrumb.Item key={item.key}>{item.title}</Breadcrumb.Item>));
                    titles.title.push((<Breadcrumb.Item key={cItem.key}>{cItem.title}</Breadcrumb.Item>));
                    titles.local = cItem.title
                }
            }
        });
        return titles
    };

    /**
     * 一级菜单点击展开事件
     * @param _openKeys
     */
    onOpenChange = (_openKeys) => {
        let _this = this;
        const openKeys = this.state.openKeys;
        const latestOpenKey = _openKeys.find(key => openKeys.indexOf(key) === -1);
        menuConfig.reduce((pre, item) => {
            if (item.hidden === false){
                const cItem = _openKeys.find(cItem => openKeys.indexOf(cItem) === -1);
                // 如果存在, 说明当前item的子列表需要打开
                if (cItem) {
                    // 切换
                    _this.setState({
                        openKeys: latestOpenKey ? [latestOpenKey] : [],
                    });
                }else {
                    // 不切换保持原样
                    _this.setState({ openKeys:_openKeys });
                }
            }
        }, [])
    };

    getParentMenuChild = (path) => {
        for (var i = 0; i < menuConfig.length; i++) {
            const item = menuConfig[i];
            if (path.indexOf(item.key) === 0){
                return [item.key];
            }
        }
        return []
    };

    /*
    退出登陆
     */
    logout = () => {
        // 显示确认框
        Modal.confirm({
            title: '操作确认',
            content:'确定退出吗?',
            onOk: async () => {
                // 请求注销接口
                await requestLogout();
                // 删除保存的user数据
                storageUtils.removeUser();
                memoryUtils.user = {};
                // 跳转到login
                this.props.history.replace('/login')
            }
        })
    };

    /**
     * 搜索框内容改变事件（用于双向绑定数据）
     * @param event
     */
    searchInputChange = (event) => {
        let _this = this;
        const value = event.target.value
        _this.setState({
            searchValue: value
        })
    };

    /**
     * 执行搜索
     */
    handleSearch = () =>{
        let _this = this;
        let searchValue = _this.state.searchValue || ""
        searchValue = searchValue.trim()
        if (!!searchValue) {
            // 有效内容可以搜索
            // 跳转到笔记列表界面 (需要再回退到当前页面),replace是不需要回退
            this.props.history.push(`/backstage/grow/notes?search=${searchValue}`)
        }
    }

    /**
     * 写笔记
     */
    addNotes = () => {
        // 跳转到笔记列表界面 (需要再回退到当前页面),replace是不需要回退
        this.props.history.push('/backstage/memory/notes/create')
    }

    /*
    * 在第一次render()之前执行一次
    * 为第一个render()准备数据(必须同步的)
    */
  componentDidMount() {
      this.userCatche = memoryUtils.user || {};
      // 初始化左侧导航
      this.menuNodes = this.getMenuNodes(menuConfig);
      // 顶部用户头像下拉
      this.headerUserInfo = this.initHeaderMenu()
  }

    render() {
        const user = memoryUtils.user;
        // 如果内存没有存储user ==> 当前没有登陆
        if (!user || !user.user) {
            // 自动跳转到登陆(在render()中)
            return <Redirect to='/login'/>
        }
        // 读取状态
        let {collapsed, searchfocus, openKeys, searchValue} = this.state;
        // 得到当前请求的路由路径
        let path = this.props.location.pathname;
        if (path.indexOf('/backstage/memory/news') === 0){
            // 当前请求的是news及其下面的路由
            path = '/backstage/message/news'
        }
        // 显示搜索框
        let showSearch = true
        if (path.indexOf('/backstage/memory/notes') === 0){
            // 当前请求的是news及其下面的路由
            path = '/backstage/grow/notes'
            // 如果进入笔记模块，则不显示
            showSearch = false
        }
        // 得到当前需要显示的title
        const {title, local} = this.getTitle();
        return (
            <div className="backend-container">
                <div className='background-div' style={{backgroundImage:`url('${user.user.backgroundUrl || process.env.PUBLIC_URL+'/picture/backend/admin_background1.jpg'}')`}}>
                </div>
                <header className="this-header">
                    <div className='header-logo'>
                        <div className='tab-operation'>
                            <Button type="link" size='large' onClick={this.handlTabClick}>
                                <MenuOutlined/>
                            </Button>
                        </div>
                        <div className='project-div' style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/project.svg')`}}>
                        </div>
                        <div className='project-name'>
                            亲亲里
                        </div>
                    </div>
                    <div className='header-search'>
                        <div className='header-search-form'>
                            {
                                showSearch ?
                                    <div className='header-search-form-input' style={{background:searchfocus?'#fff':'rgba(241,243,244,0.24)'}}>
                                        <Button onClick={this.handleSearch}><SearchOutlined/></Button>
                                        <Input placeholder="搜索笔记"
                                               value={searchValue}
                                               onChange={this.searchInputChange}
                                               onPressEnter={this.handleSearch}
                                               onBlur={this.inputOnBlur }
                                               onFocus={this.inputOnFocus }/>
                                    </div>
                                    : null
                            }
                        </div>
                        <div className='header-search-menu'>
                            {
                                !(isEmptyObject(user.plan)) ?
                                    <Popover content={user.plan.reduce((pre, item) => {pre.push(<p key={item.id}>{item.describe}</p>);return pre},[])} title="今天计划">
                                        <Badge count={user.plan.length} dot color="#2db7f5">
                                            <NotificationOutlined/>
                                        </Badge>
                                    </Popover> :
                                    <Popover content="暂无计划" title="今天计划">
                                        <Badge count={0} dot>
                                            <NotificationOutlined/>
                                        </Badge>
                                    </Popover>
                            }
                        </div>
                    </div>
                    <div className='header-info'>
                        <Popover trigger="hover" mouseEnterDelay={0.2} mouseLeaveDelay={0.4} content={this.headerUserInfo}  placement="bottomRight">
                            <span className="el-dropdown-link">
                                <img src={user.user.logo} alt={user.user.user}/>
                            </span>
                        </Popover>
                    </div>
                </header>
                <section className="this-content">
                    <div className={`leftmunu ${collapsed ? 'leftmunu-close' : 'leftmunu-open'}`}>
                        <div className='menu-logo'>
                            <div className={`logo-item ${collapsed?"menu-logo-close":null}`} onClick={this.addNotes}>
                                写笔记
                            </div>
                        </div>
                        <div className='menu-list'>
                            <Menu className='menu-list-ul' subMenuCloseDelay={1}  subMenuOpenDelay={1}  onOpenChange={this.onOpenChange} openKeys={openKeys} defaultOpenKeys={openKeys} mode="inline"
                                  inlineCollapsed={collapsed}>
                                {
                                    this.menuNodes
                                }
                            </Menu>
                        </div>
                        <div className={`menu-copyright ${collapsed?"menu-copyright-close":null}`}>
                            <Button type="link" title='切换壁纸' href="/backstage/oss/wallpaper"><SwitcherOutlined/></Button>
                            <Button type="link" title='数据统计' href="/backstage/chart"><StockOutlined/></Button>
                            <Button type="link" title='操作日志' href="/backstage/me/logs"><FieldTimeOutlined/></Button>
                        </div>
                    </div>
                    <div className='content-container'>
                        <div className='pagename-div'>
                            <div className='pagename-label'>
                                <strong>{local}</strong>
                                <Breadcrumb className="breadcrumb-inner">
                                    <Breadcrumb.Item>所在位置</Breadcrumb.Item>
                                    {
                                        title
                                    }
                                </Breadcrumb>
                            </div>
                        </div>
                        <div className='content-div'>
                            <div className='container-div'>
                                <Switch>
                                    <Route path='/backstage/me/info' component={Info}/>
                                    <Route path='/backstage/me/logs' component={Logs}/>
                                    <Route path='/backstage/chart' component={Chart}/>
                                    <Route path='/backstage/financial/transaction' component={Transaction}/>
                                    <Route path='/backstage/financial/day' component={FinancialForDay} />
                                    <Route path='/backstage/financial/month' component={FinancialForMonth}/>
                                    <Route path='/backstage/financial/year' component={FinancialForYear}/>
                                    <Route path='/backstage/memory/news' component={News}/>
                                    <Route path='/backstage/memory/plan' component={Plan}/>
                                    <Route path='/backstage/memory/notes' component={Notes}/>
                                    <Route path='/backstage/memory/memo' component={Memo}/>
                                    <Route path='/backstage/oss/wallpaper' component={Wallpaper}/>
                                    <Route path='/backstage/oss/illustration' component={Illustration}/>
                                    <Route path='/backstage/oss/files' component={Files}/>
                                    <Route path='/backstage/oss/db' component={DB}/>
                                    {/*默认、及匹配不到时的页面*/}
                                    <Redirect to='/backstage/me/info'/>
                                </Switch>
                            </div>
                        </div>
                        <div className='operation-info'>
                            {
                                !(isEmptyObject(user.log)) ?
                                    <span>{`您上次操作时间:${user.log.date},操作地点:${user.log.city}(${user.log.ip}),操作明细:${user.log.logType.describe}`}</span> :
                                    <span>Hi，这是您第一次使用吧？如有需要帮助的请及时联系运营团队。</span>
                            }
                        </div>
                    </div>
                    <div className='quick-div'>
                        <Button type="link" title='记账' href="/backstage/financial/transaction"><MoneyCollectOutlined/></Button>
                        <Button type="link" title='发布动态' href="/backstage/memory/news/publish"><NotificationOutlined/></Button>
                        <Button type="link" title='日程安排' href="/backstage/memory/plan"><CarryOutOutlined/></Button>
                        <Button type="link" title='便利贴' href="/backstage/memory/memo"><PushpinOutlined/></Button>
                    </div>
                </section>
            </div>
        );
    }
}

// 对外暴露
export default LayoutBackend;
