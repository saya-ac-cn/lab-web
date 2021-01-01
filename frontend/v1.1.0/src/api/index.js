import ajax from './ajax'
/**
 * 重要说明！！！
 * 因为，后台已对「/backend，/frontend，/files」接口代理,页面路由绝对禁止出现/backend、/frontend、/files（远景包括map）
 * 在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
 * @type {string}
 */

// 前台api接口
let publicAPI = '/frontend';
let frontendAPI = publicAPI + '/Pandora';

// 百度搜索地址
export const baiduSearchWord = 'http://www.baidu.com/s';
// 百度模糊搜索地址
export const baiduSearchSelect = `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su`;

// 前台部分
// 获取动态列表
export const queryNews = params => ajax(`${frontendAPI}/news`, params, 'GET');
// 获取文件列表
export const queryFile = params => ajax(`${frontendAPI}/file`, params, 'GET');
// 下载文件
export const downloadFiles = `${frontendAPI}/files/download/`;
// 获取行程安排
export const queryPlan = params => ajax(`${frontendAPI}/plan`, params, 'GET');
// 留言
export const writeboard = params => ajax(`${publicAPI}/write/board`, params, 'POST');
// 获取笔记簿
export const queryNotebook = params => ajax(`${frontendAPI}/notebook`, params, 'GET');
// 获取笔记
export const queryNote = params => ajax(`${frontendAPI}/notes`, params, 'GET');
// 获取动态详情
export const queryNewsInfo = params => ajax(`${frontendAPI}/news/info`, params, 'GET');
// 获取笔记详情
export const queryNotesInfo = params => ajax(`${frontendAPI}/notes/info`, params, 'GET');

