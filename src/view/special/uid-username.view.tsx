import {UidUsername} from "@/config/setting/special/impl/uid-username";
import {EyeInvisibleOutlined, EyeOutlined, PlusOutlined, SyncOutlined} from '@ant-design/icons';
import {Button, Card, Col, Input, Row, Select, Tag, Tooltip} from "antd";
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
    const [searched, setSearched] = React.useState<{ uid: number, username: string }[]>([]);
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
            <Col span={18}>
                <Row>
                    <Input size={'small'} allowClear={true} value={inputUid} placeholder={'uid'}
                           onChange={async (e) => {
                               let value = e.target.value
                               if (value === '') {
                                   // username搜索后点取消, 保留选择的username
                                   // uid搜索后点取消, 清空username
                                   setInputUid('')
                                   if (searched.length === 0) {
                                       setInputUsername('')
                                   }
                               } else if (/^[1-9](\d+)?$/.test(value)) {
                                   // 手动更改uid后, 清空username选项
                                   setInputUid(value + '');
                                   setInputUsername(await uu.uid2username(value + ''));
                                   setSearched([])
                               } else {  // 不是正整数 => 不改变(变为上一次的值)
                                   setInputUid(inputUid);
                                   if (searched.length !== 0) {
                                       setSearched([]);
                                       setInputUsername(await uu.uid2username(inputUid));
                                   }
                               }
                           }}></Input>
                </Row>
                <Row>
                    <Select size={'small'} style={{width: '100%'}} showSearch={true} showArrow={false} placeholder='username'
                            disabled={inputUid !== '' && searched.length === 0}
                            value={inputUsername}
                            getPopupContainer={target => target}
                            filterOption={false}
                            onSearch={async (username) => {
                                setSearched(await uu.username2Uid(username));
                            }}
                            onChange={async (uid) => {
                                setInputUid(uid + '');
                                setInputUsername(await uu.uid2username(uid + ''));
                            }}>
                        {
                            searched.map(result =>
                                <Select.Option key={result.uid + ''} value={result.uid + ''}>
                                    {result.username}
                                </Select.Option>)
                        }
                    </Select>
                </Row>
            </Col>
            <Col span={2}>
                <Button
                    size={'small'}
                    style={{height: '100%'}}
                    block
                    disabled={!inputUsername}
                    icon={<PlusOutlined/>}
                    onClick={() => {
                        if (inputUid && inputUsername) {
                            uu.add('uid')(inputUid)
                        }
                        setInputUid('');
                        // 是通过username搜索的, 不清空当前username
                        if (searched.length === 0) {
                            setInputUsername('');
                        }
                        updateSettings()
                        updateBox()
                    }}></Button>
            </Col>
            <Col span={2}>
                <Button
                    size={'small'}
                    style={{height: '100%'}}
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
                    size={'small'}
                    style={{height: '100%'}}
                    block
                    icon={hide ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                    onClick={() => setHide(!hide)}>
                </Button>
            </Col>
        </Row>
    </Card>;
}