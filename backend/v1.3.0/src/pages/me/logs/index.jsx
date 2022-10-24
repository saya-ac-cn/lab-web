import React, {Component} from 'react';
import {Col, Form, Button, Table, DatePicker, Select} from 'antd';
import {logPageApi, logTypeListApi, downloadLogExcelApi} from '../../../api'
import {openNotificationWithIcon} from '@/utils/window'
import {SearchOutlined,ReloadOutlined,FileExcelOutlined} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios'
import DocumentTitle from 'react-document-title'
import {disabledDate, extractUserName, eraseDateTimeT} from "@/utils/var"
import storageUtils from "@/utils/storageUtils";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2022-10-04 - 22:31
 * 描述：日志查看
 */
const {RangePicker} = DatePicker;
const {Option} = Select;

// 定义组件（ES6）
class Logs extends Component {

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
        organize:storageUtils.get(storageUtils.ORGANIZE_KEY),
        filters: {
            // 查询的日期
            date: null,
            begin_time: null,// 搜索表单的开始时间
            end_time: null,// 搜索表单的结束时间
            category: ''//用户选择的日志类别
        },
        type: [],// 系统返回的日志类别
    };

    /**
     * 初始化Table所有列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '编号',
                dataIndex: 'id', // 显示数据对应的属性名
                align:'right',
            },
            {
                title: '用户',
                dataIndex: 'user', // 显示数据对应的属性名
                align:'center',
                render:(value,row) => (extractUserName(this.state.organize, row.user))
            },
            {
                title: '操作详情',
                dataIndex: 'detail', // 显示数据对应的属性名
            },
            {
                title: 'ip',
                dataIndex: 'ip', // 显示数据对应的属性名
                align:'center',
            },
            {
                title: '城市',
                dataIndex: 'city', // 显示数据对应的属性名
            },
            {
                title: '日期',
                dataIndex: 'date', // 显示数据对应的属性名
                align:'center',
                render:(value,row) => (eraseDateTimeT(row.date))
            }
        ]
    };

    /**
     * 获取日志类别
     * @returns {Promise<void>}
     */
    getTypeData = async () => {
        let _this = this;
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await logTypeListApi();
        if (code === 0) {
            // 利用更新状态的回调函数，渲染下拉选框
            let type = [];
            type.push((<Option key={-1} value="">请选择</Option>));
            data.forEach(item => {
                type.push((<Option key={item.category} value={item.category}>{item.describe}</Option>));
            });
            _this.setState({
                type
            });
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    /**
     * 获取日志数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let _this = this;
        let para = {
            page_no: _this.state.page_no,
            page_size: _this.state.page_size,
            category: _this.state.filters.category,
            begin_time: this.state.filters.begin_time?this.state.filters.begin_time+'T00:00:00':null,
            end_time: this.state.filters.end_time?this.state.filters.end_time+'T23:59:59':null,
        };
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await logPageApi(para);
        // 在请求完成后, 隐藏loading
        _this.setState({listLoading: false});
        if (code === 0) {
            _this.setState({
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
        let _this = this;
        let filters = _this.state.filters;
        filters.begin_time = null;
        filters.end_time = null;
        filters.category = '';
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
        let _this = this;
        // react在生命周期和event handler里的setState会被合并（异步）处理,需要在回调里回去获取更新后的 state.
        _this.setState({
            page_size: page_size,
            page_no: 1,
        }, function () {
            _this.getDatas();
        });
    };

    /**
     * 回调函数，页面发生跳转
     * @param current
     */
    changePage = (current) => {
        let _this = this;
        _this.setState({
            page_no: current,
        }, function () {
            _this.getDatas();
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
            filters,
            page_no: 1,
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 日志选框发生改变
     * @param value
     */
    onChangeType = (value) => {
        let _this = this;
        let {filters} = _this.state;
        filters.category = value;
        _this.setState({
            filters,
            page_no: 1,
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 导出Excel
     */
    exportExcel = () => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        let access_token = storageUtils.get(storageUtils.ACCESS_KEY)
        let para = {
            type: this.state.filters.category,
            begin_time: this.state.filters.begin_time?this.state.filters.begin_time+'T00:00:00':null,
            end_time: this.state.filters.end_time?this.state.filters.end_time+'T23:59:59':null,
        };
        axios({
            method: "GET",
            url: downloadLogExcelApi,   //接口地址
            params: para,           //接口参数
            responseType: 'blob',
            //上面这个参数不加会乱码，据说{responseType: 'arraybuffer'}也可以
            headers: {
                "Content-Type": "application/json",
                "access_token":access_token
            },
        })
            .then(function (res) {
                _this.setState({listLoading: false});
                let fileName = '操作日志报表.xlsx';//excel文件名称
                let blob = new Blob([res.data], {type: 'application/x-xlsx'});   //word文档为msword,pdf文档为pdf，excel文档为x-xls
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, fileName);
                } else {
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                    window.URL.revokeObjectURL(link.href);
                }
            })
            .catch(function (res) {
                _this.setState({listLoading: false});
                openNotificationWithIcon("error", "错误提示", "导出日志报表失败");
            });
    };


    /**
     * 为第一次render()准备数据  因为要异步加载数据，所以方法改为async执行
     */
    componentDidMount() {
      // 初始化日志类别数据
      this.getTypeData();
      // 初始化表格属性设置
      this.initColumns();
      // 加载页面数据
      this.getDatas();
    };

    render() {
        // 读取状态数据
        const {datas, dataTotal, page_no, page_size, listLoading,filters, type} = this.state;
        let {begin_time,end_time} = filters;
        let rangeDate;
        if (begin_time !== null && end_time !== null){
            rangeDate = [moment(begin_time),moment(end_time)]
        } else {
            rangeDate = [null,null]
        }
        return (
            <DocumentTitle title='操作日志'>
                <div className='child-container'>
                    <div className='header-tools'>
                        操作日志
                    </div>
                    <div className='child-content'>
                        <Col span={24} className="toolbar">
                            <Form layout="inline">
                                <Form.Item label="操作类别:">
                                    <Select value={filters.category} style={{width:'10em'}} showSearch onChange={this.onChangeType}
                                            placeholder="请选择操作类别">
                                        {type}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="操作时间:">
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
                                    <Button type="primary" htmlType="button" onClick={this.exportExcel}>
                                        <FileExcelOutlined/>导出
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
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default Logs;
