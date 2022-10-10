import ajax from './ajax'
/**
 * 重要说明！！！
 * 因为，后台已对「/backend，/frontend，/files」接口代理,页面路由绝对禁止出现/backend、/frontend、/files（远景包括map）
 * 在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
 * @type {string}
 */

// 后台api接口
let backendAPI = '/backend';

// 登录接口
export const loginApi = params => ajax(`${backendAPI}/login`, params, 'POST');
// 令牌刷新
export const refreshTokenApi = `${backendAPI}/system/token/refresh`;

// 获取自己所在组织下的用户
export const ownOrganizeUserApi = () => ajax(`${backendAPI}/system/user/own/organize`, {}, 'GET');


// 查看数据库备份执行列表
export const dbDumpPageApi = params => ajax(`${backendAPI}/system/db/log/page`, params, 'GET');

// 注销接口
export const requestLogout = params => ajax(`${backendAPI}/logout`, params, 'POST');


// 获取日志接口
export const logPageApi = params => ajax(`${backendAPI}/system/log/page`, params, 'GET');
// 获取日志类别接口
export const logTypeListApi = () => ajax(`${backendAPI}/system/log/type`, {}, 'GET');
// 导出日志
export const downloadLogExcelApi = `${backendAPI}/system/log/excel`;


// 上传头像
export const uploadLogoApi = params => ajax(`${backendAPI}/system/user/logo`, params, 'POST');
// 获取个人信息
export const getPersonal = params => ajax(`${backendAPI}/system/user`, params, 'GET');
// 修改密码
export const editPwdApi = params => ajax(`${backendAPI}/system/user/password`, params, 'PUT');
// 修改用户信息
export const editUserInfoApi = params => ajax(`${backendAPI}/system/user`, params, 'PUT');

// 上传Base64图片
export const uploadBase64PictureApi = `${backendAPI}/oss/picture/base64`;


// 获取动态
export const newsPageApi = params => ajax(`${backendAPI}/content/news`, params, 'GET');
// 发布动态
export const createNewsApi = params => ajax(`${backendAPI}/content/news`, params, 'POST');
// 删除动态
export const deleteNewsApi = params => ajax(`${backendAPI}/content/news/${params}`, {}, 'DELETE');
// 查询动态
export const newsInfoApi = params => ajax(`${backendAPI}/content/news/${params}`, {}, 'GET');
// 修改动态
export const editNewsApi = params => ajax(`${backendAPI}/content/news`, params, 'PUT');


// 查看分页后的图片
export const picturePageApi = params => ajax(`${backendAPI}/oss/picture/page`, params, 'GET');
// 上传壁纸
export const uploadWallpaperApi = `${backendAPI}/oss/picture/file`;
// 删除壁纸/插图
export const deletePictureApi = params => ajax(`${backendAPI}/oss/picture/${params}`, {}, 'DELETE');


// 上传文件
export const uploadFileApi = `${backendAPI}/oss/files/file`;
// 查看分页后的文件
export const filePageApi = params => ajax(`${backendAPI}/oss/files/page`, params, 'GET');
// 删除文件
export const deleteFileApi = params => ajax(`${backendAPI}/oss/files`, params, 'DELETE');
// 修改文件
export const editFileApi = params => ajax(`${backendAPI}/oss/files/file`, params, 'PUT');
// 下载文件
export const downloadFileApi = `${backendAPI}/oss/files/download/ `;



// 创建笔记簿
export const createNoteBookApi = params => ajax(`${backendAPI}/content/notebook`, params, 'POST');
// 修改笔记簿
export const updateNoteBookApi = params => ajax(`${backendAPI}/content/notebook`, params, 'PUT');
// 删除笔记簿
export const deleteNoteBookApi = params => ajax(`${backendAPI}/content/notebook/${params}`, {}, 'DELETE');
// 获取笔记簿
export const noteBookListApi = params => ajax(`${backendAPI}/content/notebook`, params, 'GET');

// 创建笔记
export const createNoteApi = params => ajax(`${backendAPI}/content/notes`, params, 'POST');
// 修改笔记
export const updateNoteApi = params => ajax(`${backendAPI}/content/notes`, params, 'PUT');
// 删除笔记
export const deleteNoteApi = params => ajax(`${backendAPI}/content/notes/${params}`, {}, 'DELETE');
// 获取笔记
export const notePageApi = params => ajax(`${backendAPI}/content/notes`, params, 'GET');
// 查询笔记详情
export const noteInfoApi = params => ajax(`${backendAPI}/content/notes/${params}`, {}, 'GET');


