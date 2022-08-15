import {Settings} from "@/config/setting/setting";
import {Button, Card, Col, Layout, Row, Tabs} from "antd";
import React from "react";
import {Page} from "../config/page/page";
import {readFiles} from "../test/read-system-file";
import {PageView} from "./page.view";
import {SettingView} from "./setting.view";
import {UidUsernameView} from "./special/uid-username.view";
import {DisplayType} from "@/view/display-type";

export class Box extends React.Component {
    REFS: any = {
        // 绑定ref
        main: React.createRef<HTMLDivElement>()
    }
    state = {
        pageMap: new Map<string, Page>()
    }
    props = {
        mainClass: '_main',
        boxClass: '_box',
    }

    componentDidMount(): void {
        // 读取基础配置
        this.setState({pageMap: readFiles()})
    }

    componentWillUnmount(): void {
        for (const page of this.state.pageMap.values()) {
            if (page.working) {
                page.stop()
            }
        }
    }

    render() {
        return <div className={this.props.mainClass} ref={this.REFS.main} style={{display: 'none'}}>
            <div className={this.props.boxClass}>
                <Layout>
                    <Layout.Content>
                        {  // 页面
                            [...this.state.pageMap.values()].filter(page => page.isCurrent()).map(page =>
                                <PageView page={page} updateBox={() => {
                                    // 更新当前页面, PageView里面有page对象, 所以可以放在里面(也可以放在外面)
                                    this.forceUpdate()
                                }}/>)}
                    </Layout.Content>
                    <Layout.Sider>
                        <DisplayType></DisplayType>
                    </Layout.Sider>
                </Layout>
                <hr/>
                <Tabs>
                    <Tabs.TabPane key="uid2username-tab" tab={<span>uid</span>}>
                        <UidUsernameView updateBox={() => {
                            // 需要更改所有内容, 需要放在外面, SettingView里不需要page信息
                            for (const page of this.state.pageMap.values()) {
                                if (page.working) {
                                    page.stop()
                                    page.start()
                                }
                            }
                            this.forceUpdate()
                        }}/>
                    </Tabs.TabPane>
                    {  // 配置
                        [...Settings.getSystemSettings().values()].map(setting =>
                            <Tabs.TabPane key={setting.key + '-tab'} tab={<span>{setting.name}</span>}>
                                <SettingView
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
                                    }}/>
                            </Tabs.TabPane>)}
                </Tabs>
                <hr/>
                <Card>
                    <Row>
                        <Col span={8}></Col>
                        <Col span={8}></Col>
                        <Col span={8}>
                            <Button size="small"
                                    onClick={() => {
                                        this.REFS.main.current.style.setProperty('display', 'none')
                                    }}>隐藏菜单</Button>
                        </Col>
                    </Row>
                </Card>
            </div>

        </div>
    }

    makeRef = (key: string) => {
        this.REFS[key] = React.createRef()
        return this.REFS[key]
    }
}