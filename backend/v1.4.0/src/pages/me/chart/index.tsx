import React, {useEffect, useState} from 'react';
import {Card, Col, DatePicker, Divider, List, Row, Skeleton, Statistic,Progress} from 'antd';
import AreaChart from 'bizcharts/es/plots/AreaChart'
import ColumnChart from 'bizcharts/es/plots/ColumnChart'
import RoseChart from 'bizcharts/es/plots/RoseChart'
import TreemapChart from 'bizcharts/es/plots/TreemapChart'
import LineChart from 'bizcharts/es/plots/LineChart'
import WaterfallChart from 'bizcharts/es/plots/WaterfallChart'
import {
  getAccountGrowthRate,
  getActivityRate,
  getCountAndWordCloud,
  getIncomePercentage,
  getNewsRate,
  getOrderByAmount,
  getPreSixMonthBill
} from "@/http/api";
import dayjs from 'dayjs';
import './index.less'
import {disabledMonth, formatMoney} from "@/utils/var";
import {openNotificationWithIcon} from "@/utils/window";


const Chart = () => {

  // 收支增长率
  const [accountGrowthRate,setAccountGrowthRate] = useState({
    loading:true,
    tradeDate:dayjs(),
    serverData:{
      m2m: 0,
      y2y: 0,
      avg: 0,
      account: 0
    }
  })

  // 收支率
  const [incomePercentage,setIncomePercentage] = useState({
    loading:true,
    tradeDate:dayjs(),
    serverData:{
      account: 0,
      percentage: 0
    }
  })

  // 活跃度
  const [activityRate,setActivityRate] = useState({
    loading:true,
    tradeDate:dayjs(),
    serverData:{
      avg: 0,
      count: 0,
      log6:[]
    }
  })

  // 动态发布
  const [newsRate,setNewsRate] = useState({
    loading:true,
    tradeDate:dayjs(),
    serverData:{
      avg: 0,
      count: 0,
      news6: []
    }
  })

  // tradeDate:前半年统计图 和 摘要排名 共用的查询时间条件
  const [queryWhere,setQueryWhere] = useState({tradeDate:dayjs()})

  // 摘要排名
  const [amountOrder,setAmountOrder] = useState({
    loading:true,
    serverData:[]
  })

  // 前半年账单
  const [financial6,setFinancial6] = useState({
    config:{
      autoFit: true,
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
        },
      },
    },
    loading:true,
    serverData:{
      currencyNumber:[],
      incomeAndPay:[],
    }
  })

  // 数据分布 及 词云
  const [countAndWordCloud,setCountAndWordCloud] = useState({
    loading:true,
    serverRoseData:[],
    serverWordCloudData:[]
  })

  useEffect(()=>{
    const date = dayjs();//.format('YYYY-MM-DD');
    setAccountGrowthRate({...accountGrowthRate,tradeDate: date})
    loadAccountGrowthRate(date);
    setIncomePercentage({...incomePercentage,tradeDate: date})
    loadIncomePercentage(date);
    setActivityRate({...activityRate,tradeDate: date})
    loadActivityRate(date);
    setNewsRate({...newsRate,tradeDate: date})
    loadNewsRate(date);
    setQueryWhere({tradeDate: date})
    loadOrderByAmount(date);
    loadPreSixMonthBill(date);
    loadCountAndWordCloud();
  },[])


  /**
   * 收支增长率
   * @returns {Promise<void>}
   */
  const loadAccountGrowthRate = async (queryDate = accountGrowthRate.tradeDate) => {
    setAccountGrowthRate({...accountGrowthRate,loading: true});
    // 发异步ajax请求, 获取数据
    const {err,result} = await getAccountGrowthRate({archive_date:(queryDate).format('YYYY-MM-DD')});
    if (err){
      console.error('获取收支增长率数据异常:',err)
      setAccountGrowthRate({...accountGrowthRate,loading: false});
      return
    }
    const {msg, code, data} = result
    accountGrowthRate.loading = false;
    if (code === 0) {
      const _data = {account:parseFloat(data.account),avg:parseFloat(data.avg),m2m:parseFloat(data.m2m),y2y:parseFloat(data.y2y)};
      setAccountGrowthRate({...accountGrowthRate,loading: false,serverData:_data});
    }else {
      setAccountGrowthRate({...accountGrowthRate,loading: false});
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 收支率
   * @returns {Promise<void>}
   */
  const loadIncomePercentage = async (queryDate = incomePercentage.tradeDate) => {
    setIncomePercentage({...incomePercentage,loading: true})
    // 发异步ajax请求, 获取数据
    const {err, result} = await getIncomePercentage({archive_date:(queryDate).format('YYYY-MM-DD')});
    if (err){
      console.error('获取收支率数据异常:',err)
      setIncomePercentage({...incomePercentage,loading: false})
      return
    }
    const {msg, code, data} = result
    incomePercentage.loading = false;
    if (code === 0) {
      const _data = {account:parseFloat(data.account),percentage:parseFloat(data.percentage)};
      setIncomePercentage({...incomePercentage,loading: false,serverData:_data})
    }else {
      setIncomePercentage({...incomePercentage,loading: false})
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 活跃度
   * @returns {Promise<void>}
   */
  const loadActivityRate= async (queryDate = activityRate.tradeDate) => {
    setActivityRate({...activityRate,loading: true})
    // 发异步ajax请求, 获取数据
    const {err, result} = await getActivityRate({archive_date:(queryDate).format('YYYY-MM-DD')});
    if (err){
      console.error('获取活跃度数据异常:',err)
      setActivityRate({...activityRate,loading: false})
      return
    }
    const {msg, code, data} = result
    if (code === 0) {
      const serverData = {...activityRate.serverData};
      serverData.avg = data.avg;
      serverData.count = data.count;
      const log6 = data.log6;
      let points = [];
      for(let key in log6){
        let item = log6[key];
        points.push({month: item.total_month, count: item.count})
      }
      serverData.log6 = points;
      setActivityRate({...activityRate,loading: false,serverData: serverData})
    }else {
      setActivityRate({...activityRate,loading: false})
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 动态发布
   * @returns {Promise<void>}
   */
  const loadNewsRate = async (queryDate = newsRate.tradeDate) => {
    setNewsRate({...newsRate,loading: true})
    // 发异步ajax请求, 获取数据
    const {err, result} = await getNewsRate({archive_date:(queryDate).format('YYYY-MM-DD')});
    if (err){
      console.error('获取动态发布数据异常:',err)
      setNewsRate({...newsRate,loading: false})
      return
    }
    const {msg, code, data} = result
    if (code === 0) {
      const serverData = {...newsRate.serverData}
      serverData.avg = data.avg;
      serverData.count = data.count;
      const news6 = data.news6;
      let points = [];
      // 这里的key是月份
      for(let key in news6){
        let item = news6[key];
        points.push({month: item.total_month, count: item.count})
      }
      serverData.news6 = points;
      setNewsRate({...newsRate,loading: false,serverData: serverData})
    }else {
      setNewsRate({...newsRate,loading: false})
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 账单排名
   * @returns {Promise<void>}
   */
  const loadOrderByAmount = async (queryDate = queryWhere.tradeDate) => {
    setAmountOrder({...amountOrder,loading: true})
    // 发异步ajax请求, 获取数据
    const {err, result} = await getOrderByAmount({archive_date:(queryDate).format('YYYY-MM-DD')});
    if (err){
      console.error('获取账单排名数据异常:',err)
      setAmountOrder({...amountOrder,loading: false})
      return
    }
    const {msg, code, data} = result
    if (code === 0) {
      let array = [];
      for (let i = 0; i < 6 && i < data.length; i++) {
        array.push({'index':(i+1),'name':data[i].abstracts_name,'count':parseFloat(data[i].total)})
      }
      setAmountOrder({...amountOrder,loading: false,serverData:array})
    }else {
      setAmountOrder({...amountOrder,loading: false})
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 前6个月账单
   * @returns {Promise<void>}
   */
  const loadPreSixMonthBill = async (queryDate = queryWhere.tradeDate) => {
    setFinancial6({...financial6,loading: true})
    // 发异步ajax请求, 获取数据
    const {err, result} = await getPreSixMonthBill({archive_date:(queryDate).format('YYYY-MM-DD')});
    if (err){
      console.error('获取前6个月账单数据异常:',err)
      setFinancial6({...financial6,loading: false})
      return
    }
    const {msg, code, data} = result
    if (code === 0) {
      let currencyNumber = [];
      let incomeAndPay = [];
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        // 总收支
        currencyNumber.push({time:item.archive_date,value:item.total?parseFloat(item.total):0})
        // 总收入
        incomeAndPay.push({time:item.archive_date,value:item.income?parseFloat(item.income):0,type:'收入'})
        // 总支出
        incomeAndPay.push({time:item.archive_date,value:item.outlay?parseFloat(item.outlay):0,type:'支出'})
      }
      const serverData = {currencyNumber:currencyNumber,incomeAndPay:incomeAndPay}
      setFinancial6({...financial6,loading: false,serverData:serverData})
    }else {
      setFinancial6({...financial6,loading: false})
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 数据总量及词云数据
   * @returns {Promise<void>}
   */
  const loadCountAndWordCloud = async () => {
    setCountAndWordCloud({...countAndWordCloud,loading: true})
    const {err, result} = await getCountAndWordCloud();
    if (err){
      console.error('获取数据总量及词云数据异常:',err)
      setCountAndWordCloud({...countAndWordCloud,loading: false})
      return
    }
    const {msg, code, data} = result
    if (code === 0) {
      // 发异步ajax请求, 获取数据
      setCountAndWordCloud({...countAndWordCloud,loading: false,serverRoseData:data.rose_data,serverWordCloudData:data.word_cloud})
    }else {
      setCountAndWordCloud({...countAndWordCloud,loading: false})
      openNotificationWithIcon("error", "错误提示", msg);
    }
  };

  /**
   * 页面中日期发生变化后的时间
   * @param date 时间
   * @param filed 所属统计面板
   */
  const tradeDateChange = (date,filed) => {
    if(!date){
      return;
    }
    switch (filed) {
      case "accountGrowthRate":
        setAccountGrowthRate({...accountGrowthRate,tradeDate: date})
        loadAccountGrowthRate(date);
        break;
      case "incomePercentage":
        setIncomePercentage({...incomePercentage,tradeDate: date})
        loadIncomePercentage(date);
        break;
      case "activityRate":
        setActivityRate({...activityRate,tradeDate: date})
        loadActivityRate(date);
        break;
      case "newsRate":
        setNewsRate({...newsRate,tradeDate: date})
        loadNewsRate(date);
        break;
      case "financial":
        setQueryWhere({tradeDate: date})
        loadOrderByAmount(date);
        loadPreSixMonthBill(date);
        break;
      default:
        break
    }
  }

  /**
   * 鼠标放置活动率面积图事件
   * @param title
   * @param data
   * @returns {string}
   */
  const activityCustomContent = (index, data) => {
    if (data.length > 0){
      return `${data[0].title}&nbsp;操作次数:${data[0].value}`
    }
  };

  /**
   * 鼠标放置动态柱状图事件
   * @param title
   * @param data
   * @returns {string}
   */
  const newsCustomContent = (index,data) => {
    if (data.length > 0){
      return `${data[0].title}&nbsp;撰写篇数:${data[0].value}`
    }
  }

  const processData = (data) => {
    let sumValue = 0;
    data.map((d) => {
      sumValue += d.value;
    });
    return {name: 'root',children:data,value:sumValue};
  }


  return (
      <div className='background-chart'>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            {
              accountGrowthRate.loading?
                  <Card><Skeleton active/></Card>
                  :
                  <Card>
                    <Statistic title={<div className='notice-tooltip'>收支总额<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>tradeDateChange(e,'accountGrowthRate')}  picker="month" className='date-switch' value={dayjs(accountGrowthRate.tradeDate)} format='YYYY年MM月'/></div>} value={(accountGrowthRate.serverData && accountGrowthRate.serverData.account)?accountGrowthRate.serverData.account:0} prefix={'￥'} />
                    <div className='rate-area'>
                      <div className='m2m-rate'>
                        <span className='rate-tag'>环比增长</span>
                        {
                          (!accountGrowthRate.serverData || !accountGrowthRate.serverData.m2m)
                              ? '-':
                              <div>
                                {accountGrowthRate.serverData.m2m+'%'}
                                <div style={{width:'1em',height:'1em',backgroundSize: 'cover',backgroundImage:`url('${'/picture/svg/'+(accountGrowthRate.serverData.m2m>0?'caret-up.svg':'caret-down.svg')}')`}}></div>
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
                                <div style={{width:'1em',height:'1em',backgroundSize: 'cover',backgroundImage:`url('${'/picture/svg/'+(accountGrowthRate.serverData.y2y>0?'caret-up.svg':'caret-down.svg')}')`}}></div>
                              </div>
                        }
                      </div>
                    </div>
                    <Divider className='extra-divider'/>
                    <div>
                      日均收支金额(元)：{(accountGrowthRate.serverData && accountGrowthRate.serverData.avg)?formatMoney(accountGrowthRate.serverData.avg,2):'-'}
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
                    <Statistic title={<div className='notice-tooltip'>收支率<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>tradeDateChange(e,'incomePercentage')}  picker="month" className='date-switch' value={dayjs(incomePercentage.tradeDate)} format='YYYY年MM月'/></div>} valueStyle={{ color: ((incomePercentage.serverData && incomePercentage.serverData.percentage)?incomePercentage.serverData.percentage:0)>=0.5?'#cf1322':'#3f8600' }} value={(incomePercentage.serverData && incomePercentage.serverData.percentage)?incomePercentage.serverData.percentage*100:'-'} precision={2} suffix="%"/>
                    <Progress style={{height:'70px',marginBottom: '0',lineHeight: '70px'}}  percent={(incomePercentage.serverData && incomePercentage.serverData.percentage)?incomePercentage.serverData.percentage*100:0} strokeColor='#cf1322' trailColor='#3f8600'/>
                    <Divider className='extra-divider'/>
                    <div>
                      总收支金额(元)：{(incomePercentage.serverData && incomePercentage.serverData.account)?formatMoney(incomePercentage.serverData.account,2):'-'}
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
                    <Statistic title={<div className='notice-tooltip'>活跃度<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>tradeDateChange(e,'activityRate')}  picker="month" className='date-switch' value={dayjs(activityRate.tradeDate)} format='YYYY年MM月'/></div>} value={(activityRate.serverData && activityRate.serverData.count)?activityRate.serverData.count:0} suffix="次"/>
                    <AreaChart height={70} autoFit={true} data={activityRate.serverData.log6} smooth={true} xField='month' xAxis={{visible:false}} yField='count' yAxis={{visible:false,grid:{visible:false}}} tooltip={{customContent:activityCustomContent}} areaStyle={{fill: '#975fe4'}} line={{color:'#975fe4'}}/>
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
                    <Statistic title={<div className='notice-tooltip'>动态数<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>tradeDateChange(e,'newsRate')}  picker="month" className='date-switch' value={dayjs(newsRate.tradeDate)} format='YYYY年MM月'/></div>} value={(newsRate.serverData && newsRate.serverData.count)?newsRate.serverData.count:0} suffix="篇"/>
                    <ColumnChart height={70} autoFit={true} data={newsRate.serverData.news6} xField='month' xAxis={{visible:false}} yField='count' yAxis={{visible:false,grid:{visible:false}}} tooltip={{customContent:newsCustomContent}}/>
                    <Divider className='extra-divider'/>
                    <div>
                      日均撰写(篇)：{(newsRate.serverData && newsRate.serverData.avg)?newsRate.serverData.avg:'-'}
                    </div>
                  </Card>
            }
          </Col>

          <Col span={24}>
            <Card title="收支统计" bordered={false} extra={<DatePicker bordered={false} disabledDate={disabledMonth} onChange={(e)=>tradeDateChange(e,'financial')}  picker="month" className='date-switch' value={dayjs(queryWhere.serverData)} format='YYYY年MM月'/>}>
              <Row gutter={50} style={{minHeight:'25em'}}>
                <Col span={9}>
                  {
                    financial6.loading?
                        <Skeleton active/>
                        :
                        <LineChart data={financial6.serverData.incomeAndPay} title={{visible: true,text: '收支关系'}} xField='time' yField='value'
                                   seriesField='type'
                            color={['#6897a7', '#8bc0d6']}
                             legend={{visible: true,position: 'right-top'}} smooth={true}/>
                  }
                </Col>
                <Col span={9}>
                  {
                    financial6.loading?
                        <Skeleton active/>
                        :
                        <ColumnChart data={financial6.serverData.currencyNumber} title={{visible: true,text: '流水状况'}}
                            autoFit padding='auto' xField='time' yField='value'
                            meta={{type: {alias: '月份'},sales: {alias: '金额'}}}
                        />
                  }
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
                                  {item.index}、{item.name}<span style={{float:'right'}}>¥{formatMoney(item.count,2)}</span>
                                </List.Item>
                            )}
                        />
                  }
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={15}>
            {
              countAndWordCloud.loading?
                  <Card><Skeleton active/></Card>
                  :
                  <Card title="活跃笔记簿" bordered={false}>
                    <TreemapChart autoFit={true} colorField='name' data={processData(countAndWordCloud.serverWordCloudData)}/>
                  </Card>
            }
          </Col>
          <Col span={9}>
            {
              countAndWordCloud.loading?
                  <Card><Skeleton active/></Card>
                  :
                  <Card title="数据分布" bordered={false}>
                    <RoseChart autoFit={true} xField='name' yField='value'  seriesField='name' radius={0.9} label={{ offset: -15 }} data={countAndWordCloud.serverRoseData}/>
                  </Card>
            }
          </Col>
        </Row>
      </div>
  );

}

// 对外暴露
export default Chart;