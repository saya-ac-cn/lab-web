import dayjs from 'dayjs';

export const formatDate_zh_CN = (date:string) => {
    if (!date){
        return '-'
    }
    return dayjs(date).format('YYYY年MM月DD日')
}

export const formatDateTime_zh_CN = (date: string, type: number) => {
    if (!date){
        return '-'
    }
    return type === 1?dayjs(date).format('YYYY年MM月DD日 HH时mm分ss秒'):dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    // YYYY年MM月DD日 HH:mm:ss
    // YYYY年MM月DD日 HH时mm分ss秒
}