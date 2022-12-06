import React from "react";
import {Button, Card, Col, Row, Typography} from "antd";
import {CSS_INNER_HTML, DISPLAY_STYLE_ID} from "@/main-static";

export function DisplayType() {
    const [displayType, setDisplayType] = React.useState(
        document.getElementById(DISPLAY_STYLE_ID)?.getAttribute('displayType') as string
    )
    return <>
        <Card>
            <Row>
                <Col span={14}>
                    <Typography.Text>
                        {displayType}
                    </Typography.Text>
                </Col>
                <Col span={10}>
                    <Button onClick={() => {
                        let element: HTMLElement = document.getElementById(DISPLAY_STYLE_ID) as HTMLElement;
                        const displayType = element.getAttribute('displayType') === 'display' ? 'debug' : 'display';
                        element.setAttribute('displayType', displayType);
                        element.innerHTML = CSS_INNER_HTML[displayType];
                        for (let i = 0; i < window.frames.length; i++) {
                            try {
                                (window.frames[i].document.getElementById(DISPLAY_STYLE_ID) as Element).innerHTML = CSS_INNER_HTML[displayType];
                            } catch (ignore) {
                            }
                        }
                        setDisplayType(displayType)
                    }}>换</Button>
                </Col>
            </Row>
        </Card>
    </>
}