import ajax from './ajax'
/**
 * 重要说明！！！
 * 因为，后台已对「/backend，/frontend，/files」接口代理,页面路由绝对禁止出现/backend、/frontend、/files（远景包括map）
 * 在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
 * @type {string}
 */

// 公众api接口
const publicAPI = '/frontend';
// 组织id
const organize = 1;

// 获取动态列表
export const queryNews = params => ajax(`${publicAPI}/page/news/${organize}`, params, 'GET');
// 获取文件列表
export const queryFile = params => ajax(`${publicAPI}/page/files/${organize}`, params, 'GET');
// 下载文件
export const downloadFiles = `${publicAPI}/files/download/`;
// 获取行程安排
export const queryPlan = params => ajax(`${publicAPI}/plan/${organize}`, params, 'GET');
// 留言
export const writeboard = params => ajax(`${publicAPI}/write/board`, params, 'POST');
// 获取笔记簿
export const queryNotebook = params => ajax(`${publicAPI}/notebook/${organize}`, params, 'GET');
// 获取笔记
export const queryNote = params => ajax(`${publicAPI}/page/notes/${organize}`, params, 'GET');
// 获取动态详情
export const queryNewsInfo = params => ajax(`${publicAPI}/news/${organize}/${params}`, {}, 'GET');
// 获取笔记详情
export const queryNotesInfo = params => ajax(`${publicAPI}/notes/${organize}/${params}`, {}, 'GET');

