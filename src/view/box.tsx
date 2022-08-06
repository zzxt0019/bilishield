import React from "react";
import { Page } from "../config/page";
import { readFiles } from "../test/read-system-file";
export class Box extends React.Component {
    REFS: any = {
        // 绑定ref
    }
    state = {
        pageMap: new Map<string, Page>()
    }
    componentWillMount(): void {
        // 读取基础配置
        this.state.pageMap = readFiles()
    }
    componentWillUnmount(): void {
        for (const page of this.state.pageMap.values()) {
            if (page.working) {
                page.stop()
            }
        }
    }
    urlClick = (event: any) => {
        this.state.pageMap.forEach(v => {
            if (v.working) {
                v.stop()
            } else {
                v.start()
            }
        })
        this.setState({ resMap: this.state.pageMap })
        this.forceUpdate()
    }
    render() {
        let arr: [string, Page][] = []
        this.state.pageMap.forEach((v, k) => {
            arr.push([k, v])
        })
        let show = arr.map((item) =>
            <div key={item[0]} ref={this.makeRef(item[1].key)}>
                <div>{item[0]}</div>
                <div>{String(item[1].working)}</div>
                <button onClick={this.urlClick}>换</button>
            </div>)
        return <div className="_main">
            <div className="_box">
                {show}
            </div>
        </div>
    }
    makeRef = (key: string) => {
        this.REFS[key] = React.createRef()
        return this.REFS[key]
    }
}