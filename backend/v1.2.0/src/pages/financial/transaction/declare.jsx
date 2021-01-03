import React, {Component } from 'react';
import {Row, Col, Input, InputNumber, Table, DatePicker, Tooltip, Popconfirm, Select, Form} from 'antd';
import {PlusOutlined,CloseOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
import memoryUtils from "../../../utils/memoryUtils";
import './detail.less'
import {Redirect} from "react-router-dom";
import {openNotificationWithIcon} from "../../../utils/window";
import {getFinancialType,getFinancialAmount} from "../../../api";
/*
 * 文件名：declare.jsx
 * 作者：saya
 * 创建日期：2021/1/3 - 下午5:38
 * 描述：收支申报
 */
const {Option} = Select;
// 定义组件（ES6）
class Declare extends Component {

  state = {
    // 是否显示加载
    listLoading: false,
    tradeId: -1,
    financialType:[],
    financialAmount:[],
    bill: {
      tradeType:null,
      transactionAmount:null,
      currencyNumber:0.0,
      deposited:0.0,
      expenditure:0.0
    },
    infoList: [{
      index:1,
      flog: 1,
      currencyNumber: 0,
      currencyDetails: ''
    }]
  }

  /**
   * 初始化Table所有列的数组
   */
  initColumns = () => {
    this.columns = [
      {
        title: '序号',
        render: (text, record,index) => (index+1),
        align:'center',
      },
      {
        title: '用户',
        render:(value, row) => (!this.state.bill?'-':this.state.bill.source),
        align:'center',
      },
      {
        title: '交易类型',
        dataIndex: 'flog', // 显示数据对应的属性名
        align:'center',
        render: (text, record, index) => {
          return <Select value={text} bordered={false} onChange={(e) => this.onChangeFlag(e,index)}>
            <Option value={1}>存入</Option>
            <Option value={2}>取出</Option>
          </Select>
        }
      },
      {
        title: '交易说明',
        dataIndex: 'currencyDetails', // 显示数据对应的属性名
        editable: true,
        render: (text, record, index) => {
          return <Input type="text" value={text} maxLength={15} bordered={false} onChange={(e) => this.inputChange(e, record, index, 'currencyDetails')}/>
        }
      },
      {
        title: '交易金额（元）',
        dataIndex: 'currencyNumber', // 显示数据对应的属性名
        align:'right',
        render: (text, record, index) => {
          return <InputNumber value={text} style={{border: 0,width: '10em',background: 'none',textAlign:'right'}} ordered={false} min={0} precision={2} formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}  parser={value => value.replace(/\s?|(,*)/g, '')} onChange={(e) => this.inputChange(e, record, index, 'currencyNumber')}/>
        }
      },
      {
        title: '操作',
        align:'center',
        render: (text, record,index) =>
          this.state.infoList.length > 1 ? (
            <Popconfirm title="确定删除?" onConfirm={() => this.deleteLine(index)}>
              <CloseOutlined/>
            </Popconfirm>
          ) : <Tooltip placement="left" title="填报的明细必须要有1条以上">
            <ExclamationCircleOutlined/>
          </Tooltip>,
      },
    ]
  };

  /**
   * 继续添加财政明细
   */
  continueAdd = () => {
    let infoList = this.state.infoList
    let item = {
      index:infoList[infoList.length-1].index+1,
      flog: 1,
      currencyNumber: 0,
      currencyDetails: ''
    }
    infoList = infoList.concat(item)
    this.setState({infoList})
  }

  /**
   * 删除明细添加行
   * @param index
   */
  deleteLine = (index) => {
    let infoList = this.state.infoList
    if(infoList.length === 1){
      openNotificationWithIcon("error", "错误提示", '每一笔流水申请下边必须要有一条详情记录');
    }else{
      infoList = infoList.filter((item, key) => key !== index)
      this.setState({infoList})
    }
  }

  /**
   * input改变事件
   * @param e
   * @param record
   * @param index
   * @param field
   */
  inputChange = (e, record, index, field) => {
    let { infoList } = this.state;
    if ('currencyNumber' === field){
      // 对于 InputNumber 类型的输入框需要另类处理
      infoList[index].currencyNumber = e;
    }else{
      infoList[index][field] = e.target.value;
    }
    this.setState({ infoList });
  };

  /**
   * 交易类型改变事件
   * @param value
   * @param index
   */
  onChangeFlag = (value,index) => {
    let _this = this;
    let { infoList } = this.state;
    infoList[index].flog = value;
    _this.setState({infoList});
  };

  /**
   * 获取所有的支付类别
   */
  initFinancialType = async () => {
    let _this = this;
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await getFinancialType()
    if (code === 0) {
      let type = [];
      data.forEach(item => {
        type.push((<Option key={item.id} value={item.id}>{item.transactionType}</Option>));
      });
      _this.setState({
        financialType: type
      })
    } else {
      openNotificationWithIcon("error", "错误提示", msg);
    }
  }

  /**
   * 获取所有的交易摘要
   */
  initFinancialAmount = async () => {
    let _this = this;
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await getFinancialAmount()
    if (code === 0) {
      let type = [];
      data.forEach(item => {
        type.push((<Option key={item.id} value={item.id}>{item.tag}</Option>));
      });
      _this.setState({
        financialAmount: type
      })
    } else {
      openNotificationWithIcon("error", "错误提示", msg);
    }
  }

  /**
   * 支付类型 或者 摘要 选择框改变事件
   * @param value
   * @param field
   */
  onChangeTypeAmount = (value,field) => {
    let _this = this;
    let { bill } = this.state;
    bill[field] = value;
    _this.setState({bill});
  };

  /**
   * 初始化页面配置信息
   */
  componentWillMount() {
    // 初始化表格属性设置
    this.initColumns();
  }

  /**
   * 执行异步任务: 发异步ajax请求
   */
  componentDidMount() {
    this.initFinancialType()
    this.initFinancialAmount()
    const user = memoryUtils.user;
    // 如果内存没有存储user ==> 当前没有登陆
    if (!user || !user.user) {
      // 自动跳转到登陆(在render()中)
      return <Redirect to='/login'/>
    }
    // 加载页面数据
    let _this = this
    let bill = _this.state.bill
    bill.source = user.user.user
    _this.setState({bill})
  };


  render() {
    const {bill, listLoading,infoList,financialType,financialAmount} = this.state
    return (
      <section className="transaction-detail">
        <Row className='detail-addLine'>
          <Col span={6} offset={18}>
            <Tooltip placement="left" title="添加1行">
              <PlusOutlined onClick={this.continueAdd}/>
            </Tooltip>
          </Col>
        </Row>
        <Row className="detail-header">
          <Col span={12} offset={6}>
            收支明细
          </Col>
        </Row>
        <Row className="detail-tradeDate">
          <Col span={6} offset={18}>
            <span className='input-label'>交易日期：</span><DatePicker bordered={false} format={"YYYY-MM-DD"} placeholder="交易日期"/>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col className="gutter-row" span={8}>
            <div><span className='input-label'>收支总额：</span>{!bill?'-':bill.currencyNumber}元</div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div><span className='input-label'>收入总额：</span>{!bill?'-':bill.deposited}元</div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div><span className='input-label'>支出总额：</span>{!bill?'-':bill.expenditure}元</div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div>
              <span className='input-label'>交易方式：</span>
              <Select value={bill.tradeType} className='declare-select' bordered={false} onChange={(e) => this.onChangeTypeAmount(e,'tradeType')}>
                {financialType}
              </Select>
            </div>
          </Col>
          <Col className="gutter-row" span={8}>
            <div>
              <span className='input-label'>交易摘要：</span>
              <Select value={bill.transactionAmount} className='declare-select' bordered={false} onChange={(e) => this.onChangeTypeAmount(e,'transactionAmount')}>
                {financialAmount}
              </Select>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table size="middle" className='detail-grid' rowKey="index" bordered pagination={false} loading={listLoading} columns={this.columns} dataSource={!infoList?null:infoList}/>
          </Col>
        </Row>
        <Row>
          <Col span={24}><span className='input-label'>注意：</span>1、请依次从第一条开始，逐上而下填写，中间不要跳过空白行；2、同一天可以申报多次；3、同一笔流水申请只能对应一种交易方式；4、一笔流水下面必须有一条交易明细，最多不超过十条。</Col>
        </Row>
      </section>
    );
  }
}

// 对外暴露
export default Declare;
