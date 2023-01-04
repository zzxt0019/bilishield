import {UidUsername} from "@/config/setting/special/impl/uid-username";
import {EyeInvisibleOutlined, EyeOutlined, SyncOutlined} from '@ant-design/icons';
import {Button, Card, Col, Row, Tag, Tooltip} from "antd";
import React from "react";
import {Settings} from "@/config/setting/setting";
import {UidUsernameSearchView} from "@/view/special/uid-username-search.view";

export function UidUsernameView(props: {
    updateBox: () => void
}) {
    const {updateBox} = props;
    const uu: UidUsername = React.useState(new UidUsername())[0];
    const [settings, setSettings] = React.useState<{ uid: string, username: string, }[]>([]);
    const [hide, setHide] = React.useState(true);  // 是否显示隐藏的tag标签
    const [hideSettings, setHideSettings] = React.useState<string[]>([]);  // 隐藏的uid
    /**
     * 更新配置展示
     */
    const updateSettings = () => {
        uu.get('uid')().then(uids => {
            Promise.all(uids.map(uid => uu.uid2username(uid)))
                .then((usernames) => {
                    let settings: { uid: string, username: string, }[] = []
                    uids.forEach((uid, i) => {
                        settings.push({uid, username: usernames[i]})
                    })
                    setSettings(settings)
                })
        })
    }
    /**
     * 更新隐藏展示
     */
    const updateHideSettings = () => {
        Settings.getSettingValue('uid.hide').then(hideSettings => setHideSettings(hideSettings));
    }
    React.useEffect(() => {
        updateSettings();
        updateHideSettings();
    }, [])
    return <>
        <Card>
            {/* 展示Tag */}
            {settings.filter(item => !hideSettings.includes(item.uid)).map(item =>
                <Tooltip title={item.uid} key={item.uid} getPopupContainer={e => e} mouseEnterDelay={0}
                         trigger='click' showArrow={false}>
                    <Tag closable={true} style={{userSelect: 'none'}}
                         onDoubleClick={() => {
                             // 双击隐藏, 添加uid.hide
                             Settings.addSettingValue('uid.hide', item.uid);
                             updateHideSettings();
                         }}
                         onClose={() => {
                             // 删除, 删除uid
                             uu.del('uid')(item.uid)
                             updateSettings()
                             updateBox()
                         }} key={item.username}>{item.username}</Tag>
                </Tooltip>
            )}
            {/* 隐藏Tag */}
            {!hide && settings.filter(item => hideSettings.includes(item.uid)).map(item =>
                <Tooltip title={item.uid} key={item.uid} getPopupContainer={e => e} mouseEnterDelay={0}
                         trigger='click' showArrow={false}>
                    <Tag closable={true} style={{userSelect: 'none'}}
                         color={'#00000080'}
                         onDoubleClick={() => {
                             // 双击显示, 删除uid.hide
                             Settings.delSettingValue('uid.hide', item.uid);
                             updateHideSettings();
                         }}
                         onClose={() => {
                             // 删除, 删除uid和uid.hide
                             uu.del('uid')(item.uid);
                             Settings.delSettingValue('uid.hide', item.uid);
                             updateSettings();
                             updateHideSettings();
                             updateBox()
                         }} key={item.username}>{item.username}</Tag>
                </Tooltip>
            )}
        </Card>
        <Row>
            <UidUsernameSearchView commit={uid => {
                uu.add('uid')(uid);
                updateSettings();
                updateBox();
            }}></UidUsernameSearchView>
            {/* 刷新按钮 */}
            <Col span={2}>
                <Button
                    size={'small'}
                    style={{width: '100%', height: '100%'}}
                    block
                    icon={<SyncOutlined/>}
                    onClick={async () => {
                        // 刷新, uid排序
                        await uu.get('uid')().then(array => uu.set('uid')(array.map(Number).sort((a, b) => a - b).map(String)));
                        await Settings.getSettingValue('uid.hide').then(array => Settings.setSettingValue('uid.hide', array.map(Number).sort((a, b) => a - b).map(String)));
                        GM_listValues()
                            .filter(item => item.startsWith('uid_'))
                            .forEach(item => GM_deleteValue(item))
                        updateSettings()
                    }}></Button>
            </Col>
            {/* 隐藏按钮 */}
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