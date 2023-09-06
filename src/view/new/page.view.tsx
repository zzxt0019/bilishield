import React from "react";
import {GmGetData} from "@/configure/gm";
import {NobPageCurrentView} from "@/view/new/page-current.view";
import {NobPageItemView} from "@/view/new/page-item.view";

export function NobPageView(props: NobPageProps) {
    const [url, setUrl] = React.useState(window.location.href);
    const [pages, setPages] = React.useState(GmGetData('page'))
    return <>
        <NobPageCurrentView setPages={setPages}/>
        {pages.map(page => <>
                <NobPageItemView page={page} setPages={setPages}/>
            </>
        )}
    </>
}

export interface NobPageProps {

}