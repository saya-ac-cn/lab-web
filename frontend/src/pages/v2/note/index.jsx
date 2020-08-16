import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import './index.less'
import {queryNews} from "../../../api";
import {openNotificationWithIcon_} from "../../../utils/window";
import {Button} from "antd";

/*
 * 文件名：index.jsx
 * 作者：shmily
 * 创建日期：2020/8/16 - 8:27 上午
 * 描述：
 */

// 定义组件（ES6）
class Note extends Component {

  state = {
    // 返回的单元格数据
    datas: [],
    // 是否显示加载
    listLoading: false,
    // 下一页
    nextpage: 1,
    // 页面宽度
    pageSize: 10,
  };

  /**
   * 获取动态列表数据
   * @returns {Promise<void>}
   */
  getDatas = async (nowpage) => {
    let para = {
      nowPage: nowpage,
      pageSize: this.state.pageSize
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
      this.setState({nextpage: null});
    }
  };

  /**
   * 加载更多
   * @param nextpage
   */
  loadMore = (nextpage) => {
    console.log(nextpage)
    this.getDatas(nextpage);
  }

  /**
   * 渲染日期
   */
  rendering = (data) => {
    let {datas, nextpage} = this.state;
    let localdata = []
    if (!(this.isEmptyObject(data.grid))) {
      //对文件进行二次处理
      for (var i in data.grid) {
        var obj = data.grid[i];
        var b = (obj.createtime).substr(0, 10).split("-");//分割日期，先把空格后的分钟切开
        localdata[i] = Object.assign({}, obj)
        localdata[i].month = b[1];
        localdata[i].year = b[0];
        localdata[i].day = b[2];
      }
      //第一页采用直接覆盖的显示方式
      if (data.pageNow === 1 || data.pageNow === '1') {
        datas = localdata;
      } else {
        datas = (datas).concat(localdata);//追加，合并
      }
    } else {
      datas = null;
    }
    //显示是否加载下一页(当前页是最后一页)
    if (data.pageNow === data.totalPage) {
      nextpage = null;
    } else {
      nextpage = data.pageNow + 1;
    }
    this.setState({
      datas: datas,
      nextpage: nextpage
    })
  }

  /**
   * 判断对象是否为空
   * @param data
   * @returns {boolean}
   */
  isEmptyObject = (data) => {
    // 手写实现的判断一个对象{}是否为空对象，没有任何属性 非空返回false
    var item;
    for (item in data)
      return false;
    return true;
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
    const {datas, nextpage, listLoading} = this.state;
    return (
      <DocumentTitle title="saya.ac.cn-随笔记录">
        <div className="frontend2-note">
          <div className="child-container">
            <div className="column-title">
              随笔记录
            </div>
            <div id="datagrid">
                <ul>
                  <li>
                    <div className={`bullet pink`}></div>
                    <div className="itemdate">
                      <div className="yearmonthday"><span>08</span> {2020+'.'+16}</div>
                    </div>
                    <div className="itemcontent">
                      <h3>
                        <a href={`/v2/pandora/newsInfo/1`} rel="noopener noreferrer" target="_blank">测试</a>
                      </h3>
                      <h5>标签1；标签2</h5>
                      <h4>正文正文</h4>
                    </div>
                  </li>
                  <li>
                    <div className={`bullet pink`}></div>
                    <div className="itemdate">
                      <div className="yearmonthday"><span>08</span> {2020+'.'+16}</div>
                    </div>
                    <div className="itemcontent">
                      <h3>
                        <a href={`/v2/pandora/newsInfo/1`} rel="noopener noreferrer" target="_blank">测试</a>
                      </h3>
                      <h5>标签1；标签2</h5>
                      <h4>正文正文</h4>
                    </div>
                  </li>
                  <li>
                    <div className={`bullet pink`}></div>
                    <div className="itemdate">
                      <div className="yearmonthday"><span>08</span> {2020+'.'+16}</div>
                    </div>
                    <div className="itemcontent">
                      <h3>
                        <a href={`/v2/pandora/newsInfo/1`} rel="noopener noreferrer" target="_blank">测试</a>
                      </h3>
                      <h5>标签1；标签2</h5>
                      <h4>正文正文</h4>
                    </div>
                  </li>
                  <li>
                    <div className={`bullet pink`}></div>
                    <div className="itemdate">
                      <div className="yearmonthday"><span>08</span> {2020+'.'+16}</div>
                    </div>
                    <div className="itemcontent">
                      <h3>
                        <a href={`/v2/pandora/newsInfo/1`} rel="noopener noreferrer" target="_blank">测试</a>
                      </h3>
                      <h5>标签1；标签2</h5>
                      <h4>正文正文</h4>
                    </div>
                  </li>
                </ul>

                <div className='null-content'>
                  已经加载完了
                </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

// 对外暴露
export default Note;
