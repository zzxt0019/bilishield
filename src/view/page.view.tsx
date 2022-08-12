import { Page } from "@/config/page/page";
import { DisplayType } from "@/config/rule/do-rule";
import { Button } from "antd";
import { SpaceContext } from "antd/lib/space";
import React from "react";

export class PageView extends React.Component {
    props = {
        page: {} as Page,
        updateBox: () => { }
    }
    render() {
        return <div>
            <span>{this.props.page.name}</span>
            <Button onClick={() => {
                // 切换工作状态
                if (this.props.page.working) {
                    this.props.page.stop()
                } else {
                    this.props.page.start()
                }
                // 刷新父组件
                this.props.updateBox()
            }}>{this.props.page.working ? '停' : '启'}</Button>
            {this.props.page.working ? <Button onClick={() => {
                // 切换工作状态
                this.props.page.stop()
                let displayType: DisplayType = this.props.page.displayType === 'display' ? 'debug' : 'display'
                this.props.page.start(displayType)
                // 刷新父组件
                this.props.updateBox()
            }}>{this.props.page.displayType === 'display' ? 'debug' : '正常'}</Button> : ''}
        </div>
    }
}