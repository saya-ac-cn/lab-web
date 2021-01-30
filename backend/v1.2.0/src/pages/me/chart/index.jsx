import React, { Component } from 'react';
import {Col, Row, DatePicker,Card, Statistic, Skeleton,Divider,List} from 'antd';
import DocumentTitle from "react-document-title";
import { TinyArea,TinyColumn,Progress,WordCloud,Rose,DualAxes } from '@ant-design/charts';
import {QuestionCircleOutlined} from "@ant-design/icons";
import {getAccountGrowthRate,getIncomePercentage,getActivityRate,getNewsRate,getOrderByAmount} from "../../../api/index";
import moment from 'moment';
import './index.less'
import {disabledMonth} from "../../../utils/var";
import {openNotificationWithIcon} from "../../../utils/window";
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2021/1/23 - 下午8:51
 * 描述：数据概览
 */


var data4 = [
  { "value": 3, "name": "关联" },
  { "value": 3, "name": "分布" },
  { "value": 3, "name": "区间" },
  { "value": 3, "name": "占比" },
  { "value": 3, "name": "地图" },
  { "value": 3, "name": "时间" },
  { "value": 3, "name": "比较" },
  { "value": 3, "name": "流程" },
  { "value": 3, "name": "趋势" },
];
var config4 = {
  data: data4,
  height: 300,
  autoFit: true,
  wordField: 'name',
  weightField: 'value',
  colorField: 'name',
  wordStyle: {
    fontFamily: 'Verdana',
    fontSize: [
      8,
      32
    ],
    rotation: 0
  },
  random: function random() {
    return 0.5;
  }
}

var data5 = [
  {
    type: '分类一',
    value: 27,
  },
  {
    type: '分类二',
    value: 25,
  },
  {
    type: '分类三',
    value: 18,
  },
  {
    type: '分类四',
    value: 15,
  },
  {
    type: '分类五',
    value: 10,
  },
  {
    type: '其他',
    value: 5,
  },
];
var config5 = {
  height: 300,
  autoFit: true,
  data: data5,
  xField: 'type',
  yField: 'value',
  seriesField: 'type',
  radius: 0.9,
  label: { offset: -15 },
};

const data6 = [
  '工资',
  '房贷',
  '租房',
  '消费',
  '研发',
];

var uvBillData = [
  {
    time: '2019-03',
    value: 350,
    type: '收入',
  },
  {
    time: '2019-04',
    value: 900,
    type: '收入',
  },
  {
    time: '2019-05',
    value: 300,
    type: '收入',
  },
  {
    time: '2019-06',
    value: 450,
    type: '收入',
  },
  {
    time: '2019-07',
    value: 470,
    type: '收入',
  },
  {
    time: '2019-03',
    value: 220,
    type: '支出',
  },
  {
    time: '2019-04',
    value: 300,
    type: '支出',
  },
  {
    time: '2019-05',
    value: 250,
    type: '支出',
  },
  {
    time: '2019-06',
    value: 220,
    type: '支出',
  },
  {
    time: '2019-07',
    value: 362,
    type: '支出',
  },
];
var transformData = [
  {
    time: '2019-03',
    count: 800,
  },
  {
    time: '2019-04',
    count: 600,
  },
  {
    time: '2019-05',
    count: 400,
  },
  {
    time: '2019-06',
    count: 380,
  },
  {
    time: '2019-07',
    count: 220,
  },
];
var config7 = {
  autoFit: true,
  data: [uvBillData, transformData],
  xField: 'time',
  yField: ['value', 'count'],
  geometryOptions: [
    {
      geometry: 'column',
      isGroup: true,
      seriesField: 'type',
      columnWidthRatio: 0.4,
      label: {},
      color: ['#5B8FF9', '#5D7092'],
    },
    {
      geometry: 'line',
      color: '#5AD8A6',
    },
  ],
  meta: {
    count: {
      alias: '收支总额',
      formatter: function formatter(v) {
        return v//Number((v / 100).toFixed(1));
      },
    },
  },
};
// 定义组件（ES6）
class Chart extends Component {

