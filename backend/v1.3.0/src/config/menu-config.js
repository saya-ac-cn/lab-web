/**
 * 后台菜单路由配置清单
 * 注意：仅支持 " 二 "级菜单
 * @type {*[]}
 * 重要说明！！！
 * 页面路由绝对禁止出现/backend1、/frontend、/files（远景包括map）
 * 在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
 */

const MenuList = [
    {
        title: '主页',// 菜单标题名称
        key: '/backstage/chart',// 对应的path
        icon: 'HomeOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        root:true, // 是否为根节点（当根节点下无子节点时，需要设置本位）
        children: null
    },
    {
        title: '我',// 菜单标题名称
        key: '/backstage/me',// 对应的path
        icon: 'UserOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        root:false, // 是否为根节点
        children: [ // 子菜单列表
            {
                title: '个人信息',
                key: '/backstage/me/info',
                hidden: false,
                requireAuth: true
            },
            {
                title: '操作日志',
                key: '/backstage/me/logs',
                hidden: false,
                requireAuth: true
            }
        ]
    },
    {
        title: '记账本',// 菜单标题名称
        key: '/backstage/financial',// 对应的path
        icon: 'AccountBookOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        root:false, // 是否为根节点
        children: [ // 子菜单列表
            {
                title: '收入支出',
                key: '/backstage/financial/journal',
                hidden: false,
                requireAuth: true
            },
            {
                title: '日度报表',
                key: '/backstage/financial/day',
                hidden: false,
                requireAuth: true
            }
        ]
    },
    {
        title: '随心记',// 菜单标题名称
        key: '/backstage/memory',// 对应的path
        icon: 'ScheduleOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        root:false, // 是否为根节点
        children: [ // 子菜单列表
            {
                title: '动态',
                key: '/backstage/memory/news',
                hidden: false,
                requireAuth: true
            },
            {
                title: '笔记',
                key: '/backstage/memory/note',
                hidden: false,
                requireAuth: true
            },
            {
                title: '便利贴',
                key: '/backstage/memory/memo',
                hidden: false,
                requireAuth: true
            },
        ],
    },
    {
        title: '提醒事项',// 菜单标题名称
        key: '/backstage/plan',// 对应的path
        icon: 'FlagOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        root:false, // 是否为根节点
        children: [ // 子菜单列表
            {
                title: '进行中的',
                key: '/backstage/plan/activity',
                hidden: false,
                requireAuth: true
            },
            {
                title: '所有提醒',
                key: '/backstage/plan/archive',
                hidden: false,
                requireAuth: true
            }
        ],
    },
    {
        title: '数据存储',// 菜单标题名称
        key: '/backstage/oss',// 对应的path
        icon: 'DatabaseOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        root:false, // 是否为根节点
        children: [ // 子菜单列表
            {
                title: '图片壁纸',
                key: '/backstage/oss/wallpaper',
                hidden: false,
                requireAuth: true
            },
            {
                title: '文章插图',
                key: '/backstage/oss/illustration',
                hidden: false,
                requireAuth: true
            },
            {
                title: '文档资料',
                key: '/backstage/oss/files',
                hidden: false,
                requireAuth: true
            },
            {
                title: '数据备份',
                key: '/backstage/oss/db',
                hidden: false,
                requireAuth: true
            }
        ]
    }
];
export default MenuList
