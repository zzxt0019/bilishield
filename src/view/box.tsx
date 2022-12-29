import {Settings} from "@/config/setting/setting";
import {Button, Col, Layout, Row, Tabs} from "antd";
import React from "react";
import {Page} from "@/config/page/page";
import {PageView} from "./page.view";
import {SettingView} from "./setting.view";
import {UidUsernameView} from "./special/uid-username.view";
import {DisplayType} from "@/view/display-type";

export function Box(props: {
    pageMap: Map<string, Page>
}) {
    const {pageMap} = props
    const mainRef = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        return () => {
            for (const page of props.pageMap.values()) {
                if (page.working) {
                    page.stop()
                }
            }
        }
    })
    return <>
        <div ref={mainRef} style={{
            display: 'none',
            bottom: '6vh',
            color: '#777777',
            position: 'absolute',
            top: '10px',
            right: '400px',
            zIndex: 99999,
        }}>
            <div style={{
                position: 'fixed',
                backgroundColor: 'white',
                border: '5px groove pink',
                width: '350px',
            }}><>
                {
                    [...pageMap.values()].filter(page => page.isCurrent()).length !== 0 &&
                    <Layout>
                        <Row>
                            <Col span={14}>
                                {  // 页面
                                    [...pageMap.values()].filter(page => page.isCurrent()).map(page =>
                                        <PageView page={page}/>)}
                            </Col>
                            <Col span={10}>
                                <DisplayType></DisplayType>
                            </Col>
                        </Row>
                    </Layout>
                }
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
                <Row>
                    <Col span={8}></Col>
                    <Col span={8}></Col>
                    <Col span={8}>
                        <Button block
                                onClick={() => {
                                    (mainRef as any).current.style.setProperty('display', 'none')
                                }}>隐藏菜单</Button>
                    </Col>
                </Row></>
            </div>
        </div>
    </>
}