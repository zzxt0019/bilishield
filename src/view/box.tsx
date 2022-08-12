import { Settings } from "@/config/setting/setting";
import { Button } from "antd/lib/radio";
import React from "react";
import { Page } from "../config/page/page";
import { readFiles } from "../test/read-system-file";
import { PageView } from "./page.view";
import { SettingView } from "./setting.view";
import { UidUsernameView } from "./special/uid-username.view";
export class Box extends React.Component {
    REFS: any = {
        // 绑定ref
        main: React.createRef<HTMLDivElement>()
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
        return <div className="_main" ref={this.REFS.main} style={{ display: 'none' }}>
            <div className="_box">
                <div>
                    {  // 页面
                        [...this.state.pageMap.values()].filter(page => page.isCurrent()).map(page =>
                            <PageView page={page} updateBox={() => {
                                // 更新当前页面, PageView里面有page对象, 所以可以放在里面(也可以放在外面)
                                this.forceUpdate()
                            }} />)}
                </div>
                <hr />
                <div>
                    <UidUsernameView updateBox={() => {
                        // 需要更改所有内容, 需要放在外面, SettingView里不需要page信息
                        for (const page of this.state.pageMap.values()) {
                            if (page.working) {
                                page.stop()
                                page.start()
                            }
                        }
                        this.forceUpdate()
                    }} />
                </div>
                <hr />
                <div>
                    {  // 配置
                        [...Settings.getSystemSettings().values()].map(setting => <SettingView
                            key={setting.key}
                            setting={setting}
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
                <div>
                    <Button onClick={() => {
                        this.REFS.main.current.style.setProperty('display', 'none')
                    }}>取消</Button>
                </div>
            </div>

        </div>
    }
    makeRef = (key: string) => {
        this.REFS[key] = React.createRef()
        return this.REFS[key]
    }
}