// 获取该月计划
export const getPlanList = params => ajax(`${backendAPI}/api/set/plan`, params, 'GET');
// 添加计划
export const createPlan = params => ajax(`${backendAPI}/api/set/plan/create`, params, 'POST');
// 修改计划
export const updatePlan = params => ajax(`${backendAPI}/api/set/plan/edit`, params, 'PUT');
// 删除计划
export const deletePlan = params => ajax(`${backendAPI}/api/set/plan/delete`, params, 'DELETE');


// 查询货币列表
export const monetaryListApi = () => ajax(`${backendAPI}/financial/dictionary/monetary`, {}, 'GET');
// 获取所有的支付类别
export const paymentMeansListApi = params => ajax(`${backendAPI}/financial/dictionary/payment/means`, params, 'GET');
// 获取所有的交易摘要
export const abstractsApi = params => ajax(`${backendAPI}/financial/dictionary/abstracts`, params, 'GET');
// 获取财政流水
export const getTransactionList = params => ajax(`${backendAPI}/financial/journal`, params, 'GET');
// 流水列表
export const generalJournalListApi = params => ajax(`${backendAPI}/financial/general/journal`, params, 'GET');
// 财政申报
export const addJournalApi = params => ajax(`${backendAPI}/financial/journal`, params, 'POST');
// 修改流水
export const updateJournalApi = params => ajax(`${backendAPI}/financial/journal`, params, 'PUT');
// 删除流水
export const deleteJournalApi = params => ajax(`${backendAPI}/financial/journal/${params}`, {}, 'DELETE');
// 导出流水
export const JournalExcelApi = `${backendAPI}/financial/journal/excel`;
// 导出流水明细
export const generalJournalExcelApi = `${backendAPI}/financial/general/journal/excel`;
// 添加流水明细
export const addGeneralJournalApi = params => ajax(`${backendAPI}/financial/general/journal`, params, 'POST');
// 修改流水明细
export const updateGeneralJournalApi = params => ajax(`${backendAPI}/financial/general/journal`, params, 'PUT');
// 删除流水明细
export const deleteGeneralJournalApi = params => ajax(`${backendAPI}/financial/general/journal/${params}`, {}, 'DELETE');
// 按天统计流水
export const totalJournalForDayApi = params => ajax(`${backendAPI}/financial/journal/day`, params, 'GET');
// 导出按天统计的报表
export const journalForDayExcelApi = `${backendAPI}/financial/journal/collect/excel`;




// 获取数据总量及词云数据
export const getCountAndWordCloud = () => ajax(`${backendAPI}/api/set/countAndWordCloud`, {}, 'GET');
// 查询活跃度
export const getActivityRate= params => ajax(`${backendAPI}/api/set/activityRate/${params}`, {}, 'GET');
// 统计动态发布
export const getNewsRate = params => ajax(`${backendAPI}/api/message/newsRate/${params}`, {}, 'GET');
// 收支增长率
export const getAccountGrowthRate = params => ajax(`${backendAPI}/api/financial/accountGrowthRate/${params}`, {}, 'GET');
// 收入比重
export const getIncomePercentage = params => ajax(`${backendAPI}/api/financial/incomePercentage/${params}`, {}, 'GET');
// 统计指定月份中各摘要的排名
export const getOrderByAmount = params => ajax(`${backendAPI}/api/financial/orderByAmount/${params}`, {}, 'GET');
// 统计指定指定日期月份前6个月的账单
export const getPreSixMonthBill = params => ajax(`${backendAPI}/api/financial/preSixMonthBill/${params}`, {}, 'GET');

// 查询单条便笺
export const memoInfoApi = params => ajax(`${backendAPI}/content/memo/${params}`, {}, 'GET');
// 获取分页便笺
export const memoPageApi = params => ajax(`${backendAPI}/content/memo`, params, 'GET');
// 添加便笺
export const createMemoApi = params => ajax(`${backendAPI}/content/memo`, params, 'POST');
// 修改便笺
export const updateMemoApi = params => ajax(`${backendAPI}/content/memo`, params, 'PUT');
// 删除便笺
export const deleteMemoApi = params => ajax(`${backendAPI}/content/memo/${params}`, {}, 'DELETE');
