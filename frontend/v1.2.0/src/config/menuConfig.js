// V1版本菜单
const frontendMenuListV2 = [
  {
    title: '网站首页',
    key: '/',
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
    title: '共享资源',
    key: '/pandora/files',
    hidden: false,
    requireAuth: true
  },

  {
    title: '技术彩蛋',
    key: '/pandora/egg',
    hidden: false,
    requireAuth: true
  },
  {
    title: '消息动态',
    key: '/pandora/news',
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
    title: '建设历程',
    key: '/pandora/growing',
    hidden: false,
    requireAuth: true
  },
  {
    title: '了解更多',
    key: '/pandora/me',
    hidden: false,
    requireAuth: true
  },
  {
    title: '返回旧版',
    key: 'http://v1.saya.ac.cn',
    hidden: false,
    requireAuth: true
  },
]
export default frontendMenuListV2;
