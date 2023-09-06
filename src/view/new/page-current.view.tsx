import React from "react";
import {Button, Col, Input, Row} from "antd";
import {GmAddData, GmGetData} from "@/configure/gm";
import {PageData} from "@/configure/page";

export function NobPageCurrentView(props: NobPageCurrentProps) {
    const {setPages} = props
    const [url, setUrl] = React.useState(window.location.href);
    return <>
        <Row>
            <Col>
                <Input value={url}
                       onChange={(input) => {
                           setUrl(input.target.value);
                       }}
                ></Input>
            </Col>
            <Col>
                <Button onClick={() => {
                    GmAddData('page', {key: url, url, working: true})
                    setPages(GmGetData('page'))
                }}>+</Button>
            </Col>
        </Row>
    </>
}

export interface NobPageCurrentProps {
    setPages: (pages: PageData[]) => void
}