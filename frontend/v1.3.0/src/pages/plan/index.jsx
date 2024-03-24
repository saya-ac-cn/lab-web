import React, {Component} from 'react';
import {queryPlan} from "@/api";
import {openNotificationWithIcon_} from "@/utils/window";
import {Button, Modal, Spin} from "antd";
import DocumentTitle from "react-document-title";
import {LeftOutlined, RightOutlined} from '@ant-design/icons';
import "./index.less"
import moment from "moment";
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/8/29 - 10:58 下午
 * 描述：
 */

// 定义组件（ES6）
class Plan extends Component {

  state = {
    listLoading: false,
    visibleModal: false,
    planDetail:[],
    datas: [],
    outhtml: [],
    filters: {
      date: ""
    },
  }

  /**
   * 获取计划列表数据
   * @returns {Promise<void>}
   */
  getDatas = async () => {
    let _this = this
    let filters = _this.state.filters
    let para = {
      archive_date: moment(filters.date).format('YYYY-MM'),
    };
    // 在发请求前, 显示loading
    _this.setState({listLoading: true});
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await queryPlan(para);
    // 在请求完成后, 隐藏loading
    _this.setState({listLoading: false});
    if (code === 0) {
        // 表格数据
        _this.setState({datas: data}, () =>{
          _this.rendering()
        });
    } else {
      openNotificationWithIcon_("error", "错误提示", msg);
    }
  };

  /**
   * 渲染日历
   */
  rendering = () => {
    let isNowMonth = true;
    // 判断是否是本月
    const nowDate = new Date(this.getNowFormatDate());
    const nowYear = nowDate.getFullYear();//获取年
    const nowMonth = nowDate.getMonth();//获取月
    const nowday = nowDate.getDate();//获取天数
    const localDate = new Date(this.state.filters.date);
    const localYear = localDate.getFullYear();//获取年
    const localMonth = localDate.getMonth();//获取月
    const editDate = localYear + '-' + (localMonth + 1) + '-';
    if ((nowYear === localYear) && (nowMonth === localMonth)) {
      isNowMonth = true
    } else {
      isNowMonth = false
    }
    // 开始渲染
    let out_html = [];//输出具体的日历
    let _thisLine = [];//处理的每一行
    let lineNum = 0;//行号
    for (let i = 0; i < this.state.datas.length; i++) {
      const item = this.state.datas[i]
      const cellNum = i % 7
      if (cellNum === 0) {
        // 行开始
        _thisLine = []
        lineNum++
      }
      if (item.flag === 1) {
        // 需要渲染日历
        // 判断该天有无安排计划
        if (!item.value) {
          // 没有安排计划
          // 判断当前单元格是否是今天
          if (isNowMonth === true && nowday === item.number) {
            _thisLine.push(<td key={i} data-id={item.id}
                               data-key={editDate + item.number} className="today">{item.number}</td>)
          } else {
            _thisLine.push(<td key={i} data-id={item.id}
                               data-key={editDate + item.number}>{item.number}</td>)
          }
        } else {
          // 有计划
          _thisLine.push(<td key={i} onClick={this.clickTD} className="with_plan" data-id={item.id}
                             data-key={editDate + item.number} data-value={JSON.stringify(item.value)}>
            {item.number}
          </td>)
        }
      } else {
        // 显示1号前和月尾的空白单元格
        _thisLine.push(<td key={i}>{item.number}</td>)
      }
      if (cellNum === 6) {
        out_html.push(<tr key={lineNum}>{_thisLine}</tr>)
      }
    }
    this.setState({
      outhtml: out_html
    })
  };

  /**
   * 获取当前日期
   * @returns {string}
   */
  getNowFormatDate = () => {
    const date = new Date();
    const seperator1 = '-';
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    return year + seperator1 + month + seperator1 + strDate
  };

