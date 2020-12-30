/**
 * 后台菜单路由配置清单
 * 注意：仅支持 " 二 "级菜单
 * @type {*[]}
 * 重要说明！！！
 * 页面路由绝对禁止出现/backend1、/frontend、/files（远景包括map）
 * 在定义接口代理时，上述的路由单词已经被定义，如果使用，刷新页面将出现404，
 */

const backstageMenuList = [
    {
        title: '控制面板',// 菜单标题名称
        key: '/backstage/api',// 对应的path
        icon: 'HomeOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '远程控制',
                key: '/backstage/api/mana',
                hidden: false,
                requireAuth: true
            }
        ]
    },
    {
        title: '设备管理',// 菜单标题名称
        key: '/backstage/device',// 对应的path
        icon: 'ToolOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '网关管理',
                key: '/backstage/device/gateway',
                hidden: false,
                requireAuth: true
            },
            {
                title: '设备管理',
                key: '/backstage/device/client',
                hidden: false,
                requireAuth: true
            }
        ]
    },
    {
        title: '告警预约',// 菜单标题名称
        key: '/backstage/message',// 对应的path
        icon: 'HistoryOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '预约管理',
                key: '/backstage/device/appointment',
                hidden: false,
                requireAuth: true
            },
            {
                title: '告警管理',
                key: '/backstage/message/news',
                hidden: false,
                requireAuth: true
            },
            {
                title: '告警记录',
                key: '/backstage/message/news1',
                hidden: false,
                requireAuth: true
            }
        ]
    },
    {
        title: '收发历史',// 菜单标题名称
        key: '/backstage/financial',// 对应的path
        icon: 'FundProjectionScreenOutlined',// 图标名称
        hidden: false, //是否隐藏
        requireAuth: true, // 是否需要登录后访问
        children: [ // 子菜单列表
            {
                title: '下发历史',
                key: '/backstage/financial/transaction',
                hidden: false,
                requireAuth: true
            },
            {
                title: '历史接收',
                key: '/backstage/financial/financialForDay',
                hidden: false,
                requireAuth: true
            }
        ]
    }
]
export default backstageMenuList