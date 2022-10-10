/**
 * 进行local数据存储管理的工具模块
 */
import store from 'store'

const USER_KEY = 'user'
const ACCESS_KEY = 'access_token'
const PLAN_KEY = 'plan'
const LOG_KEY = 'log'
const ORGANIZE_KEY = 'organize'

export default {
    USER_KEY,ACCESS_KEY,PLAN_KEY,LOG_KEY,ORGANIZE_KEY,
    /**
     * 保存
     * @param user 用户信息
     */
    add(key,val) {
        store.set(key, val)
    },

    /**
     *  读取
     * @returns {*|{}} 用户信息
     */
    get(key) {
        return store.get(key)
    },

    /**
     * 删除
     */
    remove(key) {
        store.remove(key)
    },

    /**
     * 删除所有
     */
    removeAll(){
        store.remove(USER_KEY)
        store.remove(ACCESS_KEY)
        store.remove(PLAN_KEY)
        store.remove(LOG_KEY)
        store.remove(ORGANIZE_KEY)
    }

}
