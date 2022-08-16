import React from "react";
import {Button} from "antd";
import {CSS_INNER_HTML, DISPLAY_STYLE_ID} from "@/main-static";

export class DisplayType extends React.Component {
    state: {
        type: string
    } = {
        type: ''
    }

    render() {

        // todo 等待整理
        return <div>
            {document.getElementById(DISPLAY_STYLE_ID)?.getAttribute('displayType')}
            <Button onClick={() => {
                if (document.getElementById(DISPLAY_STYLE_ID)?.getAttribute('displayType') === 'display') {
                    document.getElementById(DISPLAY_STYLE_ID)?.setAttribute('displayType', 'debug');
                    (document.getElementById(DISPLAY_STYLE_ID) as Element).innerHTML = CSS_INNER_HTML.debug
                } else {
                    document.getElementById(DISPLAY_STYLE_ID)?.setAttribute('displayType', 'display');
                    (document.getElementById(DISPLAY_STYLE_ID) as Element).innerHTML = CSS_INNER_HTML.display
                }
                this.forceUpdate()
            }}>[换]</Button>
        </div>
    }
}