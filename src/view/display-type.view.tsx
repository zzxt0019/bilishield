import React from "react";
import {Button, Card, Tooltip} from "antd";
import {CSS_INNER_HTML, DISPLAY_STYLE_ID} from "@/main-static";

export function DisplayTypeView() {
    const [displayType, setDisplayType] = React.useState(
        document.getElementById(DISPLAY_STYLE_ID)?.getAttribute('displayType') as string
    )
    return <>
        <Card style={{height: '100%'}} bodyStyle={{display: 'flex', alignItems: 'center', height: '100%'}}>
            <Tooltip title={'切换至' + (displayType === 'hide' ? 'debug' : 'hide')}
                     getPopupContainer={target => target}>
                <Button style={{
                    width: '100px'
                }} onClick={() => {
                    let element: HTMLElement = document.getElementById(DISPLAY_STYLE_ID) as HTMLElement;
                    const displayType = element.getAttribute('displayType') === 'hide' ? 'debug' : 'hide';
                    element.setAttribute('displayType', displayType);
                    element.innerHTML = CSS_INNER_HTML[displayType];
                    for (let i = 0; i < window.frames.length; i++) {
                        try {
                            (window.frames[i].document.getElementById(DISPLAY_STYLE_ID) as Element).innerHTML = CSS_INNER_HTML[displayType];
                        } catch (ignore) {
                        }
                    }
                    setDisplayType(displayType)
                }}>{displayType}</Button>
            </Tooltip>
        </Card>
    </>
}