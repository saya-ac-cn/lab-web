import React, {Component} from 'react';
import {Button, Input,DatePicker,Form} from "antd";
import {FormOutlined, CheckOutlined,CloseOutlined} from "@ant-design/icons";
import DocumentTitle from 'react-document-title'
import './index.less'
import Cropper from '@/component/cropper'
import {clearTrimValueEvent} from "@/utils/string";
import moment from "moment";
import {returnDefaultValue} from '@/utils/var'
import {editPwdApi,editUserInfoApi} from "@/api";
import {openNotificationWithIcon} from "@/utils/window";
import storageUtils from "@/utils/storageUtils";
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2022/10/04 - 10:33 上午
 * 描述：
 */

// 定义组件（ES6）
class Info extends Component {

    pwdFormRef = React.createRef();


    state = {
        loading:{
            password:false,
            autograph:false,
            birthday:false,
            hometown:false,
        },
        status:{
            autograph:false,
            birthday:false,
            hometown:false,
            password:false,
        },
        user: {},
        form: {}
    }

    /**
     * 切换 文本框编辑状态
     * @param field 字段名
     * @param value 字段值
     */
    handleEditInput = (field,value) => {
        let _this = this;
        let {status,form,user} = _this.state
        status[field] = value
        if (value){
            // 用户进入编辑
            form[field] = user[field]
            _this.setState({
                status,form
            })
        }else{
            // 用户退出编辑
            //form[field] = user[field]
            _this.setState({
                status
            })
        }
    };

    /**
     * 文本框保存
     * @param field 字段名
     */
    handleEditInputSubmit = async (field) => {
        let _this = this;
        let {status, form, user,loading} = _this.state
        // 首先是从form中提取数据，主要是判断是否为空
        const value = form[field]
        if (null === value || '' === value) {
            openNotificationWithIcon("error", "错误提示", '不允许提交空内容');
            return;
        }
        // 构造提交参数
        let args = {account: user.account}
        args[field] = value
        // 修改loading
        loading[field] = true
        _this.setState({loading});
        const result = await editUserInfoApi(args);
        loading[field] = false
        let {msg, code} = result;
        if (code === 0) {
            // 修改成功后，及时回填值
            status[field] = false
            user[field] = value
            _this.setState({loading,status,user});
            storageUtils.add(storageUtils.USER_KEY,user)
            openNotificationWithIcon("success", "操作结果", "个人信息修改成功");
        } else {
            _this.setState({loading});
            openNotificationWithIcon("error", "错误提示", msg);
        }
    }


    /**
     * 双向绑定日期选择
     * @param date
     * @param dateString
     */
    dateChange = (date, dateString) => {
        const _this = this;
        let { form } = this.state;
        form.birthday = dateString;
        _this.setState({form});
    };

    /**
     * 双向绑定文本框
     * @param event 时间
     * @param field 字段
     */
    inputChange = (event,field) => {
        let _this = this;
        const value = event.target.value;
        let { form } = this.state;
        form[field] = value.replace(/\s+/g, '');
        _this.setState({form});
    };

    /**
     * 密码提交修改
     */
    handlePwdFormSubmit = () => {
        let _this = this;
        let {loading,user} = _this.state;
        _this.pwdFormRef.current.validateFields(['password']).then( async value => {
            // 通过验证
            let args = {
                password: value.password,
                account:user.account
            };
            loading.password = true
            _this.setState({loading});
            const result = await editPwdApi(args);
            loading.password = false
            _this.setState({loading});
            let {msg, code} = result;
            if (code === 0) {
                _this.handleEditInput('password',false)
                openNotificationWithIcon("success", "操作结果", "密码修改成功");
            } else {
                openNotificationWithIcon("error", "错误提示", msg);
            }
        })
    };

