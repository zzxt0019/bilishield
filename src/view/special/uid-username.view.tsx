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
    const updateSearchView: { uid: (uid: string) => void } = {
        uid: () => {
        }
    }
    /**
     * 更新配置展示
     */
    const updateSettings = () => {
        Settings.selectSettingData('username').then(results => {
            Promise.all(results.map(uid => uu.uid2username(uid.key)))
                .then((usernames) => {
                    let settings: { uid: string, username: string, }[] = []
                    results.forEach((uid, i) => {
                        settings.push({uid: uid.key, username: usernames[i]})
                    })
                    setSettings(settings)
                })
        })
    }
    /**
     * 更新隐藏展示
     */
    const updateHideSettings = () => {
        Settings.selectSettingDataString('uid.hide').then(hideSettings => setHideSettings(hideSettings));
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
                             Settings.insertSettingData('uid.hide', {key: item.uid});
                             updateHideSettings();
                         }}
                         onAuxClick={() => {
                             updateSearchView.uid(item.uid);
                         }}
                         onClose={() => {
                             // 删除, 删除uid
                             Settings.deleteSettingData('uid', item.uid);
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
                             Settings.deleteSettingData('uid.hide', {key: item.uid});
                             updateHideSettings();
                         }}
                         onAuxClick={() => {
                             updateSearchView.uid(item.uid);
                         }}
                         onClose={() => {
                             // 删除, 删除uid和uid.hide
                             Settings.deleteSettingData('uid', item.uid);
                             Settings.deleteSettingData('uid.hide', item.uid);
                             updateSettings();
                             updateHideSettings();
                             updateBox()
                         }} key={item.username}>{item.username}</Tag>
                </Tooltip>
            )}
        </Card>
        <Row>
            <UidUsernameSearchView update={updateSearchView} commit={uid => {
                Settings.insertSettingData('uid', uid);
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
                        await Settings.selectSettingData('uid').then(array => Settings.resetSettingData('uid', array.map(Number).sort((a, b) => a - b).map(num => {
                            return {key: String(num)}
                        })));
                        await Settings.selectSettingDataString('uid.hide').then(array => Settings.resetSettingData('uid.hide', array.map(Number).sort((a, b) => a - b).map(num => {
                            return {key: String(num)}
                        })));
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