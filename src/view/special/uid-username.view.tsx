import {UidUsername} from "@/config/setting/special/impl/uid-username";
import {PlusOutlined, SyncOutlined} from '@ant-design/icons';
import {Button, Card, Col, InputNumber, Row, Tag, Tooltip} from "antd";
import React from "react";

export class UidUsernameView extends React.Component {
    uidusername = new UidUsername()
    input = React.createRef<HTMLInputElement>()
    props = {
        updateBox: () => {
        }
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
                    settings.push({uid, username: usernames[i]})
                })
                this.setState({settings})
            })
    }

    componentDidMount(): void {
        this.updateSettings()
    }

    render() {
        return <Card>
            <Card>
                <div>uid名称:</div>
                {this.state.settings.map(item =>
                    <Tooltip title={item.uid} key={item.uid} getPopupContainer={e => e} mouseEnterDelay={0}
                             trigger='click'>
                        <Tag closable={true} onClose={() => {
                            this.uidusername.del('uid')(item.uid)
                            this.updateSettings()
                            this.props.updateBox()
                        }} key={item.username}>{item.username}</Tag>
                    </Tooltip>
                )}
            </Card>
            <Row>
                <Col span={10}>
                    <InputNumber controls={false} value={this.state.inputUid} onChange={async (value) => {
                        let uid = value + ''
                        this.setState({inputUid: uid, inputUsername: await this.uidusername.uid2username(uid)})
                    }}></InputNumber>
                </Col>
                <Col span={8}>
                    {(() => {
                        if (this.state.inputUsername)
                            return <Tag>
                                {this.state.inputUsername}
                            </Tag>
                    })()}
                </Col>
                <Col span={3}>
                    <Button
                        size="small"
                        disabled={!this.state.inputUsername}
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            if (this.state.inputUid && this.state.inputUsername) {
                                this.uidusername.add('uid')(this.state.inputUid)
                            }
                            this.setState({inputUid: '', inputUsername: ''})
                            this.updateSettings()
                            this.props.updateBox()
                        }}></Button>
                </Col>
                <Col span={3}>
                    <Button
                        size="small"
                        icon={<SyncOutlined/>}
                        onClick={async () => {
                            GM_listValues()
                                .filter(item => item.startsWith('uid_'))
                                .forEach(item => GM_deleteValue(item))
                            console.log(GM_listValues())
                            this.updateSettings()
                        }}></Button>
                </Col>
            </Row>
        </Card>
    }
}