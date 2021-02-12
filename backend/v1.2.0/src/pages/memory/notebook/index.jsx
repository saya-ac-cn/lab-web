import React, {Component} from 'react';
import {Button, Col, Tag, Input, Table, Form, Modal} from "antd";
import {deleteNoteBook, getNoteBookList} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import DocumentTitle from 'react-document-title'
import {DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import EditNoteBook from "./edit";

/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-24 - 21:58
 * 描述：笔记簿管理
 */

// 定义组件（ES6）
class NoteBook extends Component {

  bookFormRef = React.createRef();

    state = {
        // 返回的单元格数据
        datas: [],
        // 总数据行数
        dataTotal: 0,
        // 当前页
        nowPage: 1,
        // 页面宽度
        pageSize: 10,
        // 是否显示加载
        listLoading: false,
        filters: {
            name: null,// 笔记簿名
            status: null// 笔记簿状态
        },
    };

    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '笔记簿名',
                dataIndex: 'name', // 显示数据对应的属性名
                align:'center',
            },
            {
                title: '状态',
                align:'center',
                render: (text, record) => {
                    if (record.status === 1) {
                        return <Tag color="success">已公开</Tag>
                    } else if (record.status === 2) {
                        return <Tag color="error">已屏蔽</Tag>
                    } else {
                        return <Tag color="warning">未知</Tag>
                    }
                }
            },
            {
                title: '创建者',
                dataIndex: 'source', // 显示数据对应的属性名
                align:'center',
            },
            {
                title: '笔记总数',
                dataIndex: 'notesCount', // 显示数据对应的属性名
                align:'right',
            },
            {
                title: '操作',
                align:'center',
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={() => this.handleModalEdit(record)} shape="circle" icon={<EditOutlined/>}/>
                        &nbsp;
                        <Button type="danger"  onClick={() => this.handleDeleteNoteBook(record)} shape="circle" icon={<DeleteOutlined/>}/>
                    </div>
                ),
            },
        ]
    };

    /**
     * 获取笔记簿列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            name: this.state.filters.name,
            nowPage: this.state.nowPage,
            pageSize: this.state.pageSize,
            status: this.state.filters.status
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getNoteBookList(para);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            this.setState({
                // 总数据量
                dataTotal: data.dateSum,
                // 表格数据
                datas: data.grid
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
        filters.name = null;
        filters.status = null;
        _this.setState({
            nowPage: 1,
            filters: filters,
        }, function () {
            _this.getDatas()
        });
    };

    // 回调函数,改变页宽大小
    changePageSize = (pageSize, current) => {
        // react在生命周期和event handler里的setState会被合并（异步）处理,需要在回调里回去获取更新后的 state.
        this.setState({
            nowPage: 1,
            pageSize: pageSize
        }, function () {
            this.getDatas();
        });
    };

    // 回调函数，页面发生跳转
    changePage = (current) => {
        this.setState({
            nowPage: current,
        }, function () {
            this.getDatas();
        });
    };

    /*
     * 显示添加的弹窗
     */
    handleModalAdd = () => {
      this.bookFormRef.handleDisplay({});
    };

    /*
    * 显示修改的弹窗
    */
    handleModalEdit = (value) => {
      this.bookFormRef.handleDisplay(value);
    };

    bindBookFormRef = (ref) => {
      this.bookFormRef = ref
    };

    refreshListFromBookForm= () =>{
      this.getDatas();
    };

    /*
    * 删除指定笔记簿
    */
    handleDeleteNoteBook = (item) => {
        let _this = this;
        let tips = '';
        if (item.notesCount > 0){
            tips = `“${item.name}”笔记簿下还有：${item.notesCount}条笔记，您确认删除该笔记簿及该笔记簿下的所有笔记？`
        }else{
            tips = `您确认删除“${item.name}”空笔记簿？`
        }
        Modal.confirm({
            title: '删除确认',
            content: tips,
            cancelText: '再想想',
            okText: '不要啦',
            onOk: async () => {
                // 在发请求前, 显示loading
                _this.setState({listLoading: true});
                let para = { id: item.id };
                const {msg, code} = await deleteNoteBook(para);
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
     * 双向绑定用户查询主题
     * @param event
     */
    nameInputChange = (event) => {
        let _this = this;
        const value = event.target.value;
        let filters = _this.state.filters;
        filters.name = value;
        _this.setState({
            nowPage: 1,
            filters
        })
    };

    /*
     * 为第一次render()准备数据
     * 因为要异步加载数据，所以方法改为async执行
     */
    componentDidMount() {
      // 初始化表格属性设置
      this.initColumns();
      this.refreshListFromBookForm  = this.refreshListFromBookForm.bind(this);
      // 加载页面数据
      this.getDatas();
    };


    render() {
        // 读取状态数据
        const {datas, dataTotal, nowPage, pageSize, listLoading,filters} = this.state;
        return (
            <DocumentTitle title="笔记分类">
                <section>
                    <Col span={24} className="toolbar">
                        <Form layout="inline">
                            <Form.Item label="笔记簿:">
                                <Input type='text' value={filters.name} onChange={this.nameInputChange}
                                       placeholder='按笔记簿检索'/>
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
                                <Button type="primary" htmlType="button" onClick={this.handleModalAdd}>
                                  <PlusOutlined/>发布
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24} className="dataTable">
                        <Table size="middle" rowKey="id" bordered loading={listLoading} columns={this.columns} dataSource={datas}
                               pagination={{
                                   current:nowPage,
                                   showTotal: () => `当前第${nowPage}页 共${dataTotal}条`,
                                   pageSize: pageSize, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
                                   onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
                                   onChange: this.changePage,
                               }}/>
                    </Col>
                  <EditNoteBook onRef={this.bindBookFormRef.bind(this)} refreshList={this.refreshListFromBookForm}/>
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default NoteBook;
