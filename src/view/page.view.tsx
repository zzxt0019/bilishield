import { Page } from "@/config/page/page";
import React from "react";

export class PageView extends React.Component {
    props = {
        page: {} as Page,
        updateBox: () => { }
    }
    render() {
        return <div>
            <span>{this.props.page.name}</span>
            <span>{' ' + this.props.page.working}</span>
            <button onClick={()=>{
                // 切换工作状态
                if(this.props.page.working){
                    this.props.page.stop()
                } else {
                    this.props.page.start()
                }
                // 刷新父组件
                this.props.updateBox()
            }} 
            // 如果当前href不匹配 不可以换
            disabled={!this.props.page.isCurrent()}>换</button>
        </div>
    }
}