import React, { Component } from 'react';
import {Col, Row, DatePicker,Card, Statistic, Tooltip,Divider,List} from 'antd';
import DocumentTitle from "react-document-title";
import { TinyArea,TinyColumn,Progress,WordCloud,Rose,DualAxes } from '@ant-design/charts';
import {QuestionCircleOutlined} from "@ant-design/icons";
import {getAccountGrowthRate} from "../../../api/index";
import moment from 'moment';
import './index.less'
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2021/1/23 - 下午8:51
 * 描述：数据概览
 */
var data1 = [
  264,
  417,
  438,
  887,
  309,
  397,
  550,
  575,
  563,
  430,
  525,
  592,
  492,
  467,
  513,
  546,
  983,
  340,
  539,
  243,
  226,
  192,
];
var config1 = {
  height: 70,
  // width: 300,
  autoFit: true,
  data: data1,
  smooth: true,
  tooltip: {
    customContent: (title, data) => {
      return `<div>支付笔数:${title}</div>`;
    }
  },
  areaStyle: { fill: '#975fe4' },
  line:{color:'#975fe4'}
};


var data2 = [274, 337, 81, 497, 666, 219, 269];;
var config2 = {
  height: 70,
  autoFit: true,
  data: data2,
  tooltip: {
    customContent: function customContent(x, data) {
      var _data$, _data$$data;
      return 'NO.'
        .concat(x, ': ')
        .concat(
          (_data$ = data[0]) === null || _data$ === void 0
            ? void 0
            : (_data$$data = _data$.data) === null || _data$$data === void 0
            ? void 0
            : _data$$data.y.toFixed(2),
        );
    },
  },
};


var config3 = {
  height: 70,
  autoFit: true,
  percent: 0.1128,
  barWidthRatio: 0.1,
  color: ['#cf1322','#3f8600'],
};

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
    // 是否显示加载
    listLoading: false,
    chartWord: {},
    chartColumn: {},
    chartBar: {},
    chartLine: {},
    chartPie: {},
    activeLine: {},
    memoColumn: {},
    data: {
      newsCount: 11,
      pictureCount: 2,
      fileCount: 1,
      logCount: 61,
      notesCount: 0,
      planCount: 15,
      bookCount: 3,
      bookList: [{
        "name": "测试-1",
        "notesCount": 2,
      }, {
        "name": "测试",
        "notesCount": 4,
      }, {
        "name": "测试",
        "notesCount": 2,
      }],
      financial6: [{
        "deposited": 4137.56,
        "expenditure": 630.49,
        "tradeDate": "2018-09",
        "currencyNumber": 5771.05
      }, {
        "deposited": 4153.0,
        "expenditure": 2433.63,
        "tradeDate": "2018-10",
        "currencyNumber": 6586.63
      }, {
        "deposited": 5153.88,
        "expenditure": 9012.42,
        "tradeDate": "2018-11",
        "currencyNumber": 14166.3
      }, {
        "deposited": 4153.0,
        "expenditure": 5842.86,
        "tradeDate": "2018-12",
        "currencyNumber": 9981.87
      }, {
        "deposited": 17841.46,
        "expenditure": 1433.34,
        "tradeDate": "2019-01",
        "currencyNumber": 19274.7
      }, {
        "deposited": 8708.88,
        "expenditure": 3809.92,
        "tradeDate": "2019-02",
        "currencyNumber": 12518.8
      }],
      log6: {
        "2018-09": 34,
        "2018-10": 45,
        "2018-11": 23,
        "2018-12": 34,
        "2019-01": 47,
        "2019-02": 50
      },
      files6: {
        "2018-09": 5,
        "2018-10": 3,
        "2018-11": 6,
        "2018-12": 5,
        "2019-01": 7,
        "2019-02": 9
      },
      news6: {
        "2018-09": 2,
        "2018-10": 4,
        "2018-11": 5,
        "2018-12": 3,
        "2019-01": 3,
        "2019-02": 1
      },
      memo6: {
        "2018-09": 1,
        "2018-10": 3,
        "2018-11": 2,
        "2018-12": 1,
        "2019-01": 3,
        "2019-02": 2
      },
    },
    // 收支增长率
    accountGrowthRate:{
      loading:false,
      tradeDate:null,
      serverData:{}
    }
  }

  /*
   * 为第一次render()准备数据
   * 因为要异步加载数据，所以方法改为async执行
   */
  componentDidMount() {

  }

  render() {
    return (
      <DocumentTitle title='概览'>
        <section className='background-chart'>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <DatePicker picker="month" className='notice-tooltip'/>
                <Statistic title="本月收支总额" value={1128} prefix={'￥'} />
                <div className='rate-area'>
                  <div className='m2m-rate'>
                    <span className='rate-tag'>环比增长</span>12%
                    <div style={{width:'1em',height:'1em',backgroundSize: 'cover',backgroundImage:`url('${process.env.PUBLIC_URL+'/picture/chart/caret-up.svg'}')`}}></div>
                  </div>
                  <div className='y2y-rate'>
                    <span className='rate-tag'>同比增长</span>34%
                    <div style={{width:'1em',height:'1em',backgroundSize: 'cover',backgroundImage:`url('${process.env.PUBLIC_URL+'/picture/chart/caret-down.svg'}')`}}></div>
                  </div>
                </div>
                <Divider className='extra-divider'/>
                <div>
                  日均收支金额：0
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <DatePicker picker="month" className='notice-tooltip'/>
                <Statistic title="本月收支比率" valueStyle={{ color: 11.28>=50?'#cf1322':'#3f8600' }} value={11.28} precision={2} suffix="%"/>
                <Progress {...config3} />
                <Divider className='extra-divider'/>
                <div>
                  总收入金额：0
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <DatePicker picker="month" className='notice-tooltip'/>
                <Statistic title="活跃度" value={1128}/>
                <TinyArea {...config1} />
                <Divider className='extra-divider'/>
                <div>
                  日均操作次数：0
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <DatePicker picker="month" className='notice-tooltip'/>
                <Statistic title="笔记数" value={22}/>
                <TinyColumn {...config2} />
                <Divider className='extra-divider'/>
                <div>
                  日均编写：0
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="收入支出" bordered={false} extra={<DatePicker picker="month" className='notice-tooltip'/>}>
                <Row gutter={50}>
                  <Col span={18}>
                    <DualAxes {...config7} />
                  </Col>
                  <Col span={6}>
                    <List
                      header={<div style={{fontWeight:'bold'}}>收支构成排行</div>}
                      split={false}
                      dataSource={data6}
                      renderItem={item => (
                        <List.Item>
                          1、{item}<span style={{float:'right'}}>2</span>
                        </List.Item>
                      )}
                    />
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
