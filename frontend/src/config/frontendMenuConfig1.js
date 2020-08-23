// V1版本菜单
const frontendMenuListV1 = [
    {
        title: '网站首页',
        key: '/v1',
        hidden: false,
        requireAuth: true
    },
    // {
    //     title: '关于个人',
    //     key: '/pandora/me',
    //     hidden: false,
    //     requireAuth: true
    // },
    {
        title: '消息动态',
        key: '/v1/pandora/news',
        hidden: false,
        requireAuth: true
    },
    {
        title: '共享资源',
        key: '/v1/pandora/files',
        hidden: false,
        requireAuth: true
    },
    {
        title: '随笔记录',
        key: '/v1/pandora/note',
        hidden: false,
        requireAuth: true
    },
    {
        title: '计划安排',
        key: '/v1/pandora/plan',
        hidden: false,
        requireAuth: true
    },
    {
        title: '访问新版',
        key: '/',
        hidden: false,
        requireAuth: true
    },
]
export default frontendMenuListV1;
