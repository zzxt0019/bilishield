import React from "react";
import {Col, DatePicker, Divider, Input, Row, TimePicker} from "antd";
import {CaretDownOutlined} from "@ant-design/icons";
import 'dayjs/locale/zh-cn';
import {date2dayjs} from "@/utils/datetime-util";

export function AdvanceSettingView() {
    const [hide, setHide] = React.useState(true);
    const [expire, setExpire] = React.useState({
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        millisecond: 24 * 60 * 60 * 1000,
    });
    const [type, setType] = React.useState<'date2time' | 'time2date' | undefined>('date2time');
    const [, refresh] = React.useState(false);
    const list = (from: number, to: number) => {
        let arr = []
        for (let i = from; i <= to; i++) {
            arr.push(i);
        }
        return arr;
    };
    React.useEffect(() => {
        const interval = setInterval(() => {
            console.log(expire.date, expire.millisecond);
            if (type === 'date2time') {
                if (expire.date.getTime() < Date.now()) {  // 倒计时进入负值, 切换并置零
                    setType('time2date');
                    setExpire(expire => {
                        expire.date = new Date();
                        expire.millisecond = 0;
                        return expire;
                    });
                } else {
                    setExpire(expire => {
                        expire.millisecond = expire.date.getTime() - Date.now();
                        return expire;
                    });
                }
                refresh(fresh => !fresh);
            }
            if (type === 'time2date') {
                setExpire(expire => {
                    expire.date = new Date(Date.now() + expire.millisecond);
                    return expire;
                });
                refresh(fresh => !fresh);
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, [type])
    return <>
        {!hide && <>
            {/*过期时间*/}
            <Row>
                <Col span={12}>
                    <DatePicker value={date2dayjs(expire.date, 'YYYY-MM-DD')} style={{width: '100%'}}
                                getPopupContainer={target => target}
                                disabledDate={(day) => {
                                    const date = new Date();
                                    if (date.getTime() % (24 * 60 * 60 * 1000) < expire.date.getTime() % (24 * 60 * 60 * 1000)) {
                                        return day.year() < date.getFullYear()
                                            || (day.year() === date.getFullYear() && day.month() < date.getMonth())
                                            || (day.year() === date.getFullYear() && day.month() === date.getMonth() && day.date() < date.getDate());
                                    } else {
                                        return day.year() < date.getFullYear()
                                            || (day.year() === date.getFullYear() && day.month() < date.getMonth())
                                            || (day.year() === date.getFullYear() && day.month() === date.getMonth() && day.date() <= date.getDate());
                                    }
                                }}
                                onFocus={() => {
                                    setType(undefined);
                                }}
                                onBlur={() => {
                                    setType('date2time');
                                    setExpire(expire => {
                                        expire.millisecond = expire.date.getTime() - Date.now();
                                        return expire;
                                    });
                                }}
                                onChange={(day) => {
                                    setType('date2time');
                                    if (day) {
                                        setExpire(expire => {
                                            expire.date.setFullYear(day.year());
                                            expire.date.setDate(day.date());
                                            expire.date.setMonth(day.month());
                                            expire.millisecond = expire.date.getTime() - Date.now();
                                            return expire;
                                        });
                                    }
                                }}></DatePicker>
                </Col>
                <Col span={12}>
                    <TimePicker value={date2dayjs(expire.date, 'HH:mm:ss')} style={{width: '100%'}}
                                getPopupContainer={target => target}
                                disabledTime={() => {
                                    const date = new Date();
                                    if (expire.date.getFullYear() === date.getFullYear() && expire.date.getMonth() == date.getMonth() && expire.date.getDate() === date.getDate()) {
                                        return {
                                            disabledHours: () => date.getHours() ? list(0, date.getHours() - 1) : [],
                                            disabledMinutes: (selectedHour) => selectedHour === date.getHours() && date.getMinutes() ? list(0, date.getMinutes() - 1) : [],
                                            disabledSeconds: (selectedHour, selectedMinute) => selectedHour === date.getHours() && selectedMinute === date.getMinutes() && date.getSeconds() ? list(0, date.getSeconds()) : [],
                                        }
                                    } else {
                                        return {
                                            disabledHours: () => [],
                                            disabledMinutes: () => [],
                                            disabledSeconds: () => []
                                        }
                                    }
                                }}
                                onFocus={() => {
                                    setType(undefined);
                                }}
                                onBlur={() => {
                                    setType('date2time');
                                    setExpire(expire => {
                                        expire.millisecond = expire.date.getTime() - Date.now();
                                        return expire;
                                    });
                                }}
                                onChange={(time) => {
                                    setType('date2time');
                                    if (time) {
                                        setExpire(expire => {
                                            expire.date.setHours(time.hour());
                                            expire.date.setMinutes(time.minute());
                                            expire.date.setSeconds(time.second());
                                            expire.millisecond = expire.date.getTime() - Date.now();
                                            return expire;
                                        });
                                    }
                                }}></TimePicker>
                </Col>
            </Row>
            {/*距离现在时间(毫秒)*/}
            <Row>
                {[{
                    addonAfter: '日',
                    rate: 24 * 60 * 60 * 1000,
                    max: undefined,
                    fun: (millisecond: number) => Math.floor(millisecond / (24 * 60 * 60 * 1000)),
                }, {
                    addonAfter: '时',
                    rate: 60 * 60 * 1000,
                    max: 24,
                    fun: (millisecond: number) => new Date(millisecond).getUTCHours(),
                }, {
                    addonAfter: '分',
                    rate: 60 * 1000,
                    max: 60,
                    fun: (millisecond: number) => new Date(millisecond).getUTCMinutes(),
                }, {
                    addonAfter: '秒',
                    rate: 1000,
                    max: 60,
                    fun: (millisecond: number) => new Date(millisecond).getUTCSeconds(),
                }].map(item =>
                    <Col span={6}>
                        <Input addonAfter={item.addonAfter}
                               value={item.fun(expire.millisecond)}
                               onFocus={() => {
                                   setType(undefined);
                               }}
                               onBlur={() => {
                                   setType('time2date');
                                   setExpire(expire => {
                                       expire.date = new Date(Date.now() + expire.millisecond);
                                       return expire;
                                   });
                               }}
                               onChange={(e) => {
                                   let value = e.target.value;
                                   setType('time2date');
                                   let addMillisecond = 0;
                                   if (value === '') {
                                       // 清空, 清空所有
                                       addMillisecond = -item.fun(expire.millisecond) * item.rate;
                                   } else if (/^[0-9]*$/.test(value)) {
                                       addMillisecond = ((item.max ? Math.min(Number(value), item.max) : Number(value)) - item.fun(expire.millisecond)) * item.rate;
                                   } else if (value === '0') {  // 0
                                       addMillisecond = -item.fun(expire.millisecond) * item.rate;
                                   } else {// 不是非负整数 => 不改变(变为上一次的值)

                                   }
                                   setExpire(expire => {
                                       expire.millisecond += addMillisecond;
                                       expire.date = new Date(Date.now() + expire.millisecond);
                                       return expire;
                                   });
                               }}></Input>
                    </Col>)}
            </Row>
        </>}
        <Divider>
            <CaretDownOutlined rotate={hide ? 0 : 180} onClick={() => setHide(hide => !hide)} color={'pink'}/>
        </Divider>
    </>;
}