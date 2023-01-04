import {UidUsername} from "@/config/setting/special/impl/uid-username";
import {EyeInvisibleOutlined, EyeOutlined, PlusOutlined, SyncOutlined} from '@ant-design/icons';
import {AutoComplete, Button, Card, Col, Input, Row, Tag, Tooltip} from "antd";
import React from "react";
import {Settings} from "@/config/setting/setting";

export function UidUsernameView(props: {
    updateBox: () => void
}) {
    const {updateBox} = props;
    const uu: UidUsername = React.useState(new UidUsername())[0];
    const [settings, setSettings] = React.useState<{ username: string, uid: string }[]>([]);
    const [inputUid, setInputUid] = React.useState('');
    const [inputUsername, setInputUsername] = React.useState<string | undefined>(undefined);
    const [userInfos, setUserInfos] = React.useState<{ uid: number, username: string; }[]>([]);
    const [searchKeyword, setSearchKeyword] = React.useState('');
    const [searchType, setSearchType] = React.useState<'uid2username' | 'username2uid'>('uid2username');
    const [toUpdate, setToUpdate] = React.useState(0);
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
    const uid2username = async (uid: string) => {
        let username: string | undefined = await uu.uid2username(uid);
        username = username === '' ? undefined : username;
        return username;
    }
    const updateHideSettings = async () => {
        setHideSettings(await Settings.getSettingValue('uid.hide'));
    }
    React.useEffect(() => {
        updateSettings();
        updateHideSettings();
    }, [])
    return <>
        <Card>
            {settings.filter(item => !hideSettings.includes(item.uid)).map(item =>
                <Tooltip title={item.uid} key={item.uid} getPopupContainer={e => e} mouseEnterDelay={0}
                         trigger='click'>
                    <Tag closable={true} style={{userSelect: 'none'}}
                         onDoubleClick={async () => {
                             Settings.addSettingValue('uid.hide', item.uid);
                             await updateHideSettings();
                         }}
                         onClose={async () => {
                             uu.del('uid')(item.uid)
                             await updateSettings()
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
                         onClose={async () => {
                             uu.del('uid')(item.uid);
                             Settings.delSettingValue('uid.hide', item.uid);
                             await updateSettings();
                             await updateHideSettings();
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
                               setSearchType('uid2username');
                               let value = e.target.value
                               if (value === '') {
                                   setInputUid('')
                                   setInputUsername(undefined);
                                   setUserInfos([]);
                               } else if (/^[1-9](\d+)?$/.test(value)) {
                                   // 手动更改uid后, 清空username选项
                                   setInputUid(value + '');
                                   setInputUsername(await uid2username(value + ''));
                                   setUserInfos([])
                               } else {  // 不是正整数 => 不改变(变为上一次的值)
                                   setInputUid(inputUid);
                                   if (userInfos.length !== 0) {
                                       setUserInfos([]);
                                       setInputUsername(await uid2username(inputUid));
                                   }
                               }
                           }}></Input>
                </Row>
                <Row>
                    <AutoComplete size={'small'} style={{width: '100%'}} showSearch={true} placeholder={'username'}
                                  allowClear={true}
                                  getPopupContainer={target => target} searchValue={searchKeyword} value={inputUsername}
                                  disabled={searchType === 'uid2username' && inputUid !== ''}
                                  onSearch={async (keyword) => {
                                      setSearchType('username2uid');
                                      setInputUid('');
                                      setInputUsername(keyword);
                                      setUserInfos(await uu.username2infos(keyword));
                                  }}
                                  onSelect={async (uid) => {
                                      setSearchType('username2uid');
                                      setInputUid(uid);
                                      setInputUsername(await uid2username(uid));
                                  }}>
                        {userInfos.map(result =>
                            <AutoComplete.Option key={result.uid}>
                                {result.username}
                            </AutoComplete.Option>)}
                    </AutoComplete>
                </Row>
            </Col>
            <Col span={2}>
                <Button
                    size={'small'}
                    style={{width: '100%', height: '100%'}}
                    block
                    disabled={!inputUid || !inputUsername}
                    icon={<PlusOutlined/>}
                    onMouseUp={async (event) => {
                        if (event.button === 2) {
                            // 单击右键
                            switch (searchType) {
                                case 'username2uid':  // 清空
                                    setInputUid('');
                                    setInputUsername(undefined);
                                    setUserInfos([]);
                                    break;
                                case 'uid2username':  // 取消准备
                                    setSearchType('username2uid');
                                    setUserInfos(inputUsername ? await uu.username2infos(inputUsername) : []);
                                    break;
                            }
                        }
                    }}
                    onClick={async () => {
                        if (inputUid) {  // 有输入uid再处理
                            switch (searchType) {
                                case 'username2uid':  // 准备
                                    setSearchType('uid2username');
                                    break;
                                case 'uid2username':  // 添加
                                    uu.add('uid')(inputUid);
                                    setInputUid('');
                                    setInputUsername(undefined);
                                    setUserInfos([]);
                                    await updateSettings();
                                    updateBox()
                                    break;
                            }
                        }
                    }}></Button>
            </Col>
            <Col span={2}>
                <Button
                    size={'small'}
                    style={{width: '100%', height: '100%'}}
                    block
                    icon={<SyncOutlined/>}
                    onClick={async () => {
                        GM_listValues()
                            .filter(item => item.startsWith('uid_'))
                            .forEach(item => GM_deleteValue(item))
                        await updateSettings()
                    }}></Button>
            </Col>
            <Col span={2}>
                <Button
                    size={'small'}
                    style={{width: '100%', height: '100%'}}
                    block
                    icon={hide ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                    onClick={() => setHide(!hide)}>
                </Button>
            </Col>
        </Row>
    </>;
}