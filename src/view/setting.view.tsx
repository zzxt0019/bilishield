import { Setting, Settings } from "@/config/setting";
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
        console.log('this.props.setting', this.props.setting)
        console.log(Settings.getSettingValue(this.props.setting));

        return <div>
            <div>{this.props.setting.key + ':' + this.props.setting.name}</div>
            <div>{  // 展示
                ' ' + Settings.getSettingValue(this.props.setting).join(',')}</div>
            <input ref={this.REFS.input}></input>
            <button onClick={() => {
                // 添加 保存到GM
                if (this.REFS.input.current) {
                    Settings.addSettingValue(this.props.setting, this.REFS.input.current.value)
                }
                this.props.updateBox()
            }}>添加</button>
            <button onClick={() => {
                // 删除 保存到GM
                if (this.REFS.input.current) {
                    Settings.delSettingValue(this.props.setting, this.REFS.input.current.value)
                }
                this.props.updateBox()
            }}>删除</button>
        </div>
    }
}