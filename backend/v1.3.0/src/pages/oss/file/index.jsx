import React, {Component} from 'react';
import {Button, Col, DatePicker, Table, Form, Input, Modal, Upload} from "antd";
import {filePageApi, editFileApi, uploadFileApi, downloadFileApi, deleteFileApi} from "../../../api";
import {openNotificationWithIcon} from "@/utils/window";
import moment from 'moment';
import axios from "axios";
import DocumentTitle from 'react-document-title'
import {InboxOutlined,DeleteOutlined, CloudDownloadOutlined, EditOutlined, ReloadOutlined, SearchOutlined,CloudUploadOutlined} from "@ant-design/icons";
import {disabledDate, extractUserName} from "@/utils/var";
import storageUtils from "@/utils/storageUtils";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2022-10-03 - 17:31
 * 描述：文件管理主页
 */
const {RangePicker} = DatePicker;
const { Dragger } = Upload;

// 定义组件（ES6）
class Files extends Component {

    state = {
        // 返回的单元格数据
        datas: [],
        // 总数据行数
        dataTotal: 0,
        // 当前页
        page_no: 1,
        // 页面宽度
        page_size: 10,
        // 是否显示加载
        listLoading: false,
        //上传界面是否显示
        uploadVisible: false,
        organize:storageUtils.get(storageUtils.ORGANIZE_KEY),
        filters: {
            begin_time: null,// 搜索表单的开始时间
            end_time: null,// 搜索表单的结束时间
            file_name: null
        },
    };

    /**
     * 初始化上传组件信息
     */
    initUpload = () => {
        let _this = this;
        let access_token = storageUtils.get(storageUtils.ACCESS_KEY)
        const headers = {access_token:access_token}
        _this.uploadConfig = {
            name: 'file',
            multiple: true,
            action: uploadFileApi,
            headers,
            data: file => ({
                // data里存放的是接口的请求参数
                // 这里文件传递唯一序列码（前端生成）
                uid: file.uid,
            }),
            onRemove: file => {
                const { uid ,response} = file;
                // 如果response.code不为0，则表示这个文件在服务器端已经上传失败了，此时调用删除方法只需要删除浏览器上的即可
                if (response && 0 === response.code){
                    // 删除文件
                    _this.deleteFile({'uid':uid})
                }
            },
            onChange(info) {
                // 状态有：uploading done error removed
                const { status ,response} = info.file;
                if (status === 'done' || status === 'error') {
                    if (0 === response.code){
                        openNotificationWithIcon("success", "上传成功", `${info.file.name} file uploaded successfully.`);
                        _this.getDatas();
                    }else{
                        openNotificationWithIcon("error", "错误提示", `${info.file.name} file upload failed.cause by:${response.msg}`);
                    }
                }
            },
        };
    };

