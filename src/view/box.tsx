import {Settings} from "@/config/setting/setting";
import {Button, Card, Col, Layout, Row, Tabs} from "antd";
import React, {useEffect, useRef} from "react";
import {Page} from "@/config/page/page";
import {PageView} from "./page.view";
import {SettingView} from "./setting.view";
import {UidUsernameView} from "./special/uid-username.view";
import {DisplayType} from "@/view/display-type";

export function Box(props: {
    mainClass: string,
    boxClass: string,
    pageMap: Map<string, Page>
}) {
    const {mainClass, boxClass, pageMap} = props
    const mainRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        return () => {
            for (const page of props.pageMap.values()) {
                if (page.working) {
                    page.stop()
                }
            }
        }
    })
    return <div className={mainClass} ref={mainRef} style={{display: 'none'}}>
        <div className={boxClass}>
            {(() => {
                if ([...pageMap.values()].filter(page => page.isCurrent()).length !== 0)
                    return <Layout>
                        <Layout.Content>
                            {  // 页面
                                [...pageMap.values()].filter(page => page.isCurrent()).map(page =>
                                    <PageView page={page}/>)}
                        </Layout.Content>
                        <Layout.Sider theme="light">
                            <DisplayType></DisplayType>
                        </Layout.Sider>
                    </Layout>
            })()}
            <hr/>
            <Tabs>
                <Tabs.TabPane key="uid2username-tab" tab={<span>uid</span>}>
                    <UidUsernameView updateBox={() => {
                        // 需要更改所有内容, 需要放在外面, SettingView里不需要page信息
                        for (const page of pageMap.values()) {
                            if (page.working) {
                                page.stop()
                                page.start()
                            }
                        }
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
                                    for (const page of pageMap.values()) {
                                        if (page.working) {
                                            page.stop()
                                            page.start()
                                        }
                                    }
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
                                    (mainRef as any).current.style.setProperty('display', 'none')
                                }}>隐藏菜单</Button>
                    </Col>
                </Row>
            </Card>
        </div>
    </div>
}