import React from "react";
import {Col, DatePicker, Divider, Input, Row, TimePicker} from "antd";
import {CaretDownOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {date2dayjs, date2string} from "@/utils/datetime-util";

export function AdvanceSettingView() {
    const [hide, setHide] = React.useState(true);
    const [expireDate, setExpireDate] = React.useState<Date>(new Date(Date.now() + 24 * 60 * 60 * 1000));
    const [day, setDay] = React.useState<dayjs.Dayjs | null>(date2dayjs(expireDate));
    const [time, setTime] = React.useState<dayjs.Dayjs | null>(date2dayjs(expireDate));
    const [millisecond, setMillisecond] = React.useState<number>(0);
    const [type, setType] = React.useState<'date2time' | 'time2date' | undefined>('date2time');
    React.useEffect(() => {
        const interval = setInterval(() => {
            if (type === 'date2time') {
                setMillisecond(expireDate.getTime() - new Date().getTime());
            }
            if (type === 'time2date') {
                setDay(date2dayjs(new Date(Date.now() + millisecond), 'YYYY-MM-DD'));
                setTime(date2dayjs(new Date(Date.now() + millisecond), 'HH:mm:ss'));
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, [type])
    return <>
        {/*{'' + date2string(expireDate)}*/}
        {/*<br/>*/}
        {/*{'' + millisecond}*/}
        {/*<br/>*/}
        {/*{'' + type}*/}
        {/*<br/>*/}
        {!hide && <>
            <Row>
                <Col span={12}>
                    <DatePicker value={day} style={{width: '100%'}}
                                getPopupContainer={target => target}
                                onFocus={() => {
                                    setType(undefined);
                                }}
                                onBlur={() => {
                                    setType('date2time');
                                }}
                                onChange={(day) => {
                                    setType('date2time');
                                    setDay(day);
                                    if (day) {
                                        let date = expireDate ?? day.toDate();
                                        date.setFullYear(day.year());
                                        date.setDate(day.date());
                                        date.setMonth(day.month());
                                        setExpireDate(date);
                                    }
                                }}></DatePicker>
                </Col>
                <Col span={12}>
                    <TimePicker value={time} style={{width: '100%'}}
                                getPopupContainer={target => target}
                                onFocus={() => {
                                    setType(undefined);
                                }}
                                onBlur={() => {
                                    setType('date2time');
                                }}
                                onChange={(time) => {
                                    setType('date2time');
                                    setTime(time);
                                    if (time) {
                                        let date = expireDate ?? time.toDate();
                                        date.setHours(time.hour());
                                        date.setMinutes(time.minute());
                                        date.setSeconds(time.second());
                                        console.log(date)
                                        setExpireDate(date);
                                    }
                                }}></TimePicker>
                </Col>
            </Row>
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
                               value={item.fun(millisecond)}
                               onFocus={() => {
                                   setType(undefined);
                               }}
                               onBlur={() => {
                                   setType('time2date');
                               }}
                               onChange={(e) => {
                                   let value = e.target.value;
                                   setType('time2date');
                                   let addMillisecond = 0;
                                   if (value === '') {
                                       // 清空, 清空所有
                                       addMillisecond = -item.fun(millisecond) * item.rate;
                                   } else if (/^[0-9]*$/.test(value)) {
                                       addMillisecond = ((item.max ? Math.min(Number(value), item.max) : Number(value)) - item.fun(millisecond)) * item.rate;
                                   } else if (value === '0') {  // 0
                                       addMillisecond = -item.fun(millisecond) * item.rate;
                                   } else {// 不是非负整数 => 不改变(变为上一次的值)

                                   }
                                   setMillisecond(millisecond => millisecond + addMillisecond);
                                   setExpireDate(expireDate => new Date(expireDate.getTime() + addMillisecond));
                               }}></Input>
                    </Col>)}
            </Row>
        </>}
        <Divider>
            <CaretDownOutlined rotate={hide ? 0 : 180} onClick={() => setHide(hide => !hide)} color={'pink'}/>
        </Divider>
    </>;
}