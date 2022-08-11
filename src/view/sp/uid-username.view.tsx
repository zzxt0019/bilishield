import { UidUsername } from "@/config/setting/special/uid-username";
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
            <div>{this.state.settings.map(item => `${item.uid}(${item.username})`)}</div>
            <input ref={this.input} onChange={async () => {
                if (this.input.current) {
                    this.setState({ inputUid: this.input.current.value, inputUsername: await this.uidusername.uid2username(this.input.current.value) })
                }
            }}></input><span>{this.state.inputUsername}</span>
            <div>
                <button onClick={() => {
                    if (this.input.current) {
                        this.uidusername.add('uid')(this.input.current.value)
                    }
                    this.updateSettings()
                    this.props.updateBox()
                }}>添加</button>
                <button onClick={() => {
                    if (this.input.current) {
                        this.uidusername.del('uid')(this.input.current.value)
                    }
                    this.updateSettings()
                    this.props.updateBox()
                }}>删除</button>
                <button onClick={async () => {
                    let uids = new Set(await this.uidusername.get('uid')())
                    GM_listValues()
                        .filter(item => item.startsWith('uid_'))
                        .filter(item => !uids.has(item.split('_')[1]))
                        .forEach(item => GM_deleteValue(item))
                    this.forceUpdate()
                }}>清除缓存</button>
            </div>
        </div>
    }
}