    /**
     * 为第一次render()准备数据  因为要异步加载数据，所以方法改为async执行
     */
    componentDidMount() {
        this.formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16},
        };
        this.buttonItemLayout = {
            wrapperCol: {span: 16, offset: 8},
        };
        const user = storageUtils.get(storageUtils.USER_KEY);
        const _this = this;
        _this.setState({user})
        // _this.props.onRef(_this);
    };

    render() {
        // 读取状态数据
        const {status, user,form,loading} = this.state;
        let pickerDate;
        if (form.birthday !== null){
            pickerDate = moment(form.birthday)
        } else {
            pickerDate = null
        }
        return (
            <DocumentTitle title='个人信息'>
                <div className='child-container'>
                    <div className='header-tools'>
                        个人信息
                    </div>
                    <div className='child-content'>
                        <div className='about-me'>
                            <div className='about-me-advance'>
                                <div className='about-me-basic'>
                                    <div className='about-me-section'>基本信息</div>
                                    <div className='about-me-logo'>
                                        <Cropper/>
                                    </div>
                                    <div className='about-me-advance-line'>
                                        <label className='about-me-lable'>账号</label>
                                        <div><span className='about-me-value'>{returnDefaultValue(user.account)}</span></div>
                                    </div>
                                    <div className='about-me-advance-line'>
                                        <label className='about-me-lable'>姓名</label>
                                        <div><span className='about-me-value'>{returnDefaultValue(user.name)}</span></div>
                                    </div>
                                    <div className='about-me-advance-line'>
                                        <label className='about-me-lable'>性别</label>
                                        <div><span className='about-me-value'>{returnDefaultValue(user.sex)}</span></div>
                                    </div>
                                    <div className='about-me-advance-line'>
                                        <label className='about-me-lable'>生日</label>
                                        <div>
                                            {
                                                status.birthday
                                                    ? <div className='about-me-advance-field-area'><DatePicker className='about-me-advance-value' onChange={this.dateChange} value={pickerDate}/><Button type="primary" loading={loading.birthday} onClick={() => this.handleEditInputSubmit('birthday')} className='about-me-save-btn' htmlType="button">保存</Button> <Button className='about-me-cancel-btn' type="primary" onClick={() => this.handleEditInput('birthday',false)} htmlType="button">取消</Button></div>
                                                    :<div className='about-me-advance-field-area'><span className='about-me-value'>{returnDefaultValue(user.birthday)}</span><FormOutlined onClick={() => this.handleEditInput('birthday',true)} className='edit-status'/></div>
                                            }
                                        </div>
                                    </div>
                                    <div className='about-me-advance-line'>
                                        <label className='about-me-lable'>故乡</label>
                                        <div>
                                            {
                                                status.hometown
                                                    ? <div className='about-me-advance-field-area'><Input className='about-me-advance-value' onChange={(e)=>this.inputChange(e,'hometown')} value={form.hometown} maxLength={20}/><Button type="primary" loading={loading.hometown} onClick={() => this.handleEditInputSubmit('hometown')} className='about-me-save-btn' htmlType="button">保存</Button> <Button className='about-me-cancel-btn' type="primary" onClick={() => this.handleEditInput('hometown',false)} htmlType="button">取消</Button></div>
                                                    :<div className='about-me-advance-field-area'><span className='about-me-value'>{returnDefaultValue(user.hometown)}</span><FormOutlined onClick={() => this.handleEditInput('hometown',true)} className='edit-status'/></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='about-me-more'>

                                    <div className='about-me-autograph'>
                                        <label className='about-me-section'>个性签名</label>
                                        <div>
                                            {
                                                status.autograph
                                                    ? <div className='about-me-autograph-area'><Input className='about-me-autograph-value' onChange={(e)=>this.inputChange(e,'autograph')} value={form.autograph} maxLength={80}/><Button type="primary" loading={loading.autograph} onClick={() => this.handleEditInputSubmit('autograph')} className='about-me-save-btn' htmlType="button">保存</Button> <Button className='about-me-cancel-btn' type="primary" onClick={() => this.handleEditInput('autograph',false)} htmlType="button">取消</Button></div>
                                                    :<div className='about-me-autograph-area'><span className='about-me-value'>{user.autograph}</span><FormOutlined onClick={() => this.handleEditInput('autograph',true)} className='edit-status'/></div>
                                            }
                                        </div>
                                    </div>

                                    <div className='about-me-section'>通讯信息</div>
                                    <div className='about-me-advance-line'>
                                        <label className='about-me-lable'>组织号</label>
                                        <div><span className='about-me-value'>{returnDefaultValue(user.organize_id)}</span></div>
                                    </div>
                                    <div className='about-me-advance-line'>
                                        <label className='about-me-lable'>绑定QQ</label>
                                        <div><span className='about-me-value'>{returnDefaultValue(user.qq)}</span></div>
                                    </div>
                                    <div className='about-me-advance-line'>
                                        <label className='about-me-lable'>绑定手机</label>
                                        <div><span className='about-me-value'>{returnDefaultValue(user.phone)}</span></div>
                                    </div>
                                    <div className='about-me-advance-line'>
                                        <label className='about-me-lable'>绑定邮箱</label>
                                        <div><span className='about-me-value'>{returnDefaultValue(user.email)}</span></div>
                                    </div>
                                    <div className='about-me-section about-me-security-section'>安全设置</div>
                                    <div className='about-me-password-line'>
                                        {
                                            status.password
                                                ?
                                                <Form className='about-me-password-form' onFinish={this.handlePwdFormSubmit} {...this.formItemLayout} ref={this.pwdFormRef}>
                                                    <Form.Item name="password" label="密码" getValueFromEvent={ (e) => clearTrimValueEvent(e)} rules={[{required: true,message: '请输入密码!'},{min: 6, message: '长度在 6 到 32 个字符'}, {max: 32, message: '长度在 6 到 32 个字符'}]} hasFeedback>
                                                        <Input.Password />
                                                    </Form.Item>
                                                    <Form.Item name="confirm" label="确认密码" getValueFromEvent={ (e) => clearTrimValueEvent(e)} dependencies={['password']} hasFeedback
                                                        rules={[
                                                            {min: 6, message: '长度在 6 到 32 个字符'}, {max: 32, message: '长度在 6 到 32 个字符'},
                                                            {required: true,message: '请输入密码!'},
                                                            ({ getFieldValue }) => ({
                                                                validator(_, value) {
                                                                    if (!value || getFieldValue('password') === value) {
                                                                        return Promise.resolve();
                                                                    }
                                                                    return Promise.reject(new Error('您两次输入的密码不一致!'));
                                                                },
                                                            }),
                                                        ]}
                                                    >
                                                        <Input.Password />
                                                    </Form.Item>
                                                    <Form.Item {...this.buttonItemLayout}>
                                                        <Button htmlType="submit" type="primary" loading={loading.password}>
                                                            保存
                                                        </Button>
                                                        <Button htmlType="button" style={{ margin: '0 8px' }} onClick={() => this.handleEditInput('password',false)}>
                                                            取消
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                                :<div className='about-me-advance-password'>
                                                    <label className='about-me-lable'>密码</label>
                                                    <div><span className='about-me-value'>********</span><FormOutlined onClick={() => this.handleEditInput('password',true)} className='edit-status'/></div>
                                                </div>
                                        }
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
export default Info;