  state = {
    // 收支增长率
    accountGrowthRate:{
      loading:true,
      tradeDate:null,
      serverData:{
        m2m: 0,
        y2y: 0,
        avg: 0,
        account: 0
      }
    },
    // 收支率
    incomePercentage:{
      loading:true,
      tradeDate:null,
      serverData:{
        account: 0,
        percentage: 0
      }
    },
    // 活跃度
    activityRate:{
      loading:true,
      tradeDate:null,
      serverData:{
        avg: 0,
        count: 0,
        log6:{
          month:[],
          count:[]
        }
      }
    },
    // 动态发布
    newsRate:{
      loading:true,
      tradeDate:null,
      serverData:{
        avg: 0,
        count: 0,
        news6:{
          month:[],
          count:[]
        }
      }
    },
    financial:{
      tradeDate:null,
    },
    financial6:{
      loading:true,
      serverData:{}
    },
    amountOrder:{
      loading:true,
      serverData:[]
    }
  };

  /**
   * 收支增长率
   * @returns {Promise<void>}
   */
  loadAccountGrowthRate = async () => {
    const _this = this;
    let accountGrowthRate = _this.state.accountGrowthRate;
    accountGrowthRate.loading = true;
    _this.setState({accountGrowthRate});
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await getAccountGrowthRate((accountGrowthRate.tradeDate).format('YYYY-MM-DD'));
    accountGrowthRate.loading = false;
    if (code === 0) {
      accountGrowthRate.serverData = data;
      _this.setState({accountGrowthRate});
    }else {
      _this.setState({accountGrowthRate});
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 收支率
   * @returns {Promise<void>}
   */
  loadIncomePercentage = async () => {
    const _this = this;
    let incomePercentage = _this.state.incomePercentage;
    incomePercentage.loading = true;
    _this.setState({incomePercentage});
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await getIncomePercentage((incomePercentage.tradeDate).format('YYYY-MM-DD'));
    incomePercentage.loading = false;
    if (code === 0) {
      incomePercentage.serverData = data;
      _this.setState({incomePercentage});
    }else {
      _this.setState({incomePercentage});
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 活跃度
   * @returns {Promise<void>}
   */
  loadActivityRate= async () => {
    const _this = this;
    let activityRate = _this.state.activityRate;
    activityRate.loading = true;
    _this.setState({activityRate});
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await getActivityRate((activityRate.tradeDate).format('YYYY-MM-DD'));
    activityRate.loading = false;
    if (code === 0) {
      activityRate.serverData.avg = data.avg;
      activityRate.serverData.count = data.count;
      const log6 = data.log6;
      let count = [];
      let month = [];
      // 这里的key是月份
      for(let key in log6){
        month.push(key);
        count.push(log6[key])
      }
      const log = {month:month,count:count};
      activityRate.serverData.log6 = log;
      _this.setState({activityRate});
    }else {
      _this.setState({activityRate});
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 动态发布
   * @returns {Promise<void>}
   */
  loadNewsRate = async () => {
    const _this = this;
    let newsRate = _this.state.newsRate;
    newsRate.loading = true;
    _this.setState({newsRate});
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await getNewsRate((newsRate.tradeDate).format('YYYY-MM-DD'));
    newsRate.loading = false;
    if (code === 0) {
      newsRate.serverData.avg = data.avg;
      newsRate.serverData.count = data.count;
      const news6 = data.news6;
      let count = [];
      let month = [];
      // 这里的key是月份
      for(let key in news6){
        month.push(key);
        count.push(news6[key])
      }
      const news = {month:month,count:count};
      newsRate.serverData.news6 = news;
      _this.setState({newsRate});
    }else {
      _this.setState({newsRate});
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 账单排名
   * @returns {Promise<void>}
   */
  loadOrderByAmount = async () => {
    const _this = this;
    let {amountOrder,financial} = _this.state;
    amountOrder.loading = true;
    _this.setState({amountOrder});
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await getOrderByAmount((financial.tradeDate).format('YYYY-MM-DD'));
    amountOrder.loading = false;
    if (code === 0) {
      let array = [];
      for (let i = 0; i < 5 && i < data.length; i++) {
        array.push({'index':(i+1),'name':data[i].amountEntity.tag,'count':data[i].currencyNumber})
      }
      amountOrder.serverData = array;
      _this.setState({amountOrder});
    }else {
      _this.setState({amountOrder});
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 页面中日期发生变化后的时间
   * @param date
   * @param filed
   */
  tradeDateChange = (date,filed) => {
    const _this = this;
    let _chart = _this.state[filed];
    _chart.tradeDate = date;
    _this.setState({
      [filed]: _chart
    },function () {
      console.log("触发查询")
    });
  };

  /**
   * 鼠标放置活动率面积图事件
   * @param title
   * @param data
   * @returns {string}
   */
  activityCustomContent = (index, data) => {
    const activityRate = this.state.activityRate;
    let label = '操作次数:';
    if (activityRate&&activityRate.serverData&&activityRate.serverData.log6&&activityRate.serverData.log6.month&&activityRate.serverData.log6.month[index]) {
      label = activityRate.serverData.log6.month[index]+'&nbsp;操作次数:';
    }
    let _data$, _data$$data;
    return label.concat(
            (_data$ = data[0]) === null || _data$ === void 0
                ? void 0
                : (_data$$data = _data$.data) === null || _data$$data === void 0
                ? void 0
                : _data$$data.y,
        );
  };

  /**
   * 鼠标放置动态柱状图事件
   * @param title
   * @param data
   * @returns {string}
   */
  newsCustomContent = (index,data) => {
    const newsRate = this.state.newsRate;
    let label = '撰写篇数:';
    if (newsRate&&newsRate.serverData&&newsRate.serverData.news6&&newsRate.serverData.news6.month&&newsRate.serverData.news6.month[index]) {
      label = newsRate.serverData.news6.month[index]+'&nbsp;撰写篇数:';
    }
    let _data$, _data$$data;
    return label.concat(
        (_data$ = data[0]) === null || _data$ === void 0
            ? void 0
            : (_data$$data = _data$.data) === null || _data$$data === void 0
            ? void 0
            : _data$$data.y,
    );
  }

  /*
   * 为第一次render()准备数据
   * 因为要异步加载数据，所以方法改为async执行
   */
  componentDidMount() {
    const _this= this;
    let initMonth = moment();//.format('YYYY-MM-DD');
    let {accountGrowthRate,incomePercentage,activityRate,newsRate,financial} = _this.state;
    accountGrowthRate.tradeDate=initMonth;
    incomePercentage.tradeDate=initMonth;
    activityRate.tradeDate=initMonth;
    newsRate.tradeDate=initMonth;
    financial.tradeDate=initMonth;
    _this.setState({
      accountGrowthRate,
      incomePercentage,
      activityRate,
      newsRate,
      financial
    },function () {
      _this.loadAccountGrowthRate();
      _this.loadIncomePercentage();
      _this.loadActivityRate();
      _this.loadNewsRate();
      _this.loadOrderByAmount();
    });
  }

  render() {
    const {accountGrowthRate,incomePercentage,activityRate,newsRate,financial,amountOrder} = this.state;
    return (
      <DocumentTitle title='概览'>
        <section className='background-chart'>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              {
                accountGrowthRate.loading?
                    <Card><Skeleton active/></Card>
                    :
                    <Card>
                      <Statistic title={<div className='notice-tooltip'>收支总额<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>this.tradeDateChange(e,'accountGrowthRate')}  picker="month" className='date-switch' value={accountGrowthRate.tradeDate} format='YYYY年MM月'/></div>} value={(accountGrowthRate.serverData && accountGrowthRate.serverData.account)?accountGrowthRate.serverData.account:0} prefix={'￥'} />
                      <div className='rate-area'>
                        <div className='m2m-rate'>
                          <span className='rate-tag'>环比增长</span>
                          {
                            (!accountGrowthRate.serverData || !accountGrowthRate.serverData.m2m)
                                ? '-':
                                <div>
                                  {accountGrowthRate.serverData.m2m+'%'}
                                  <div style={{width:'1em',height:'1em',backgroundSize: 'cover',backgroundImage:`url('${process.env.PUBLIC_URL+(accountGrowthRate.serverData.m2m>0)?'/picture/chart/caret-up.svg':'/picture/chart/caret-down.svg'}')`}}></div>
                                </div>
                          }
                        </div>
                        <div className='y2y-rate'>
                          <span className='rate-tag'>同比增长</span>
                          {
                            (!accountGrowthRate.serverData || !accountGrowthRate.serverData.y2y)
                                ? '-':
                                <div>
                                  {accountGrowthRate.serverData.y2y+'%'}
                                  <div style={{width:'1em',height:'1em',backgroundSize: 'cover',backgroundImage:`url('${process.env.PUBLIC_URL+(accountGrowthRate.serverData.y2y>0)?'/picture/chart/caret-up.svg':'/picture/chart/caret-down.svg'}')`}}></div>
                                </div>
                          }
                        </div>
                      </div>
                      <Divider className='extra-divider'/>
                      <div>
                        日均收支金额(元)：{(accountGrowthRate.serverData && accountGrowthRate.serverData.avg)?accountGrowthRate.serverData.avg:'-'}
                      </div>
                    </Card>
              }
            </Col>
            <Col span={6}>
              {
                incomePercentage.loading?
                    <Card><Skeleton active/></Card>
                    :
                    <Card>
                      <Statistic title={<div className='notice-tooltip'>收支率<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>this.tradeDateChange(e,'incomePercentage')}  picker="month" className='date-switch' value={incomePercentage.tradeDate} format='YYYY年MM月'/></div>} valueStyle={{ color: ((incomePercentage.serverData && incomePercentage.serverData.percentage)?incomePercentage.serverData.percentage:0)>=50?'#cf1322':'#3f8600' }} value={(incomePercentage.serverData && incomePercentage.serverData.percentage)?incomePercentage.serverData.percentage:'-'} precision={2} suffix="%"/>
                      <Progress height={70} autoFit={true} percent={(incomePercentage.serverData && incomePercentage.serverData.percentage)?incomePercentage.serverData.percentage:0} barWidthRatio={0.1} color={['#cf1322','#3f8600']} />
                      <Divider className='extra-divider'/>
                      <div>
                        总收入金额(元)：{(incomePercentage.serverData && incomePercentage.serverData.account)?incomePercentage.serverData.account:'-'}
                      </div>
                    </Card>
              }
            </Col>
            <Col span={6}>
              {
                activityRate.loading?
                    <Card><Skeleton active/></Card>
                    :
                    <Card>
                      <Statistic title={<div className='notice-tooltip'>活跃度<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>this.tradeDateChange(e,'activityRate')}  picker="month" className='date-switch' value={activityRate.tradeDate} format='YYYY年MM月'/></div>} value={(activityRate.serverData && activityRate.serverData.count)?activityRate.serverData.count:0} suffix="次"/>
                      <TinyArea height={70} autoFit={true} data={activityRate.serverData.log6.count} smooth={true} tooltip={{customContent:this.activityCustomContent}} areaStyle={{fill: '#975fe4'}} line={{color:'#975fe4'}}/>
                      <Divider className='extra-divider'/>
                      <div>
                        日均操作次数(次)：{(activityRate.serverData && activityRate.serverData.avg)?activityRate.serverData.avg:'-'}
                      </div>
                    </Card>
              }
            </Col>
            <Col span={6}>
              {
                newsRate.loading?
                    <Card><Skeleton active/></Card>
                    :
                    <Card>
                      <Statistic title={<div className='notice-tooltip'>笔记数<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>this.tradeDateChange(e,'newsRate')}  picker="month" className='date-switch' value={newsRate.tradeDate} format='YYYY年MM月'/></div>} value={(newsRate.serverData && newsRate.serverData.count)?newsRate.serverData.count:0} suffix="篇"/>
                      <TinyColumn height={70} autoFit={true} data={newsRate.serverData.news6.count} tooltip={{customContent:this.newsCustomContent}}/>
                      <Divider className='extra-divider'/>
                      <div>
                        日均撰写(篇)：{(newsRate.serverData && newsRate.serverData.avg)?newsRate.serverData.avg:'-'}
                      </div>
                    </Card>
              }
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="收入支出" bordered={false} extra={<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>this.tradeDateChange(e,'financial')}  picker="month" className='date-switch' value={financial.tradeDate} format='YYYY年MM月'/>}>
                <Row gutter={50}>
                  <Col span={18}>
                    <DualAxes {...config7} />
                  </Col>
                  <Col span={6}>
                    {
                      amountOrder.loading?
                          <Skeleton active/>
                          :
                          <List
                              header={<div style={{fontWeight:'bold'}}>收支构成排行</div>}
                              split={false}
                              dataSource={amountOrder.serverData}
                              renderItem={item => (
                                  <List.Item>
                                    {item.index}、{item.name}<span style={{float:'right'}}>{item.count}</span>
                                  </List.Item>
                              )}
                          />
                    }
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={15}>
              <Card title="数据分布" bordered={false}>
                <Rose {...config5} />
              </Card>
            </Col>
            <Col span={9}>
              <Card title="活跃笔记簿" bordered={false}>
                <WordCloud {...config4} />
              </Card>
            </Col>
          </Row>
        </section>
      </DocumentTitle>
    );
  }
}

// 对外暴露
export default Chart;