    /**
     * 初始化Table所有列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '文件名',
                dataIndex: 'file_name', // 显示数据对应的属性名
            },
            {
                title: '上传者',
                dataIndex: 'source', // 显示数据对应的属性名
                render:(value,row) => (extractUserName(this.state.organize, row.source))
            },
            {
                title: '状态',
                align: 'center',
                render: (text, record) => {
                    if (1 === record.status) {
                        return '已显示'
                    } else if (2 === record.status) {
                        return '已屏蔽'
                    } else {
                        return '未知'
                    }
                }
            },
            {
                title: '上传时间',
                dataIndex: 'create_time', // 显示数据对应的属性名
            },
            {
                title: '修改时间',
                dataIndex: 'update_time', // 显示数据对应的属性名
            },
            {
                title: '下载',
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={() => this.downloadFile(record)} shape="circle" icon={<CloudDownloadOutlined/>}/>
                        &nbsp;
                        <Button type="primary" onClick={() => this.handleChangeFile(record)} shape="circle" icon={<EditOutlined/>}/>
                        &nbsp;
                        <Button type="danger" onClick={() => this.handleDeleteFile(record)} shape="circle" icon={<DeleteOutlined/>}/>
                    </div>
                ),
            },
        ]
    };

    /**
     * 获取文件列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            page_no: this.state.page_no,
            page_size: this.state.page_size,
            begin_time: this.state.filters.begin_time,
            end_time: this.state.filters.end_time,
            file_name: this.state.filters.file_name,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await filePageApi(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            this.setState({
                // 总数据量
                dataTotal: data.total_row,
                // 表格数据
                datas: data.records
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /**
     * 重置查询条件
     */
    reloadPage = () => {
        // 重置查询条件
        let _this = this;
        let filters = _this.state.filters;
        filters.begin_time = null;
        filters.end_time = null;
        filters.file_name = null;
        _this.setState({
            page_no: 1,
            filters: filters
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 回调函数,改变页宽大小
     * @param page_size
     * @param current
     */
    changePageSize = (page_size, current) => {
        // react在生命周期和event handler里的setState会被合并（异步）处理,需要在回调里回去获取更新后的 state.
        this.setState({
            page_no: 1,
            page_size: page_size
        }, function () {
            this.getDatas();
        });
    };

    /**
     * 回调函数，页面发生跳转
     * @param current
     */
    changePage = (current) => {
        this.setState({
            page_no: current,
        }, function () {
            this.getDatas();
        });
    };

    /**
     * 日期选择发生变化
     * @param date
     * @param dateString
     */
    onChangeDate = (date, dateString) => {
        let _this = this;
        let {filters} = _this.state;
        // 为空要单独判断
        if (dateString[0] !== '' && dateString[1] !== ''){
            filters.begin_time = dateString[0];
            filters.end_time = dateString[1];
        }else{
            filters.begin_time = null;
            filters.end_time = null;
        }
        _this.setState({
            page_no: 1,
            filters
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 接口名文本框内容改变事件（用于双向绑定数据）
     * @param event
     */
    fileInputChange = (event) => {
        let _this = this;
        const value = event.target.value;
        let filters = _this.state.filters;
        filters.file_name = value;
        _this.setState({
            page_no: 1,
            filters
        })
    };

    /**
     * 取消上传
     */
    handleCancelUpload = () => {
        let _this = this;
        let uploadVisible = false;
        _this.setState({
            uploadVisible
        })
    };

    /**
     * 打开上传框
     */
    handleOpenUpload = () => {
        let _this = this;
        let uploadVisible = true;
        _this.setState({
            uploadVisible
        })
    };

    /**
     * 删除文件
     */
    deleteFile = async (para) => {
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code} = await deleteFileApi(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            openNotificationWithIcon("success", "操作结果", "删除成功");
            this.getDatas();
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /**
     * 弹框确认删除
     */
    handleDeleteFile = (item) => {
        let _this = this;
        Modal.confirm({
            title: '删除确认',
            content: `确认文件名为:'${item.file_name}'的文件吗?`,
            onOk: () => {
                let para = { id: item.id };
                _this.deleteFile(para)
            }
        })
    };

    /**
     * 下载文件
     * @param row
     */
    downloadFile = (row) => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        let access_token = storageUtils.get(storageUtils.ACCESS_KEY)
        axios({
            method: "GET",
            url: downloadFileApi+row.id,   //接口地址
            responseType: 'blob',
            //上面这个参数不加会乱码，据说{responseType: 'arraybuffer'}也可以
            headers: {
                "Content-Type": "application/json",
                "access_token":access_token
            },
        })
            .then(function (res) {
                console.log(res)
                _this.setState({listLoading: false});
                let file_name = row.file_name;//文件名称
                let blob = new Blob([res.data]);
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, file_name);
                } else {
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = file_name;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            })
            .catch(function (res) {
                _this.setState({listLoading: false});
                openNotificationWithIcon("error", "错误提示", "下载文件失败"+res);
            });
    };

    /**
     * 改变文件状态
     * @param item
     */
    handleChangeFile = (item) => {
        const _this = this;
        let message = '';
        let sendStatus = null;
        if (1 === item.status) {
            // 屏蔽
            sendStatus = 2;
            message = `您确定要屏蔽文件名为：' ${item.file_name} '的文件吗？`
        } else {
            // 显示
            sendStatus = 1;
            message = `您确定要显示文件名为：' ${item.file_name} '的文件吗？`
        }
        Modal.confirm({
            title: '修改确认',
            content: message,
            onOk: async () => {
                let para = { id: item.id, status: sendStatus };
                // 在发请求前, 显示loading
                _this.setState({listLoading: true});
                // 发异步ajax请求, 获取数据
                const {msg, code} = await editFileApi(para);
                // 在请求完成后, 隐藏loading
                _this.setState({listLoading: false});
                if (code === 0) {
                    openNotificationWithIcon("success", "操作结果", "修改成功");
                    _this.getDatas();
                } else {
                    openNotificationWithIcon("error", "错误提示", msg);
                }
            }
        })

    };

    /**
     * 为第一次render()准备数据  因为要异步加载数据，所以方法改为async执行
     */
    componentDidMount() {
        // 初始化上传组件配置
        this.initUpload();
        // 初始化表格属性设置
        this.initColumns();
        // 加载页面数据
        this.getDatas();
    };


    render() {
        // 读取状态数据
        const {datas, dataTotal, page_no, page_size, listLoading,filters, uploadVisible} = this.state;
        let {begin_time,end_time} = filters;
        let rangeDate;
        if (begin_time !== null && end_time !== null){
            rangeDate = [moment(begin_time),moment(end_time)]
        } else {
            rangeDate = [null,null]
        }
        return (
            <DocumentTitle title='文件管理'>
                <div className='child-container'>
                    <div className='header-tools'>
                        文件管理
                    </div>
                    <div className='child-content'>
                        <Col span={24} className="toolbar">
                            <Form layout="inline">
                                <Form.Item label="文件名:">
                                    <Input type='text' value={filters.file_name} onChange={this.fileInputChange}
                                           placeholder='请输入文件名'/>
                                </Form.Item>
                                <Form.Item label="上传时间:">
                                    <RangePicker value={rangeDate} disabledDate={disabledDate} onChange={this.onChangeDate}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="button" onClick={this.getDatas}>
                                      <SearchOutlined/>查询
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="button" onClick={this.reloadPage}>
                                      <ReloadOutlined/>重置
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="button" onClick={this.handleOpenUpload}>
                                        <CloudUploadOutlined/>上传
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={24} className="dataTable">
                            <Table size="middle" rowKey="id" bordered loading={listLoading} columns={this.columns} dataSource={datas}
                                   pagination={{
                                       current:page_no,
                                       showTotal: () => `当前第${page_no}页 共${dataTotal}条`,
                                       pageSize: page_size, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
                                       onShowSizeChange: (current, page_size) => this.changePageSize(page_size, current),
                                       onChange: this.changePage,
                                   }}/>
                        </Col>
                        <Modal
                            title="上传文件"
                            open={uploadVisible === true}
                            onOk={this.handleCancelUpload}
                            onCancel={this.handleCancelUpload}>
                            <Dragger {...this.uploadConfig}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                                <p className="ant-upload-hint">
                                    支持单个或批量上传，单个文件大小不能超过10M，禁止上传exe/bat等可执行文件。
                                </p>
                            </Dragger>
                        </Modal>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Files;
