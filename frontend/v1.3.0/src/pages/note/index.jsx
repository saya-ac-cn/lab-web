import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import './index.less'
import {queryNote, queryNotebook} from "../../api";
import {openNotificationWithIcon_} from "../../utils/window";
import {Button, Spin, Tag} from "antd";
import {EyeOutlined} from '@ant-design/icons';
import {isEmptyObject} from "../../utils/var"
/*
 * 文件名：index.jsx
 * 作者：shmily
 * 创建日期：2020/8/16 - 8:27 上午
 * 描述：
 */

// 定义组件（ES6）
class Note extends Component {

  state = {
    tagColor: ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'],
    bulletColor: ['pink', 'green', 'blue', 'orange'],
    // 笔记簿数据
    notes: null,
    // 笔记数据
    datas: null,
    // 笔记数
    dataTotal:null,
    listLoading: false,
    // 用户切换选择的笔记簿
    notebookId: null,
    page_size: 10,
    // 下一页
    next_page: null,
  }

  initNoteBooks= async () => {
    let _this = this
    const {msg, code, data} = await queryNotebook(null)
    if (code === 0){
      _this.setState({
        notes:data
      })
    } else {
      openNotificationWithIcon_("error", "错误提示", msg);
    }
  }

  /**
   * 获取笔记列表数据
   * @returns {Promise<void>}
   */
  getDatas = async (page_now) => {
    let _this = this
    let {notebookId,page_size} = _this.state
    let para = {
      notebook_id:notebookId,
      page_no: page_now,
      page_size: page_size
    };
    // 在发请求前, 显示loading
    this.setState({listLoading: true});
    // 发异步ajax请求, 获取数据
    const {msg, code, data} = await queryNote(para);
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
   * 渲染加工页面数据
   */
  rendering = (data) => {
    let {datas, next_page} = this.state;
    let localdata = []
    if (!(isEmptyObject(data.records))) {
      //对文件进行二次处理
      for (var i in data.records) {
        const obj = data.records[i];
        const b = (obj.create_time).substr(0, 10).split("-");//分割日期，先把空格后的分钟切开
        localdata[i] = Object.assign({},obj)
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

  /**
   * 切换笔记簿
   */
  handleSwitchBook = (bookid) =>{
    let _this = this
    _this.setState({
      notebookId: bookid
    },function () {
      _this.getDatas(1)
    })
  }

  forMap = tag => {
    let colors = this.state.tagColor;
    const tagElem = (
      <Tag onClick={() => this.handleSwitchBook(tag.id)} style={{cursor: 'pointer' }}
           color={colors[Math.floor(Math.random()*10)]}>
        {tag.name}
      </Tag>
    );
    return (<span key={tag.id}>{tagElem}</span>
    );
  };

  labelForMap = tag => {
    let colors = this.state.tagColor;
    const tagElem = (
      <Tag color={colors[Math.floor(Math.random()*10)]}>
        {tag}
      </Tag>
    );
    return (<span key={Math.random()}>{tagElem}</span>
    );
  };

  /**
   * 加载更多
   * @param next_page
   */
  loadMore = (next_page) =>{
    console.log(next_page)
    this.getDatas(next_page);
  }

  /*
   * 执行异步任务: 发异步ajax请求
   */
  componentDidMount() {
    // 加载笔记簿
    this.initNoteBooks()
    // 加载页面数据
    this.getDatas(1);
  };


  render() {
    // 读取状态数据
    const {datas, listLoading, notes, dataTotal,next_page, bulletColor} = this.state;
    return (
      <DocumentTitle title="技术专题">
        <div className="frontend-note">
          <div className="child-container">
            <div className="column-title">
              技术专题
            </div>
            <div className="note-lable">
              {
                dataTotal >= 0 ? <Tag color="purple" style={{cursor: 'pointer' }} onClick={() => this.handleSwitchBook(null)}>全部分类</Tag>:<Tag color="purple">全部分类</Tag>
              }
              {
                !!notes? notes.map(this.forMap):null
              }
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
                            <a href={`/public/note/${item.id}`} rel="noopener noreferrer" target="_blank">{item.topic}</a>
                          </h3>
                          <h4>{item.abstracts}</h4>
                          <h5>标签：{ !!item.label ? (item.label.split(";")).map(this.labelForMap):null }</h5>
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
export default Note;
