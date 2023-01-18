import dayjs from 'dayjs';

function date2properties(date: Date) {
    return {
        year: String(date.getFullYear()),
        month: (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1),
        day: (date.getDate() < 10 ? '0' : '') + date.getDate(),
        hour: (date.getHours() < 10 ? '0' : '') + date.getHours(),
        minute: (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
        second: (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(),
        millisecond: (date.getMilliseconds() < 100 ? '0' : '') + (date.getMilliseconds() < 10 ? '0' : '') + date.getMilliseconds(),
    }
}

export function date2string(date: Date, formatter: string = 'yyyy-MM-dd HH:mm:ss.SSS') {
    const {year, month, day, hour, minute, second, millisecond} = date2properties(date);
    return formatter
        .replaceAll('yyyy', year)
        .replaceAll('MM', month)
        .replaceAll('dd', day)
        .replaceAll('HH', hour)
        .replaceAll('mm', minute)
        .replaceAll('ss', second)
        .replaceAll('SSS', millisecond);
}

export function date2dayjs(date: Date, formatter: string = 'YYYY-MM-DD HH:mm:ss.SSS') {
    const {year, month, day, hour, minute, second, millisecond} = date2properties(date);
    return dayjs(formatter
        .replaceAll('YYYY', year)
        .replaceAll('MM', month)
        .replaceAll('DD', day)
        .replaceAll('HH', hour)
        .replaceAll('mm', minute)
        .replaceAll('ss', second)
        .replaceAll('SSS', millisecond), formatter);
}