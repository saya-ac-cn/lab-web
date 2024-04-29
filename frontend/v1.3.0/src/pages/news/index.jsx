import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import './index.less'
import {queryNews} from "@/api";
import {openNotificationWithIcon_} from "@/utils/window";
import {Button, Spin, Tag} from "antd";
import {isEmptyObject} from "@/utils/var"
import {EyeOutlined} from '@ant-design/icons';
/*
 * 文件名：index.jsx
 * 作者：shmily
 * 创建日期：2020/8/16 - 8:27 上午
 * 描述：
 */

// 定义组件（ES6）
class News extends Component {

  state = {
    tagColor: ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'],
    bulletColor: ['pink', 'green', 'blue', 'orange'],
    // 返回的单元格数据
    datas: [],
    // 是否显示加载
    listLoading: false,
    // 下一页
    next_page: 1,
    // 页面宽度
    page_size: 10,
  };

  /**
   * 获取动态列表数据
   * @returns {Promise<void>}
   */
  getDatas = async (page_now) => {
    let para = {
      page_no: page_now,
      page_size: this.state.page_size
    };
    // 在发请求前, 显示loading
    this.setState({listLoading: true});
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await queryNews(para);
    // 在请求完成后, 隐藏loading
    this.setState({listLoading: false});
    if (code === 0) {
      // 表格数据
      this.rendering(data);
    } else {
      openNotificationWithIcon_("error", "错误提示", msg);
      this.setState({next_page: null});
    }
  };

  /**
   * 加载更多
   * @param next_page
   */
  loadMore = (next_page) => {
    console.log(next_page)
    this.getDatas(next_page);
  }

  /**
   * 渲染日期
   */
  rendering = (data) => {
    let {datas,next_page} = this.state;
    let localdata = []
    if (!(isEmptyObject(data.records))) {
      //对文件进行二次处理
      for (const i in data.records) {
        const obj = data.records[i];
        const b = (obj.create_time).substr(0, 10).split("-");//分割日期，先把空格后的分钟切开
        localdata[i] = Object.assign({}, obj)
        localdata[i].month = b[1];
        localdata[i].year = b[0];
        localdata[i].day = b[2];
      }
      //第一页采用直接覆盖的显示方式
      if (data.page_no === 1 || data.page_no === '1') {
        datas = localdata;
      } else {
        datas = (datas).concat(localdata);//追加，合并
      }
    } else {
      datas = null;
    }
    //显示是否加载下一页(当前页是最后一页)
    if (data.page_no === data.total_page) {
      next_page = null;
    } else {
      next_page = data.page_no + 1;
    }
    this.setState({
      datas: datas,
      next_page: next_page
    })
  }


  forMap = tag => {
    let colors = this.state.tagColor;
    const tagElem = (
      <Tag color={colors[Math.floor(Math.random()*10)]}>
        {tag}
      </Tag>
    );
    return (<span key={Math.random()} style={{ display: 'inline-block' }}>{tagElem}</span>
    );
  };

  /*
   * 执行异步任务: 发异步ajax请求
   */
  componentDidMount() {
    // 加载页面数据
    this.getDatas(1);
  };


  render() {
    // 读取状态数据
    const {datas, bulletColor, next_page, listLoading} = this.state;
    return (
      <DocumentTitle title="消息动态">
        <div className="frontend-news">
          <div className="child-container">
            <div className="column-title">
              消息动态
            </div>
            {
              listLoading === true ? <Spin/> :
                <div id="datagrid">
                  {datas !== null ? <ul>{datas.map((item) => (
                      <li key={item.id}>
                        <div className={`bullet ${bulletColor[Math.floor(Math.random()*3)]}`}></div>
                        <div className="itemdate">
                          <div className="yearmonthday"><span>{item.month}</span> {item.year+'.'+item.day}</div>
                        </div>
                        <div className="itemcontent">
                          <h3>
                            <a href={`/public/news/${item.id}`} rel="noopener noreferrer" target="_blank">{item.topic}</a>
                          </h3>
                          <h4>{item.abstracts}</h4>
                          <h5>标签：{ !!item.label ? (item.label.split(";")).map(this.forMap):null }</h5>
                        </div>
                      </li>
                    ))}</ul>:
                    <div className='null-content'>
                      好像并没有了诶
                    </div>
                  }
                  {next_page !== null ?
                    <div className='loadmore-content'>
                      <Button onClick={() => this.loadMore(next_page)} type="primary" shape="circle" icon={<EyeOutlined />} size='large'/>
                    </div>
                    :
                    <div className='null-content'>
                      已经加载完了
                    </div>
                  }
                </div>
            }
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

// 对外暴露
export default News;
