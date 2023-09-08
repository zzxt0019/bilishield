import {ConfigProvider} from "antd";
import React from "react";
import {NobPageView} from "@/view/new/page.view";

export function BoxView(props: {}) {
    const mainRef = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {
        return () => {
            // for (const page of props.pageMap.values()) {
            //     if (page.working) {
            //         page.stop()
            //     }
            // }
        }
    })

    function updateBox() {
        // 需要更改所有内容, 需要放在外面
        // for (const page of pageMap.values()) {
        // if (page.working) {
        //     page.stop()
        //     page.start()
        // }
        // }
    }

    return <>
        <ConfigProvider theme={{token: {colorPrimary: 'pink',},}}>
            <div ref={mainRef} style={{
                display: 'none',
                position: 'absolute',
                top: '10px',
                right: '400px',
                zIndex: Number.MAX_SAFE_INTEGER,
            }}>
                <div style={{
                    position: 'fixed',
                    backgroundColor: 'white',
                    border: '5px groove pink',
                    width: '350px',
                }}>
                    <NobPageView></NobPageView>
                </div>
            </div>
        </ConfigProvider>
    </>;
}