import React, { Component } from 'react';
import DocumentTitle from "react-document-title";
import "./index.less"
import moment from 'moment';
import {Button, Spin,Row,Col,Tooltip} from 'antd'
import {CloudDownloadOutlined, EyeOutlined} from '@ant-design/icons';
import {downloadFiles, queryFile} from "../../api";
import {openNotificationWithIcon_} from "../../utils/window";
import {isEmptyObject} from "../../utils/var"
import axios from "axios";
/*
 * 文件名：index.jsx
 * 作者：saya
 * 创建日期：2020/8/30 - 2:56 下午
 * 描述：
 */

// 定义组件（ES6）
class File extends Component {

    state = {
        // 返回的单元格数据
        datas: [],
        // 是否显示加载
        listLoading: false,
        // 下一页
        nextpage: 1,
        // 页面宽度
        pageSize: 15,
    };

    /**
     * 获取文件列表数据
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
        const {msg, code, data} = await queryFile(para);
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
    loadMore = (nextpage) =>{
        this.getDatas(nextpage);
    };

    /**
     * 下载文件
     * @param row
     */
    downloadFile = (row) => {
        let _this = this;
        // 在发请求前, 显示loading
        _this.setState({listLoading: true});
        axios({
            method: "GET",
            url: downloadFiles+row.id,   //接口地址
            responseType: 'blob',
            //上面这个参数不加会乱码，据说{responseType: 'arraybuffer'}也可以
            headers: {
                "Content-Type": "application/json"
            },
        }).then(function (res) {
            _this.setState({listLoading: false});
            let fileName = row.filename;//文件名称
            let blob = new Blob([res.data]);
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                window.URL.revokeObjectURL(link.href);
            }
        }).catch(function (res) {
            _this.setState({listLoading: false});
            openNotificationWithIcon_("error", "错误提示", "下载文件失败"+res);
        });
    };

    /**
     * 渲染日期
     */
    rendering = (data) => {
        let {datas, nextpage} = this.state;
        let localdata = [];
        if (!(isEmptyObject(data.grid))) {
            //对文件进行二次处理
            for (let i in data.grid) {
                let obj = data.grid[i];
                localdata[i] = Object.assign({},obj)
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
    };

    /*
     * 执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 加载页面数据
        this.getDatas(1);
    };

    render() {
        const {datas, nextpage, listLoading} = this.state;
        return (
            <DocumentTitle title="saya.ac.cn-共享资源">
                <div className="frontend-file">
                    <div className="child-container">
                        <div className="column-title">
                            共享资源
                        </div>
                        <div className="file-web">
                            {
                                listLoading === true ? <Spin/> :
                                    <Row id="datagrid" align='middle' justify='start'>
                                        {datas !== null ? datas.map((item) => (
                                                <Col xs={3} sm={3} xxl={2} className="file-block" key={item.id}>
                                                    <div className='file-icon' onClick={() => this.downloadFile(item)} style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/suffix/pdf.svg')`}}></div>
                                                    <Tooltip title={item.filename} color='#aec58b' placement="bottom">
                                                        <p className='file-name' onClick={() => this.downloadFile(item)}>{item.filename}</p>
                                                    </Tooltip>
                                                    <p className='file-date'>{moment(item.date).format('MM/DD HH:mm')}</p>
                                                </Col>
                                            )):
                                            <Col xs={3} sm={3} xxl={2} className="file-block">
                                                <div className='file-icon' style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/empty.svg')`}}></div>
                                                <p className='file-name'>没有文档</p>
                                                <p className='file-date'>&nbsp;</p>
                                            </Col>
                                        }
                                        {nextpage !== null ?
                                            <Col xs={3} sm={3} xxl={2} className="file-block">
                                                <div className='file-icon' onClick={() => this.loadMore(nextpage)} style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/more.svg')`}}></div>
                                                <p className='file-name' onClick={() => this.loadMore(nextpage)}>更多</p>
                                                <p className='file-date'>&nbsp;</p>
                                            </Col>
                                            :
                                            <Col xs={3} sm={3} xxl={2} className="file-block">
                                                <div className='file-icon' style={{backgroundImage:`url('${process.env.PUBLIC_URL}/picture/svg/empty.svg')`}}></div>
                                                <p className='file-name'>没有更多了</p>
                                                <p className='file-date'>&nbsp;</p>
                                            </Col>
                                        }
                                    </Row>
                            }
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}

// 对外暴露
export default File;