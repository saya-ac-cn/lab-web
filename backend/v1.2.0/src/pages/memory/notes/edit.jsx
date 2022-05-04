import React, {Component} from 'react';
import {Button, Form, Col, Input, Tag, Select} from "antd";
import RichTextEditor from '../../../component/for-editor'
import {openNotificationWithIcon} from "../../../utils/window";
import {getNotes, updateNotes, createNotes, getNoteBookGroup} from "../../../api/index"
import DocumentTitle from 'react-document-title'
import "./index.less"
import {clearTrimValueEvent} from "../../../utils/string";
import {PlusOutlined} from "@ant-design/icons";
/*
 * 文件名：book.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-27 - 21:44
 * 描述：编辑笔记
 */
const {Option} = Select;
// 定义组件（ES6）
class EditNote extends Component {

    // 创建用来保存ref标识的标签对象的容器
    formRef = React.createRef();
    markdownRef = React.createRef();

    state = {
        tagColor:['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple'],
        tags: [],
        inputVisible: false,
        inputValue: '',
        form: {},
        // 根据是否传入id标识保存操作为 新增 还是 修改
        isUpdate: false,
        id: '',
        notebooks: []
    };

    /**
     * 删除tag
     * @param removedTag
     */
    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    };

    /**
     * 显示文本框，让用户可输入
     */
    showInput = () => {
        let _this = this;
        let tags = _this.state.tags;
        // 至多允许用户输入5个tag
        if (tags.length < 5){
            this.setState({ inputVisible: true }, () => this.input.focus());
        }
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    /**
     * 添加tag
     */
    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };


    forMap = tag => {
        let colors = this.state.tagColor;
        const tagElem = (
            <Tag
                closable
                color={colors[Math.floor(Math.random()*10)]}
                onClose={e => {
                    e.preventDefault();
                    this.handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
        return (<span key={tag} style={{ display: 'inline-block' }}>{tagElem}</span>
        );
    };


    /**
     * 提交数据
     */
    submit = () => {
      let _this = this;
      let {tags, isUpdate, id} = _this.state;
      // 调用子组件
      if (_this.markdownRef.isNull() === true){
          openNotificationWithIcon("error", "错误提示", "请填写您要发布的内容");
          return
      }
      // 调用子组件
      const editor = _this.markdownRef.getValue();
      _this.formRef.current.validateFields(['topic', 'notebookId']).then(value => {
        // 通过核验
        let _thisTag = null
        if (tags.length > 1){
            _thisTag = tags.join(';')
        } else if(tags.length === 1){
            _thisTag = tags[0]
        } else {
            _thisTag = null
        }
        let para = {
          topic: value.topic,
          label: _thisTag,//标签
          content: editor,
          notebookId: value.notebookId,
        };
        if (isUpdate){
            // 走更新的流程
            para.id = id
            _this.updateNotes(para)
        } else{
            // 走发布的流程
            _this.createNotes(para)
        }
      }).catch(e => console.log("修改或添加笔记错误",e));
    };

    // 更新动态
    updateNotes = async (param) => {
        const {msg, code} = await updateNotes(param);
        if (code === 0) {
            openNotificationWithIcon("success", "操作结果", "笔记修改成功");
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };

    // 创建动态
    createNotes = async (param) => {
        const {msg, code} = await createNotes(param);
        if (code === 0) {
            openNotificationWithIcon("success", "操作结果", "笔记保存成功");
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    };


    /**
     * 获取动态列表数据
     * @returns {Promise<void>}
     */
    initDatas = async (id) => {
      const _this= this;
      const para = {
          id: id
      };
      // 发异步ajax请求, 获取数据
      const {msg, code, data} = await getNotes(para);
      if (code === 0) {
        _this.setState({
              tags:data.label === null ? [] : (data.label).split(';'),
              form: data,
              isUpdate:true,
              id: id
          },function () {
          _this.formRef.current.setFieldsValue(data);
          _this.markdownRef.initEditor(data.content);
        });
      } else {
          openNotificationWithIcon("error", "错误提示", msg);
      }
    };

    /**
     * 得到笔记簿下拉选择列表数据
     */
    getNoteBooks = async () =>{
        let _this = this;
        // 发异步ajax请求, 获取数据
        const {msg, code, data} = await getNoteBookGroup()
        if (code === 0) {
            let notebooks = [];
            data.forEach(item => {
                notebooks.push((<Option key={item.id} value={item.id}>{item.name}</Option>));
            });
            _this.setState({
                notebooks
            })
        } else {
            openNotificationWithIcon("error", "错误提示", msg);
        }
    }

    /**
     * 为markdown组件绑定ref
     * @param ref
     */
    bindMarkDownRef = (ref) => {
      this.markdownRef = ref
    };

    /**
     * 初始化页面配置信息
     */
    componentDidMount() {
        let _this = this;
        // 初始化用户笔记簿数据
        _this.getNoteBooks()
        // 取出携带的state
        let notes = _this.props.location.state;
        // 如果是添加模式没值, 否则有值
        if (notes){
            _this.initDatas(notes.id)
        } else {
          let form = {content:' '};// 初始化
          this.setState({
              isUpdate:false,
              form: form
          },function () {
            _this.formRef.current.setFieldsValue({'topic':null, 'notebookId':null});
            _this.markdownRef.initEditor(' ');
          });
        }
        this.formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 21},
        };
        this.buttonItemLayout = {
            wrapperCol: {span: 21, offset: 2},
        };
    };


    render() {
        //const {getFieldDecorator} = this.props.form;
        const { tags, inputVisible, inputValue,form,notebooks} = this.state;
        const tagChild = tags.map(this.forMap);
        return (
            <DocumentTitle title="编辑笔记">
                <section className="b-edit-notes-page">
                    <div className="mytips">
                        <p>平台发布笔记约定：</p>
                        <blockquote>
                            <p>
                                <i>1、笔记标题必须填写。</i>
                            </p>
                            <p>
                                <i>2、标签可以填写也可以不填写，最多不超过5个(≤5)标签。</i>
                            </p>
                            <p>
                                <i>3、笔记所属分类（笔记簿）必须选择</i>
                            </p>
                            <p>
                                <i>4、动态内容必须填写，书写采用采用MarkDown语法。书写完毕后，建议到前台页面查看实际效果，以便造成格式不兼容。</i>
                            </p>
                        </blockquote>
                    </div>
                    <Col span={24} className="b-edit-notes-page-form">
                        <Form {...this.formItemLayout} ref={this.formRef} className="bk-transparent">
                          <Form.Item {...this.buttonItemLayout} style={{'textAlign':'right'}}>
                            <Button htmlType="button" type="primary" onClick={this.submit}>提交</Button>
                          </Form.Item>
                            <Form.Item label="标题" {...this.formItemLayout} name='topic' initialValue={form.topic} getValueFromEvent={ (e) => clearTrimValueEvent(e)} rules={[ {required: true, message: '请输入标题'}, {max: 50, message: '最多不超过50个字符'},]}>
                              <Input type='text' style={{width:'40em'}}/>
                            </Form.Item>
                            <Form.Item label="所属分类" {...this.formItemLayout} name='notebookId' initialValue={form.notebookId} rules={[{required: true, message: '请选择所属分类'}]}>
                              <Select style={{width:'34em'}} showSearch
                                      placeholder="请选择所属分类">
                                {notebooks}
                              </Select>
                            </Form.Item>
                            <Form.Item label="标签" {...this.formItemLayout}>
                                <div style={{ marginBottom: 16 }}>
                                    {tagChild}
                                </div>
                                {inputVisible && (
                                    <Input
                                        ref={input => this.input = input}
                                        type="text"
                                        size="small"
                                        style={{ width: 78 }}
                                        value={inputValue}
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleInputConfirm}
                                        onPressEnter={this.handleInputConfirm}
                                    />
                                )}
                                {!inputVisible && (
                                    <Tag onClick={this.showInput} >
                                      <PlusOutlined/> New Tag
                                    </Tag>
                                )}
                            </Form.Item>
                            <Form.Item label="内容" {...this.formItemLayout}>
                                <RichTextEditor onRef={this.bindMarkDownRef.bind(this)}/>
                            </Form.Item>
                        </Form>
                    </Col>
                </section>
            </DocumentTitle>
        );
    }
}

/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
*/

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
*/

// 对外暴露
export default EditNote;
