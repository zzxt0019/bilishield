import {Page} from "@/config/page/page";
import {Button, Card, Col, Row, Typography} from "antd";
import React from "react";

export function PageView(props: {
    page: Page,
}) {
    const {page} = props
    const [working, setWorking] = React.useState(page.working);
    const workClick = () => {
        // 切换工作状态
        if (page.working) {
            page.stop()
        } else {
            page.start()
        }
        setWorking(page.working);
    }
    return <Card>
        <Row>
            <Col span={12}>
                <Typography.Text type={working ? 'success' : 'danger'}>
                    {page.name}
                </Typography.Text>
            </Col>
            <Col span={6}></Col>
            <Col span={6}>
                <Button
                    size="small" onClick={workClick}>
                    {working ? '停止' : '启动'}
                </Button>
            </Col>
        </Row>
    </Card>
}