  /**
   * 日期加减运算
   * @param _dateObject
   * @param x
   * @returns {string}
   */
  getOperationData = (_dateObject, x) => {
    //运算日期
    if (_dateObject === null || undefined === _dateObject || _dateObject === '') {
      _dateObject = new Date();
    }
    _dateObject.setMonth(_dateObject.getMonth() + x);
    let nd = _dateObject.valueOf();
    nd = new Date(nd);
    const y = nd.getFullYear();
    let m = nd.getMonth() + 1;
    let d = nd.getDate();
    if (m <= 9) m = '0' + m;
    if (d <= 9) d = '0' + d;
    return y + '-' + m + '-01';
  }

  /**
   * 日期加减事件
   * @param flog
   */
  buttonQuery = (flog) => {
    let _this = this
    // 通过上一个月，下一个月进行日期查询
    let filters = _this.state.filters
    filters.date = _this.getOperationData(new Date(filters.date), flog)
    _this.setState({filters}, function () {
      _this.getDatas()
    })
  };

  /**
   * 单击单元格事件
   * @param e
   */
  clickTD = (e) => {
    let _this = this;
    // 得到自定义属性
    // 得到计划的主键，没有计划时为-1
    let id = e.currentTarget.getAttribute('data-id')
    // 得到当天的时间
    if (id === -1 || id === '-1') {
      // 该天无计划
    } else {
      // 该天有计划
      let value = e.currentTarget.getAttribute('data-value')
      const plans = JSON.parse(value);
      let out_html = [];
      for (let index in plans){
        const plan = plans[index];
        out_html.push(<div key={index}><h5>{`${(parseInt(index+1))}、${plan.title}`}</h5><h6 style={{textIndent:'2em'}}>{`${plan.content}`}</h6></div>)
      }
      _this.handleDisplay(out_html)
    }
  };

  /**
   * 关闭弹框
   */
  handleCancel = () => {
    this.setState({visibleModal: false,planDetail: null});
  };

  /**
   * 显示弹框
   * @param val
   */
  handleDisplay = (val) => {
    let _this = this;
    _this.setState({
      visibleModal: true,
      planDetail: val,
    });
  };

  /*
   * 为第一次render()准备数据
   * 因为要异步加载数据，所以方法改为async执行
   */
  componentWillMount() {
    let filters = this.state.filters
    filters.date = this.getNowFormatDate()
    this.setState({
      filters
    },()=>{
      // 加载页面数据
      this.getDatas();
    })
  };

  render() {
    const {visibleModal,planDetail,outhtml, listLoading, filters} = this.state;
    return (
      <DocumentTitle title="saya.ac.cn-计划安排">
        <div className="frontend-plan">
          <Modal title="计划内容" footer={[<Button key="close" type="primary" onClick={this.handleCancel}>关闭</Button>]} open={visibleModal} onCancel={this.handleCancel}>
            {planDetail}
          </Modal>
          <div className="child-container">
            <div className="column-title">
              计划安排
            </div>
            <div className='switch-date'>
              <div
                style={{cursor: 'pointer'}}>
                <span onClick={() => this.buttonQuery(-1)}><LeftOutlined /></span>
              </div>
              <div>
                {filters.date}
              </div>
              <div
                style={{cursor: 'pointer'}}>
                <span onClick={() => this.buttonQuery(+1)}><RightOutlined /></span>
              </div>
            </div>
            <div className="plantanle">
              {listLoading === true ? <Spin/> :
                <table border="1px" cellPadding="0" cellSpacing="0">
                  <thead>
                  <tr>
                    <td>星期日</td>
                    <td>星期一</td>
                    <td>星期二</td>
                    <td>星期三</td>
                    <td>星期四</td>
                    <td>星期五</td>
                    <td>星期六</td>
                  </tr>
                  </thead>
                  <tbody>
                  {outhtml}
                  </tbody>
                </table>
              }
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

// 对外暴露
export default Plan;
