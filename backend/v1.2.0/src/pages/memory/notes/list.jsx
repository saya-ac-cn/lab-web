import React, {Component} from 'react';
import {Button, Col, DatePicker, Input, Table, Form, Modal, Tag, Select} from "antd";
import {getNotesList, deleteNotes, getNoteBookGroup} from "../../../api";
import {openNotificationWithIcon} from "../../../utils/window";
import {Link} from "react-router-dom";
import DocumentTitle from 'react-document-title'
import moment from 'moment';
import {DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import {disabledDate} from "../../../utils/var"
import {getUrlParameter} from "../../../utils/url"
/*
 * 文件名：list.jsx
 * 作者：liunengkai
 * 创建日期：2019-08-26 - 21:09
 * 描述：笔记列表
 * 注意：在本页面中，不显示笔记搜索框
 */
const {RangePicker} = DatePicker;
const {Option} = Select;
// 定义组件（ES6）
class NotesList extends Component {

    constructor(props) {
        super(props);
        let _this = this
        // 提取参数
        const search = getUrlParameter ('search',props.location.search);
        let state = {
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
          tagColor:['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple'],
          notebooks: [],
        };
        if (!!search){
          state.filters = {
            beginTime: null,// 搜索表单的开始时间
            endTime: null,// 搜索表单的结束时间
            topic: search, // 主题
            notebookId: null
          }
        }else{
          state.filters = {
            beginTime: null,// 搜索表单的开始时间
            endTime: null,// 搜索表单的结束时间
            topic: null, // 主题
            notebookId: null
          }
        }
      _this.state = state
    }


    /*
    * 初始化Table所有列的数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '作者',
                render: (value, row) => (
                  <span>{!row.notebook?'-':row.notebook.source}</span>
                ),
            },
            {
                title: '笔记分类',
                render: (value, row) => (
                  <span>{!row.notebook?'-':row.notebook.name}</span>
                ),
            },
            {
                title: '标题',
                dataIndex: 'topic', // 显示数据对应的属性名
            },
            {
              title: '标签',
              render: (value, row) => {
                const tags = row.label === null ? [] : (row.label).split(';')
                if (tags.length > 0){
                  return tags.map(this.forTagMap)
                }else{
                  return ''
                }
              },
            },
            {
                title: '创建时间',
                dataIndex: 'createtime', // 显示数据对应的属性名
            },
            {
                title: '修改时间',
                dataIndex: 'updatetime', // 显示数据对应的属性名
            },
            {
                title: '管理',
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={() => this.props.history.push('/backstage/memory/notes/update', record)} shape="circle" icon={<EditOutlined/>}/>
                        &nbsp;
                        <Button type="danger"  shape="circle" onClick={() => this.handleDeleteNotes(record)} icon={<DeleteOutlined/>}/>
                    </div>
                ),
            },
        ]
    };

  forTagMap = tag => {
    let colors = this.state.tagColor;
    const tagElem = (
      <Tag color={colors[Math.floor(Math.random()*10)]}>
        {tag}
      </Tag>
    );
    return (<span key={tag} style={{ display: 'inline-block' }}>{tagElem}</span>
    );
  };

    /**
     * 获取笔记列表数据
     * @returns {Promise<void>}
     */
    getDatas = async () => {
        let para = {
            'nowPage': this.state.nowPage,
            'topic': this.state.filters.topic,
            'notebookId':this.state.filters.notebookId,
            'beginTime': this.state.filters.beginTime,
            'endTime': this.state.filters.endTime,
            'pageSize': this.state.pageSize,
        };
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getNotesList(para);
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
   * 得到笔记簿下拉选择列表数据
   */
  getNoteBooks = async () =>{
    let _this = this;
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await getNoteBookGroup()
    if (code === 0) {
      let notebooks = [];
      notebooks.push(<Option key='-1' value="">请选择</Option>);
      data.forEach(item => {
        notebooks.push((<Option key={item.id} value={item.id}>{item.name}</Option>));
      });
      _this.setState({
        notebooks
      })
    } else {
      openNotificationWithIcon("error", "错误提示", msg);
    }
  }


    /**
     * 刷新
     */
    reloadPage = () => {
        // 重置查询条件
        let _this = this;
        let filters = _this.state.filters;
        filters.beginTime = null;
        filters.endTime = null;
        filters.topic = null;
        filters.name = null;
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

    // 日期选择发生变化
    onChangeDate = (date, dateString) => {
        let _this = this;
        let {filters} = _this.state;
        // 为空要单独判断
        if (dateString[0] !== '' && dateString[1] !== ''){
            filters.beginTime = dateString[0];
            filters.endTime = dateString[1];
        }else{
            filters.beginTime = null;
            filters.endTime = null;
        }
        _this.setState({
            nowPage: 1,
            filters
        }, function () {
            _this.getDatas()
        });
    };


    /**
     * 双向绑定用户查询主题
     * @param event
     */
    topicInputChange = (event) => {
        let _this = this;
        const value = event.target.value;
        let filters = _this.state.filters;
        filters.topic = value;
        _this.setState({
            nowPage: 1,
            filters
        })
    };

  // 笔记簿选框发生改变
  onChangeBooks = (value) => {
    let _this = this;
    let filters = _this.state.filters;
    filters.notebookId = value;
    _this.setState({
      filters,
      nowPage: 1,
    }, function () {
      _this.getDatas()
    });
  };

    /*
    * 删除指定笔记
    */
    handleDeleteNotes = (item) => {
        let _this = this;
        Modal.confirm({
            title: '删除确认',
            content: `确认删除主题为:${item.topic}的笔记吗?`,
            onOk: async () => {
                // 在发请求前, 显示loading
                _this.setState({listLoading: true});
                let para = { id: item.id };
                const {msg, code} = await deleteNotes(para);
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

    /*
    *为第一次render()准备数据
    * 因为要异步加载数据，所以方法改为async执行
    */
    componentDidMount() {
        // 初始化表格属性设置
        this.initColumns();
        // 加载页面数据
        this.getDatas();
        // 初始化用户笔记簿数据
        this.getNoteBooks()
    };

    render() {
        // 读取状态数据
        const {datas, dataTotal, nowPage, pageSize, listLoading,filters,notebooks} = this.state;
        let {beginTime,endTime,topic,notebookId} = filters;
        let rangeDate;
        if (beginTime !== null && endTime !== null){
            rangeDate = [moment(beginTime),moment(endTime)]
        } else {
            rangeDate = [null,null]
        }
        return (
            <DocumentTitle title="便笺笔记">
                <section>
                    <Col span={24} className="toolbar">
                        <Form layout="inline">
                            <Form.Item label="主题:">
                                <Input type='text' value={topic} onChange={this.topicInputChange}
                                       placeholder='按主题检索'/>
                            </Form.Item>
                            <Form.Item label="分类:">
                              <Select showSearch placeholder="请选择所属分类" style={{width: '200px'}} value={notebookId} onChange={this.onChangeBooks}>
                                {notebooks}
                              </Select>
                            </Form.Item>
                            <Form.Item label="添加时间:">
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
                                <Button type="primary" htmlType="button">
                                    <Link to='/backstage/memory/notes/create'><PlusOutlined/>发布</Link>
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={24} className="dataTable">
                        <Table size="middle" rowKey="id" loading={listLoading} bordered columns={this.columns} dataSource={datas}
                               pagination={{
                                   current:nowPage,
                                   showTotal: () => `当前第${nowPage}页 共${dataTotal}条`,
                                   pageSize: pageSize, showQuickJumper: true, total: dataTotal, showSizeChanger: true,
                                   onShowSizeChange: (current, pageSize) => this.changePageSize(pageSize, current),
                                   onChange: this.changePage,
                               }}/>
                    </Col>
                </section>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default NotesList;
