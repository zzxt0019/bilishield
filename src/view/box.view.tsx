import {Settings} from "@/config/setting/setting";
import {Button, Col, ConfigProvider, Row, Tabs} from "antd";
import React from "react";
import {Page} from "@/config/page/page";
import {PageView} from "./page.view";
import {SettingView} from "./setting.view";
import {UidUsernameView} from "./special/uid-username.view";
import {DisplayTypeView} from "@/view/display-type.view";

export function BoxView(props: {
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

    function updateBox() {
        // 需要更改所有内容, 需要放在外面
        for (const page of pageMap.values()) {
            if (page.working) {
                page.stop()
                page.start()
            }
        }
    }

    return <>
        <ConfigProvider theme={{token: {colorPrimary: 'pink',},}}>
            <div ref={mainRef} style={{
                display: 'none',
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
                        <Row>
                            <Col span={14}>
                                {  // 页面
                                    [...pageMap.values()].filter(page => page.isCurrent()).map(page =>
                                        <PageView key={page.key} page={page}/>)}
                            </Col>
                            <Col span={10}>
                                <DisplayTypeView></DisplayTypeView>
                            </Col>
                        </Row>
                    }
                    <Tabs defaultActiveKey={'uid'} items={[{
                        key: 'uid', label: 'uid',
                        children: <UidUsernameView updateBox={updateBox}/>
                    }, ...[...Settings.getSystemSettings().values()].map(setting => {
                        return {
                            key: setting.key, label: setting.name,
                            children: <SettingView
                                key={setting.key}
                                setting={setting}
                                updateBox={updateBox}/>
                        }
                    })]}>
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
                    </Row>
                </>
                </div>
            </div>
        </ConfigProvider>
    </>;
}