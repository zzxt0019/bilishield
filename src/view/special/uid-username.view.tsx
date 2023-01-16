import {EyeInvisibleOutlined, EyeOutlined, SyncOutlined} from '@ant-design/icons';
import {Button, Card, Col, Row, Tag, Tooltip} from "antd";
import React from "react";
import {Settings} from "@/config/setting/setting";
import {UidUsernameSearchView} from "@/view/special/uid-username-search.view";
import {SettingData} from "@/config/setting/setting-data";

export function UidUsernameView(props: {
    updateBox: () => void
}) {
    const {updateBox} = props;
    const [settings, setSettings] = React.useState<SettingData<'username'>[]>([]);
    const [hide, setHide] = React.useState(true);  // 是否显示隐藏的tag标签
    const updateSearchView: { uid: (uid: string) => void } = {
        uid: () => {
        }
    }
    /**
     * 更新配置展示
     */
    const updateSettings = () => Settings.selectSettingData('username').then(setSettings);
    React.useEffect(() => {
        updateSettings();
    }, [])
    return <>
        <Card>
            {
                settings.filter(item => !hide || !item.hide)
                    .sort(item => item.hide ? 1 : -1)
                    .map(item =>
                        <Tooltip title={item.key} key={item.key} getPopupContainer={e => e} mouseEnterDelay={0}
                                 trigger='click' showArrow={false}>
                            <Tag closable={true} style={{userSelect: 'none'}}
                                 color={item.hide ? '#00000080' : undefined}
                                 onDoubleClick={() => {
                                     // 双击隐藏/显示
                                     Settings.updateSettingData('uid', {key: item.key, hide: !item.hide});
                                     updateSettings();
                                 }}
                                 onAuxClick={() => {
                                     updateSearchView.uid(item.key);
                                 }}
                                 onClose={() => {
                                     // 删除, 删除uid
                                     Settings.deleteSettingData('uid', item.key);
                                     updateSettings();
                                     updateBox();
                                 }}
                                 key={item.username}>{item.username}</Tag>
                        </Tooltip>)
            }
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
                        await Settings.selectSettingData('uid')
                            .then(array => Settings.resetSettingData('uid',
                                array.sort((sd1, sd2) => Number(sd1.key) - Number(sd2.key))));
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