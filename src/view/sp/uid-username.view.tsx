import { UidUsername } from "@/config/setting/special/uid-username";
import React from "react";

export class UidUsernameView extends React.Component {
    uidusername = new UidUsername()
    input = React.createRef<HTMLInputElement>()
    props = {
        updateBox:()=>{}
    }
    state = {
        inputUid: '',
        inputUsername: ''
    }
    render() {
        return <div>
            <div>uid名称: </div>
            <div>{this.uidusername.get('uid')().map(uid => `${uid}(${this.uidusername.uid2username(uid)})`)}</div>
            <input ref={this.input} onChange={() => {
                if (this.input.current) {
                    this.setState({ inputUid: this.input.current.value, inputUsername: this.uidusername.uid2username(this.input.current.value) })
                }
            }}></input><span>{this.state.inputUsername}</span>
            <div>
                <button onClick={() => {
                    if (this.input.current) {
                        this.uidusername.add('uid')(this.input.current.value)
                    }
                    this.props.updateBox()
                }}>添加</button><button onClick={() => {
                    if (this.input.current) {
                        this.uidusername.del('uid')(this.input.current.value)
                    }
                    this.props.updateBox()
                }}>删除</button>
            </div>
        </div>
    }
}