import React, {useState} from "react";
import {Button} from "antd";
import {CSS_INNER_HTML, DISPLAY_STYLE_ID} from "@/main-static";

export function DisplayType() {
    const [displayType, setDisplayType] = useState(
        document.getElementById(DISPLAY_STYLE_ID)?.getAttribute('displayType') as string
    )
    // todo 等待整理
    return <div>
        {displayType}
        <Button onClick={() => {
            if (document.getElementById(DISPLAY_STYLE_ID)?.getAttribute('displayType') === 'display') {
                document.getElementById(DISPLAY_STYLE_ID)?.setAttribute('displayType', 'debug');
                (document.getElementById(DISPLAY_STYLE_ID) as Element).innerHTML = CSS_INNER_HTML.debug;
                for (let i = 0; i < window.frames.length; i++) {
                    try {
                        (window.frames[i].document.getElementById(DISPLAY_STYLE_ID) as Element).innerHTML = CSS_INNER_HTML.debug;
                    } catch (ignore) {
                    }
                }
            } else {
                document.getElementById(DISPLAY_STYLE_ID)?.setAttribute('displayType', 'display');
                (document.getElementById(DISPLAY_STYLE_ID) as Element).innerHTML = CSS_INNER_HTML.display;
                for (let i = 0; i < window.frames.length; i++) {
                    try {
                        (window.frames[i].document.getElementById(DISPLAY_STYLE_ID) as Element).innerHTML = CSS_INNER_HTML.display;
                    } catch (ignore) {
                    }
                }
            }
            setDisplayType(
                document.getElementById(DISPLAY_STYLE_ID)?.getAttribute('displayType') as string
            )
        }}>[换]</Button>
    </div>
}