import React, { Component } from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'
import NotesList from './list'
import EditNote from "./edit";
/*
 * 文件名：index.jsx
 * 作者：liunengkai
 * 创建日期：2019-07-27 - 22:01
 * 描述：笔记便笺管理
 */

// 定义组件（ES6）
class Notes extends Component {


  render() {
      return (
          <Switch>
              <Route path='/backstage/memory/notes' component={NotesList} exact/> {/*路径完全匹配*/}
              <Route path='/backstage/memory/notes/create' component={EditNote}/>
              <Route path='/backstage/memory/notes/update' component={EditNote}/>
              <Redirect to='/backstage/memory/notes'/>
          </Switch>
      )
  }
}

// 对外暴露
export default Notes;
