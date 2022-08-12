import { UidUsername } from "@/config/setting/special/impl/uid-username";
import { Button, InputNumber, Tag, Tooltip } from "antd";
import React from "react";

export class UidUsernameView extends React.Component {
    uidusername = new UidUsername()
    input = React.createRef<HTMLInputElement>()
    props = {
        updateBox: () => { }
    }
    state: {
        settings: { username: string, uid: string }[],
        inputUid: string,
        inputUsername: string
    } = {
            settings: [],
            inputUid: '',
            inputUsername: ''
        }
    updateSettings = async () => {
        let uids = await this.uidusername.get('uid')()
        Promise.all(uids.map(uid => this.uidusername.uid2username(uid)))
            .then((usernames) => {
                let settings: { username: string, uid: string }[] = []
                uids.forEach((uid, i) => {
                    settings.push({ uid, username: usernames[i] })
                })
                this.setState({ settings })
            })
    }
    componentDidMount(): void {
        this.updateSettings()
    }
    render() {
        return <div>
            <div>uid名称: </div>
            <div>{this.state.settings.map(item =>
                <Tooltip title={item.uid} key={item.uid} getPopupContainer={(e) => e}>
                    <Tag closable={true} onClose={() => {
                        this.uidusername.del('uid')(item.uid)
                        this.updateSettings()
                        this.props.updateBox()
                    }} key={item.username}>{item.username}</Tag>
                </Tooltip>
            )}</div>
            <InputNumber controls={false} ref={this.input} onChange={async () => {
                if (this.input.current) {
                    this.setState({ inputUid: this.input.current.value, inputUsername: await this.uidusername.uid2username(this.input.current.value) })
                }
            }}></InputNumber><span>{this.state.inputUsername}</span>
            <div>
                <Button onClick={() => {
                    if (this.input.current) {
                        this.uidusername.add('uid')(this.input.current.value)
                    }
                    this.updateSettings()
                    this.props.updateBox()
                }}>添加</Button>
                <Button onClick={async () => {
                    GM_listValues()
                        .filter(item => item.startsWith('uid_'))
                        .forEach(item => GM_deleteValue(item))
                        console.log(GM_listValues())
                    this.updateSettings()
                }}>清除缓存</Button>
            </div>
        </div>
    }
}