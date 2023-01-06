import React from "react";

export function App() {
    fetch('./data.json').then(res => {
        res.json().then(json => {
            console.log(json)
        })
    })
    return <>
    </>
}