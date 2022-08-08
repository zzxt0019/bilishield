import React from "react";
import { Page } from "../config/page";
import { readFiles } from "../test/read-system-file";
import { PageView } from "./page.view";
import { SettingView } from "./setting.view";
export class Box extends React.Component {
    REFS: any = {
        // 绑定ref
    }
    state = {
        pageMap: new Map<string, Page>()
    }
    componentDidMount(): void {
        // 读取基础配置
        this.setState({ pageMap: readFiles() })
    }
    componentWillUnmount(): void {
        for (const page of this.state.pageMap.values()) {
            if (page.working) {
                page.stop()
            }
        }
    }
    render() {
        return <div className="_main">
            <div className="_box">
                <div>
                    {  // 页面
                    [...this.state.pageMap.values()].map(page => 
                    <PageView page={page} updateBox={()=>{
                        // 更新当前页面, PageView里面有page对象, 所以可以放在里面(也可以放在外面)
                        this.forceUpdate()
                    }} />)}
                </div>
                <div>
                    {  // 配置
                    GM_getValue('settings', []).map(settingKey => <SettingView setting={GM_getValue('settings.'+settingKey, { key: settingKey, name: settingKey, data: [] })}
                        updateBox={() => {
                            // 需要更改所有内容, 需要放在外面, SettingView里不需要page信息
                            for (const page of this.state.pageMap.values()) {
                                if (page.working) {
                                    page.stop()
                                    page.start()
                                }
                            }
                            this.forceUpdate()
                        }} />)}
                </div>
            </div>
        </div>
    }
    makeRef = (key: string) => {
        this.REFS[key] = React.createRef()
        return this.REFS[key]
    }
}