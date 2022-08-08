import { Setting } from "@/config/setting";
import React from "react";

export class SettingView extends React.Component {
    props = {
        setting: {} as Setting,
        updateBox: () => { }
    }
    REFS = {
        input: React.createRef<HTMLInputElement>()
    }
    render() {
        return <div>
            <div>{this.props.setting.key + ':' + this.props.setting.name}</div>
            <div>{  // 展示
                ' ' + this.props.setting.data.join(',')}</div>
            <input ref={this.REFS.input}></input>
            <button onClick={() => {
                // 添加 保存到GM
                if (this.REFS.input.current) {
                    this.props.setting.data.push(this.REFS.input.current.value)
                }
                GM_setValue('settings.' + this.props.setting.key, this.props.setting)
                this.props.updateBox()
            }}>添加</button>
            <button onClick={() => {
                // 删除 保存到GM
                this.props.setting.data = this.props.setting.data.filter(item => item !== this.REFS.input.current?.value)
                GM_setValue('settings.' + this.props.setting.key, this.props.setting)
                this.props.updateBox()
            }}>删除</button>
        </div>
    }
}