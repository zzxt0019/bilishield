import {UidUsername} from "@/config/setting/special/impl/uid-username";
import {EyeInvisibleOutlined, EyeOutlined, PlusOutlined, SyncOutlined} from '@ant-design/icons';
import {Button, Card, Col, Input, Row, Tag, Tooltip} from "antd";
import React from "react";
import {Settings} from "@/config/setting/setting";

export function UidUsernameView(props: {
    updateBox: () => void
}) {
    const {updateBox} = props;
    const uu: UidUsername = React.useState(new UidUsername())[0];
    const [settings, setSettings] = React.useState<{ username: string, uid: string }[]>([]);
    const [inputUid, setInputUid] = React.useState('');
    const [inputUsername, setInputUsername] = React.useState('');
    const updateSettings = async () => {
        let uids = await uu.get('uid')()
        Promise.all(uids.map(uid => uu.uid2username(uid)))
            .then((usernames) => {
                let settings: { username: string, uid: string }[] = []
                uids.forEach((uid, i) => {
                    settings.push({uid, username: usernames[i]})
                })
                setSettings(settings)
            })
    }
    const [hide, setHide] = React.useState(true);
    const [hideSettings, setHideSettings] = React.useState<string[]>([]);
    const updateHideSettings = async () => {
        setHideSettings(await Settings.getSettingValue('uid.hide'));
    }
    React.useEffect(() => {
        updateSettings();
        updateHideSettings();
    }, [])
    return <Card>
        <Card>
            <div>uid名称:</div>
            {settings.filter(item => !hideSettings.includes(item.uid)).map(item =>
                <Tooltip title={item.uid} key={item.uid} getPopupContainer={e => e} mouseEnterDelay={0}
                         trigger='click'>
                    <Tag closable={true} style={{userSelect: 'none'}}
                         onDoubleClick={async () => {
                             Settings.addSettingValue('uid.hide', item.uid);
                             await updateHideSettings();
                         }}
                         onClose={() => {
                             uu.del('uid')(item.uid)
                             updateSettings()
                             updateBox()
                         }} key={item.username}>{item.username}</Tag>
                </Tooltip>
            )}
            {!hide && settings.filter(item => hideSettings.includes(item.uid)).map(item =>
                <Tooltip title={item.uid} key={item.uid} getPopupContainer={e => e} mouseEnterDelay={0}
                         trigger='click'>
                    <Tag closable={true} style={{userSelect: 'none'}}
                         color={'#00000080'}
                         onDoubleClick={async () => {
                             Settings.delSettingValue('uid.hide', item.uid);
                             await updateHideSettings();
                         }}
                         onClose={() => {
                             uu.del('uid')(item.uid)
                             updateSettings()
                             updateBox()
                         }} key={item.username}>{item.username}</Tag>
                </Tooltip>
            )}
        </Card>
        <Row>
            <Col span={10}>
                <Input allowClear={true} value={inputUid}
                       onChange={async (e) => {
                           let value = e.target.value
                           if (!value) {
                               setInputUid('')
                               setInputUsername('')
                           } else if (/^[1-9](\d+)?$/.test(value)) {
                               setInputUid(value + '');
                               setInputUsername(await uu.uid2username(value + ''));
                           } else {  // 不是正整数 => 不改变(变为上一次的值)
                               setInputUid(inputUid);
                               setInputUsername(inputUsername);
                           }
                       }}></Input>
            </Col>
            <Col span={8}>
                {!!inputUsername && <Tag>{inputUsername}</Tag>}
            </Col>
            <Col span={2}>
                <Button
                    block
                    disabled={!inputUsername}
                    icon={<PlusOutlined/>}
                    onClick={() => {
                        if (inputUid && inputUsername) {
                            uu.add('uid')(inputUid)
                        }
                        setInputUid('');
                        setInputUsername('');
                        updateSettings()
                        updateBox()
                    }}></Button>
            </Col>
            <Col span={2}>
                <Button
                    block
                    icon={<SyncOutlined/>}
                    onClick={async () => {
                        GM_listValues()
                            .filter(item => item.startsWith('uid_'))
                            .forEach(item => GM_deleteValue(item))
                        updateSettings()
                    }}></Button>
            </Col>
            <Col span={2}>
                <Button
                    block
                    icon={hide ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                    onClick={() => setHide(!hide)}>
                </Button>
            </Col>
        </Row>
    </Card>;
}