// V1版本菜单
const frontendMenuListV2 = [
    {
        title: '网站首页',
        key: '/',
        hidden: false,
        requireAuth: true
    },
    {
        title: '消息动态',
        key: '/v2/pandora/news',
        hidden: false,
        requireAuth: true
    },
    {
        title: '共享资源',
        key: '/v2/pandora/files',
        hidden: false,
        requireAuth: true
    },
    {
        title: '技术专题',
        key: '/v2/pandora/note',
        hidden: false,
        requireAuth: true
    },
    {
        title: '计划安排',
        key: '/v2/pandora/plan',
        hidden: false,
        requireAuth: true
    },
    {
      title: '技术彩蛋',
      key: '/v2/pandora/egg',
      hidden: false,
      requireAuth: true
    },
    {
      title: '建设历程',
      key: '/v2/pandora/board',
      hidden: false,
      requireAuth: true
    },
    {
      title: '了解更多',
      key: '/v2/pandora/me',
      hidden: false,
      requireAuth: true
    },
    {
      title: '返回旧版',
      key: '/v1',
      hidden: false,
      requireAuth: true
    },
]
export default frontendMenuListV2;
