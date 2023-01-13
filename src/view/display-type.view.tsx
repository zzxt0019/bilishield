import React from "react";
import {Button, Card, Tooltip} from "antd";
import * as MainStatic from "@/main-static";

export function DisplayTypeView() {
    const [displayType, setDisplayType] = React.useState(
        document.getElementById(MainStatic.DisplayStyleId)?.getAttribute(MainStatic.DisplayStyleAttribute) as string
    )
    return <>
        <Card style={{height: '100%'}} bodyStyle={{display: 'flex', alignItems: 'center', height: '100%'}}>
            <Tooltip title={'切换至' + (displayType === 'hide' ? 'debug' : 'hide')}
                     getPopupContainer={target => target}>
                <Button style={{
                    width: '100px'
                }} onClick={() => {
                    let element: HTMLElement = document.getElementById(MainStatic.DisplayStyleId) as HTMLElement;
                    const displayType = element.getAttribute(MainStatic.DisplayStyleAttribute) === 'hide' ? 'debug' : 'hide';
                    element.setAttribute(MainStatic.DisplayStyleAttribute, displayType);
                    element.innerHTML = MainStatic.CssInnerHtml[displayType];
                    for (let i = 0; i < window.frames.length; i++) {
                        try {
                            (window.frames[i].document.getElementById(MainStatic.DisplayStyleId) as Element).innerHTML = MainStatic.CssInnerHtml[displayType];
                        } catch (ignore) {
                        }
                    }
                    setDisplayType(displayType)
                }}>{displayType}</Button>
            </Tooltip>
        </Card>
    </>
}