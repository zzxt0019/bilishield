import React from "react";
import {Tree} from "antd";

export function App() {
    const [treeData, setTreeData] = React.useState<any[]>([]);
    const [iframe, setIframe] = React.useState('');
    const read = (value: any, key: string, url: string) => {
        if (typeof value === 'string') {
            return {
                title: `${key}(${value})`,
                key: url,
                isLeaf: true,
            };
        } else {
            let children: any[] = []
            let dataNode: any = {
                title: key,
                key: url,
                children,
                isLeaf: false,
            }
            Object.entries(value).forEach(([key, value]) => {
                children.push(read(value, key, url + '/' + key));
            });
            return dataNode;
        }
    }
    React.useEffect(() => {
        fetch('./data.json').then(res => {
            res.json().then(json => {
                let main = read(json, '', '');
                setTreeData(main.children);
            })
        })
    }, []);

    return <>
        <Tree.DirectoryTree
            showLine={true}
            treeData={treeData}
            onSelect={(keys, event) => {
                if (event.node.isLeaf && keys.length > 0) {
                    setIframe(`./iframes${keys[0]}.html`);
                }
            }}>
        </Tree.DirectoryTree>
        <iframe style={{width: '100%', height: '500px'}} src={iframe}></iframe>
    </>;
}