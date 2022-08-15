import React from "react";
import {Button} from "antd";
import {data} from "@/main-static";

export class DisplayType extends React.Component {
    state: {
        type: string
    } = {
        type: ''
    }

    render() {

        // todo 等待整理
        return <div>
            {document.getElementById('ABCDEFG')?.getAttribute('displayType')}
            <Button onClick={() => {
                if (document.getElementById('ABCDEFG')?.getAttribute('displayType') === 'display') {
                    document.getElementById('ABCDEFG')?.setAttribute('displayType', 'debug');
                    (document.getElementById('ABCDEFG') as Element).innerHTML = data.debug
                } else {
                    document.getElementById('ABCDEFG')?.setAttribute('displayType', 'display');
                    (document.getElementById('ABCDEFG') as Element).innerHTML = data.display
                }
            }}>[换]</Button>
        </div>
    }
}