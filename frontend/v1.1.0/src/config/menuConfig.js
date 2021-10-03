// V1版本菜单
const frontendMenuListV1 = [
    {
        title: '网站首页',
        key: '/',
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
        key: '/pandora/news',
        hidden: false,
        requireAuth: true
    },
    {
        title: '共享资源',
        key: '/pandora/files',
        hidden: false,
        requireAuth: true
    },
    {
        title: '技术专题',
        key: '/pandora/note',
        hidden: false,
        requireAuth: true
    },
    {
        title: '计划安排',
        key: '/pandora/plan',
        hidden: false,
        requireAuth: true
    },
    {
        title: '访问新版',
        key: 'https://saya.ac.cn',
        hidden: false,
        requireAuth: true
    },
];
export default frontendMenuListV1;
