import { Page } from "@/config/page/page";
import { DisplayType } from "@/config/rule/do-rule";
import { Button, Card, Col, Row, Typography } from "antd";
import React from "react";

export class PageView extends React.Component {
    props = {
        page: {} as Page,
        updateBox: () => { }
    }
    /**
     * 点击启停按钮, 运行/停止此页规则
     */
    workClick = () => {
        // 切换工作状态
        if (this.props.page.working) {
            this.props.page.stop()
        } else {
            this.props.page.start()
        }
        // 刷新父组件
        this.props.updateBox()
    }
    /**
     * 点击debug按钮, 在工作状态下启用/停用debug模式
     */
    debugClick = () => {
        // 切换工作状态
        this.props.page.stop()
        let displayType: DisplayType = this.props.page.displayType === 'display' ? 'debug' : 'display'
        this.props.page.start(displayType)
        // 刷新父组件
        this.props.updateBox()
    }
    render() {
        return <Card>
            <Row>
                <Col span={6} >
                    <Typography.Paragraph
                        type={this.props.page.working ? 'success' : 'danger'}>
                        {this.props.page.name}
                    </Typography.Paragraph>
                </Col>
                <Col span={6} ></Col>
                <Col span={6} >
                    <Button
                        onClick={this.workClick}>
                        {this.props.page.working ? '停' : '启'}
                    </Button>
                </Col>
                <Col span={6} >
                    {this.props.page.working ?
                        <Button
                            onClick={this.debugClick}>
                            {this.props.page.displayType === 'display' ? 'debug' : '正常'}
                        </Button> : ''}
                </Col>
            </Row>
        </Card>
    }
}