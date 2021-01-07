import React, { Component } from 'react';
import {Row, Col, Table, Modal} from 'antd';
import './detail.less'
import PropTypes from "prop-types";
import {getTransactionDetail} from "../../../api";
import {openNotificationWithIcon,showLoading} from "../../../utils/window";
/*
 * 文件名：detail.jsx
 * 作者：saya
 * 创建日期：2021/1/3 - 下午1:59
 * 描述：账单详情
 */

// 定义组件（ES6）
class BillDetail extends Component {

  state = {
    // 返回的账单数据
    bill: null,
    // 是否显示加载
    listLoading: false,
    tradeId: -1,
    visibleModal:false
  }

  /**
  * 初始化Table所有列的数组
  */
  initColumns = () => {
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id', // 显示数据对应的属性名
        align:'center',
      },
      {
        title: '用户',
        render:(value, row) => (!this.state.bill?'-':this.state.bill.source),
        align:'center',
      },
      {
        title: '交易类型',
        align:'center',
        render: (text, record) => {
          if (record.flog === 1) {
            return '存入'
          } else if (record.flog === 2) {
            return '取出'
          } else {
            return '未知'
          }
        }
      },
      {
        title: '交易说明',
        dataIndex: 'currencyDetails', // 显示数据对应的属性名
      },
      {
        title: '交易金额（元）',
        dataIndex: 'currencyNumber', // 显示数据对应的属性名
        align:'right',
      }
    ]
  };

  /**
   * 获取财政列表数据
   * @returns {Promise<void>}
   */
  getDatas = async () => {
    let para = {
      tradeId: this.state.tradeId
    };
    // 在发请求前, 显示loading
    this.setState({listLoading: showLoading()});
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await getTransactionDetail(para)
    // 在请求完成后, 隐藏loading
    this.setState({listLoading: false});
    if (code === 0) {
      this.setState({
        bill: data
      });
    } else {
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  handleCancel = () => {
    this.setState({visibleModal: false});
  };

  handleDisplay = (val) => {
    console.log("-----",val)
    let _this = this;
    _this.setState({
      tradeId: val,
      visibleModal: true
    },function () {
      // 执行初始化加载页面数据
      _this.getDatas()
    });
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
    // 加载页面数据
    let _this = this
    this.props.onRef(_this)
    _this.setState({bill:null})
  };

  render() {
    const {tradeId, bill, listLoading,visibleModal} = this.state
    return (
        <Modal
            title={`收支明细（编号:${tradeId})`}
            width="80%"
            visible={visibleModal}
            onCancel={() => this.handleCancel()}
            footer={null}>
          <section className="transaction-detail">
            <Row className="detail-header">
              <Col span={12} offset={6}>
                收支明细
              </Col>
            </Row>
            <Row className="detail-tradeDate">
              <Col span={6} offset={18}>
                <span className='input-label'>交易日期：</span>{!bill?'-':bill.tradeDate}
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
                <div><span className='input-label'>交易方式：</span>{!bill||!bill.tradeTypeEntity?'-':bill.tradeTypeEntity.transactionType}</div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div><span className='input-label'>交易摘要：</span>{!bill||!bill.tradeAmountEntity?'-':bill.tradeAmountEntity.tag}</div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table size="middle" className='detail-grid' rowKey="id" bordered pagination={false} loading={listLoading} columns={this.columns} dataSource={!bill?null:bill.infoList}/>
              </Col>
            </Row>
            <Row>
              <Col className="gutter-row" span={8}>
                <div><span className='input-label'>填报人：</span>{!bill?'-':bill.source}</div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div><span className='input-label'>填报时间：</span>{!bill?'-':bill.createTime}</div>
              </Col>
              <Col className="gutter-row" span={8}>
                <div><span className='input-label'>最后一次修改日期：</span>{!bill?'-':bill.updateTime}</div>
              </Col>
            </Row>
          </section>
        </Modal>
    );
  }
}

// 对外暴露
export default BillDetail;
