import React, {Component} from 'react';
import {
    deleteJournalApi,
    JournalExcelApi,
    getTransactionList,
    monetaryListApi,
    generalJournalExcelApi,
    paymentMeansListApi
} from '@/api'
import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    FileExcelOutlined,
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import DocumentTitle from 'react-document-title'
import moment from 'moment';
import {Button, Col, DatePicker, Form, Modal, Select, Table} from "antd";
import {openNotificationWithIcon, showLoading} from "@/utils/window";
import JournalDeclare from './declare'
import JournalDetail from './detail'
import JournalRenew from './renew'
import axios from "axios";
import {disabledDate, eraseDateTimeT, extractUserName, formatMoney} from '@/utils/var'
import storageUtils from "@/utils/storageUtils";
/*
 * 文件名：transaction.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-27 - 21:46
 * 描述：流水申报
 */
const {RangePicker} = DatePicker;
const {Option} = Select;

// 定义组件（ES6）
class Journal extends Component {

    journalDetailRef = React.createRef();
    journalDeclareRef = React.createRef();
    journalRenewRef = React.createRef();


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
            means_id: null,//用户选择的交易类别
            monetary_id:null,//用户选择的币种
        },
        paymentMeans: [],// 查询专用交易方式
        monetary:[],//查询专用币种
        organize:storageUtils.get(storageUtils.ORGANIZE_KEY),
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '流水号',
                dataIndex: 'id', // 显示数据对应的属性名
                align:'center',
            },
            {
                title: '收入金额',
                dataIndex: 'income', // 显示数据对应的属性名
                align:'right',
                render:(value,row) => (formatMoney(row.income))
            },
            {
                title: '支出金额',
                dataIndex: 'outlay',// 显示数据对应的属性名
                align:'right',
                render:(value,row) => (formatMoney(row.outlay))
            },
            {
                title: '收支总额',
                dataIndex: 'total',// 显示数据对应的属性名
                align:'right',
                render:(value,row) => (formatMoney(row.total))
            },
            {
                title: '交易方式',
                dataIndex: 'payment_means_name',// 显示数据对应的属性名
                align:'center',
            },
            {
                title: '交易币种',
                dataIndex: 'monetary_name',// 显示数据对应的属性名
            },
            {
                title: '交易摘要',
                dataIndex: 'abstracts_name',// 显示数据对应的属性名
            },
            {
                title: '填报人',
                dataIndex: 'source',// 显示数据对应的属性名
                render:(value,row) => (extractUserName(this.state.organize, row.source))
            },
            {
                title: '交易时间',
                dataIndex: 'archive_date', // 显示数据对应的属性名
                align:'center',
            },
            {
                title: '交易附言',
                dataIndex: 'remarks', // 显示数据对应的属性名
                align:'left',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time', // 显示数据对应的属性名
                align:'center',
                render:(value,row) => (eraseDateTimeT(row.create_time))
            },
            {
                title: '修改时间',
                dataIndex: 'update_time', // 显示数据对应的属性名
                align:'center',
                render:(value,row) => (eraseDateTimeT(row.update_time))
            },
            {
                title: '管理',
                align:'center',
                render: (value, row) => (
                  <div>
                    <Button type="primary" onClick={() => this.openViewModal(row)} shape="circle"
                            icon={<EyeOutlined/>}/>
                    &nbsp;
                    <Button type="primary" onClick={() => this.openEditModal(row)} shape="circle"
                            icon={<EditOutlined/>}/>
                    &nbsp;
                    <Button type="danger" onClick={() => this.handleDelete(row)} shape="circle"
                            icon={<DeleteOutlined/>}/>
                  </div>
                ),
            },
        ]
    };

    /**
     * 获取财政列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            monetary_id: this.state.filters.monetary_id,
            means_id: this.state.filters.means_id,
            page_no: this.state.page_no,
            page_size: this.state.page_size,
            begin_time: this.state.filters.begin_time?this.state.filters.begin_time+'T00:00:00':null,
            end_time: this.state.filters.end_time?this.state.filters.end_time+'T23:59:59':null,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: showLoading()});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getTransactionList(para);
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
     * 刷新
     */
    reloadPage = () => {
        // 重置查询条件
        let _this = this;
        let filters = _this.state.filters;
        filters.begin_time = null;
        filters.end_time = null;
        filters.means_id = null;
        filters.monetary_id = null;
        _this.setState({
            page_no: 1,
            filters: filters,
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
            page_no: 1,
            page_size: page_size
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
     * 初始化页面基础数据
     * @returns {Promise<void>}
     */
    initDatas = async () => {
        this.getPaymentMeansData()
        this.getMonetaryData()
    };

    /**
     * 得到交易方式
     */
    getPaymentMeansData = async () => {
        let _this = this;
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await paymentMeansListApi();
        if (code === 0) {
            let type = [];
            data.forEach(item => {
                type.push((<Option key={item.id} value={item.id}>{item.name}</Option>));
            });
            let copyType = [];
            copyType.push(<Option key='-1' value="">请选择</Option>);
            copyType.push(type);
            _this.setState({
                paymentMeans: copyType
            })
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };


    /**
     * 得到币种
     */
    getMonetaryData = async () => {
        let _this = this;
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await monetaryListApi();
        if (code === 0) {
            let type = [];
            data.forEach(item => {
                type.push((<Option key={item.id} value={item.id}>{`${item.abbreviate}[${item.name}]`}</Option>));
            });
            let copyType = [];
            copyType.push(<Option key='' value="">请选择</Option>);
            copyType.push(type);
            _this.setState({
                monetary: copyType
            })
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
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
        if (dateString[0] !== '' && dateString[1] !== '') {
            filters.begin_time = dateString[0];
            filters.end_time = dateString[1];
        } else {
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
     * 交易方式选框发生改变
     * @param value
     */
    onPaymentMeansChangeType = (value) => {
        let _this = this;
        let filters = _this.state.filters;
        filters.means_id = value;
        _this.setState({
            filters,
            page_no: 1,
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 交易币种选框发生改变
     * @param value
     */
    onMonetaryChangeType = (value) => {
        let _this = this;
        let filters = _this.state.filters;
        filters.monetary_id = value;
        _this.setState({
            filters,
            page_no: 1,
        }, function () {
            _this.getDatas()
        });
    };

    /**
     * 财务流水申报弹框事件
     */
    handleAddModal = () => {
        const _this = this;
        // 触发子组件的调用
        _this.journalDeclareRef.handleDisplay()
    };

    /**
     * 预览流水详情
     */
    openViewModal = (value) => {
        const _this = this;
        value.source_name = extractUserName(this.state.organize, value.source)
        // 触发子组件的调用
        _this.journalDetailRef.handleDisplay(value)
    };

    /**
     * 打开编辑弹窗
     * @param value
     */
    openEditModal = (value) => {
        const _this = this;
        // 触发子组件的调用
        _this.journalRenewRef.handleDisplay(value);
    };

    bindJournalDetailRef = (ref) => {
        this.journalDetailRef = ref
    };

    bindJournalDeclareRef = (ref) => {
        this.journalDeclareRef = ref
    };

    bindJournalRenewRef = (ref) => {
        this.journalRenewRef = ref
    };

    /**
     * 删除流水申报
     */
    handleDelete = (item) => {
        let _this = this;
        Modal.confirm({
            title: '删除确认',
            content: `您确定删除流水号为${item.id}的流水及该流水下的所有明细的记录吗?`,
            onOk: async () => {
                // 在发请求前, 显示loading
                _this.setState({listLoading: true});
                const {msg, code} = await deleteJournalApi(item.id);
                // 在请求完成后, 隐藏loading
                _this.setState({listLoading: false});
                if (code === 0) {
                    openNotificationWithIcon("success", "操作结果", "删除成功");
                    _this.getDatas();
                } else {
                    openNotificationWithIcon("error", "错误提示", msg);
                }
            }
        })
    };

    /**
     * 导出财务流水
     */
    exportListExcel = () => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        let para = {
            monetary_id: this.state.filters.monetary_id,
            means_id: this.state.filters.means_id,
            begin_time: this.state.filters.begin_time,
            end_time: this.state.filters.end_time,
        };
        let access_token = storageUtils.get(storageUtils.ACCESS_KEY)
        axios({
            method: "GET",
            url: JournalExcelApi,   //接口地址
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
                let fileName = '财务流水报表.xlsx';//excel文件名称
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
                console.log(res);
                _this.setState({listLoading: false});
                openNotificationWithIcon("error", "错误提示", "导出财务流水报表失败");
            });
    };

    /**
     * 导出财务流水明细
     */
    exportInfoExcel = () => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        let access_token = storageUtils.get(storageUtils.ACCESS_KEY)
        let para = {
            monetary_id: this.state.filters.monetary_id,
            means_id: this.state.filters.means_id,
            begin_time: this.state.filters.begin_time,
            end_time: this.state.filters.end_time,
        };
        axios({
            method: "GET",
            url: generalJournalExcelApi,   //接口地址
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
                let fileName = '财务流水明细.xlsx';//excel文件名称
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
                console.log(res);
                _this.setState({listLoading: false});
                openNotificationWithIcon("error", "错误提示", "导出财务流水明细报表失败");
            });
    };

    /**
     * 财政申报页面专属的刷新方法
     */
    refreshListFromDeclare = () =>{
        this.getDatas();
    };

    /**
     * 财政修改页面专属的刷新方法
     */
    refreshListFromRenew = () =>{
        this.getDatas();
    };

    /**
     * 初始化页面配置信息
     */
    componentDidMount() {
      // 绑定刷新（供子页面调用）
      this.refreshListFromDeclare  = this.refreshListFromDeclare.bind(this);
      this.refreshListFromRenew  = this.refreshListFromRenew.bind(this);
      // 初始化表格属性设置
      this.initColumns();
      this.initDatas();
      // 加载页面数据
      this.getDatas();
    };

    render() {
        // 读取状态数据
        const {datas, dataTotal, page_no, page_size, listLoading, paymentMeans,monetary, filters} = this.state;
        let {begin_time, end_time, means_id,monetary_id} = filters;
        let rangeDate;
        if (begin_time !== null && end_time !== null) {
            rangeDate = [moment(begin_time), moment(end_time)]
        } else {
            rangeDate = [null, null]
        }
        return (
            <DocumentTitle title="收入支出">

                <div className='child-container'>
                    <div className='header-tools'>
                        收入支出
                    </div>
                    <div className='child-content'>
                        <JournalDeclare onRef={this.bindJournalDeclareRef.bind(this)} refreshList={this.refreshListFromDeclare}/>
                        <JournalDetail onRef={this.bindJournalDetailRef.bind(this)}/>
                        <JournalRenew onRef={this.bindJournalRenewRef.bind(this)} refreshList={this.refreshListFromRenew}/>
                        <Col span={24} className="toolbar">
                            <Form layout="inline">
                                <Form.Item label="交易方式:">
                                    <Select style={{width: '200px'}} value={means_id} showSearch
                                            onChange={this.onPaymentMeansChangeType} placeholder="请选择交易方式">
                                        {paymentMeans}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="交易币种:">
                                    <Select style={{width: '200px'}} value={monetary_id} showSearch
                                            onChange={this.onMonetaryChangeType} placeholder="请选择交易币种">
                                        {monetary}
                                    </Select>
                                </Form.Item>
                                <Form.Item label="填报时间:">
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
                                    <Button type="primary" htmlType="button" onClick={this.handleAddModal}>
                                        <PlusOutlined/>申报
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="button" onClick={this.exportListExcel}>
                                        <FileExcelOutlined/>流水
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="button" onClick={this.exportInfoExcel}>
                                        <FileExcelOutlined/>明细
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={24} className="dataTable">
                            <Table size="middle" rowKey="id" bordered loading={listLoading} columns={this.columns}
                                   dataSource={datas}
                                   pagination={{
                                       current:page_no,
                                       showTotal: () => `当前第${page_no}页 共${dataTotal}条`,
                                       pageSize: page_size,
                                       showQuickJumper: true,
                                       total: dataTotal,
                                       showSizeChanger: true,
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
export default Journal;
