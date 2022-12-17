import React, {Component} from 'react';
import {dbDumpPageApi} from "@/api";
import {openNotificationWithIcon} from "@/utils/window";
import {Button, Col, Form, DatePicker, Table} from "antd";
import DocumentTitle from 'react-document-title'
import {ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import {disabledDate} from "@/utils/var";
import moment from 'moment';

/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2022-10-02 - 22:44
 * 描述：数据库备份管理
 */
const {RangePicker} = DatePicker;

// 定义组件（ES6）
class DB extends Component {

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
        filters: {
            begin_time: null,// 搜索表单的开始时间
            end_time: null,// 搜索表单的结束时间
        },
    };

    /**
     * 初始化Table所有列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '执行编号',
                dataIndex: 'id', // 显示数据对应的属性名
            },
            {
                title: '归档日期',
                dataIndex: 'archive_date', // 显示数据对应的属性名
            },
            {
                title: '归档目录',
                dataIndex: 'url', // 显示数据对应的属性名
            },
            {
                title: '备份时间',
                dataIndex: 'execute_data', // 显示数据对应的属性名
            }
        ]
    };

    /**
     * 获取备份数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            page_no: this.state.page_no,
            page_size: this.state.page_size,
            begin_time: this.state.filters.begin_time,
            end_time: this.state.filters.end_time,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await dbDumpPageApi(para);
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
        const _this = this;
        let filters = _this.state.filters;
        filters.begin_time = null;
        filters.end_time = null;
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
        const _this = this;
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
     * 为第一次render()准备数据  因为要异步加载数据，所以方法改为async执行
     */
    componentDidMount() {
      // 初始化表格属性设置
      this.initColumns();
      // 加载页面数据
      this.getDatas();
    };

    render() {
        // 读取状态数据
        const {datas, dataTotal, page_no, page_size, listLoading,filters} = this.state;
        let {begin_time,end_time} = filters;
        let rangeDate;
        if (begin_time !== null && end_time !== null){
            rangeDate = [moment(begin_time),moment(end_time)]
        } else {
            rangeDate = [null,null]
        }
        return (
            <DocumentTitle title='数据备份'>
                <div className='child-container'>
                    <div className='header-tools'>
                        数据备份
                    </div>
                    <div className='child-content'>
                        <Col span={24} className="toolbar">
                            <Form layout="inline">
                                <Form.Item label="归档时间:">
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
                            </Form>
                        </Col>
                        <Col span={24} className="dataTable">
                            <Table size="middle" bordered rowKey="url" loading={listLoading} columns={this.columns} dataSource={datas}
                                   pagination={{
                                       current:page_no,
                                       showTotal: () => `当前第${page_no}页 共${dataTotal}条`,
                                       page_size: page_size, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
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
export default DB;
