import React, {Component} from 'react';
import DocumentTitle from 'react-document-title'
import './index.less'
import {queryNotesInfo} from "@/api";
import {openNotificationWithIcon_} from "@/utils/window";
import {isEmptyObject} from "@/utils/var"
import {Spin, Tag} from "antd";
import Editor from 'for-editor'
import {isInteger} from "@/utils/var";
import withRouter from "@/utils/withRouter";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-09-09 - 21:08
 * 描述：笔记详情
 */

// 定义组件（ES6）
class NoteInfo extends Component {

    state = {
        datas: null,
        // 笔记编号
        id: null,
        listLoading: false,
        tagColor: ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'],
    }

    /**
     * 获取笔记详情数据
     * @returns {Promise<void>}
     */
    initDatas = async () => {
        let thisData = {}
        // 发异步ajax请求, 获取数据
        // 在发请求前, 显示loading
        this.setState({listLoading: true});
        const {msg, code, data} = await queryNotesInfo(this.state.id);
        // 在请求完成后, 隐藏loading
        this.setState({listLoading: false});
        if (code === 0) {
            const thisNotes = data.now;
            thisData = data
            thisData.now.topic = thisNotes.topic
            thisData.now.label = thisNotes.label === null ? [] : (thisNotes.label).split(';')
            thisData.now.content = thisNotes.content
            this.setState({
                datas: thisData
            });
        }else if (code === -3) {
            this.props.navigate('/404')
        }else {
            openNotificationWithIcon_("error", "错误提示", msg);
        }
    };

    forMap = tag => {
        let colors = this.state.tagColor;
        const tagElem = (
            <Tag
                color={colors[Math.floor(Math.random()*10)]}>
                {tag}
            </Tag>
        );
        return (<span key={tag} style={{ display: 'inline-block' }}>{tagElem}</span>
        );
    };

    /**
     * 初始化页面配置信息
     */
    componentWillMount() {
        let _this = this
        let {id} = _this.props.params
        if (isInteger(id)) {
            id = parseInt(id);
            _this.setState({id}, function () {
                _this.initDatas()
            })
        }else {
            window.location.href = '/404'
        }
    }


    render() {
        // 读取状态数据
        const {datas, listLoading} = this.state;
        let title = '笔记详情'
        let tagChild = []
        if (!(isEmptyObject(datas))){
            if (!(isEmptyObject(datas.now))) {
                title = datas.now.topic
                 tagChild = datas.now.label.map(this.forMap);
            }
        }
        return (
            <DocumentTitle title={`文章-${title}`}>
                <div className="frontend-note">
                    <div className="child-container">
                        <div className="column-title">
                          文章详情
                        </div>
                        {
                            listLoading === true ? <Spin/> :
                                <div>
                                    {
                                        !(isEmptyObject(datas)) ?
                                            <div>
                                                <div className="news-name">{datas.now.topic}</div>
                                                <div className="news-tool">
                                                    <div className="subtitle">
                                                      {`来源：${datas.now.source}       发布于：${datas.now.create_time}`}
                                                    </div>
                                                    <div className="tools-share">
                                                        标签：{tagChild}
                                                    </div>
                                                </div>
                                                <div className="news-wrap">
                                                    <div className="news-content">
                                                        <Editor
                                                            heigh="auto"
                                                            value={datas.now.content}
                                                            style={{border:'none',boxShadow:'none',background:'none',height:'100%'}}
                                                            toolbar={{}}
                                                            preview={true} />
                                                    </div>
                                                    <div className="news-footer">
                                                        <ul>
                                                            <li className="pre-li">
                                                                <span>上一篇</span>
                                                                {
                                                                    !(isEmptyObject(datas.pre)) ? <a href={`/public/note/${datas.pre.id}`}>{datas.pre.topic}</a> : <a href="#base-content">已是第一篇了</a>
                                                                }
                                                            </li>
                                                            <li className="next-li">
                                                                <span>下一篇</span>
                                                                {
                                                                    !(isEmptyObject(datas.next)) ? <a href={`/public/note/${datas.next.id}`}>{datas.next.topic}</a> :
                                                                        <a href="#base-content">已是最后一篇了</a>
                                                                }
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        : <div className="empty-news">该动态不存在</div>
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
export default withRouter(NoteInfo);
