import React from "react";
import {Button, Col, Input, Row} from "antd";
import {GmDelData, GmGetData} from "@/configure/gm";
import {PageData} from "@/configure/page";

export function NobPageItemView(props: NobPageItemProps) {
    const {page, setPages} = props;
    return <>
        <Row>
            <Col>
                <Input value={page.url}></Input>
            </Col>
            <Col>
                <Button onClick={() => {
                    GmDelData('page', page);
                    setPages(GmGetData('page'))
                }}>-</Button>
            </Col>
        </Row>
    </>
}

export interface NobPageItemProps {
    page: PageData
    setPages: (pages: PageData[]) => void
}