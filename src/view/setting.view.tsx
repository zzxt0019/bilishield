import {Setting, Settings} from "@/config/setting/setting";
import {EyeInvisibleOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Card, Col, Input, Row, Tag} from "antd";
import React from "react";

export function SettingView(props: {
    setting: Setting,
    updateBox: () => void
}) {
    const {setting, updateBox} = props
    const [settings, setSettings] = React.useState<string[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const updateSettings = async () => {
        setSettings(await Settings.getSettingValue(setting));
    };
    const [hide, setHide] = React.useState(true);
    const [hideSettings, setHideSettings] = React.useState<string[]>([]);
    const updateHideSettings = async () => {
        setHideSettings(await Settings.getSettingValue(setting.key + '.hide'));
    }
    React.useEffect(() => {
        updateSettings();
        updateHideSettings();
    }, [])
    return <>
        <Card>
            {settings.filter(setting => !hideSettings.includes(setting)).map(setting =>
                <Tag closable={true} key={setting} style={{userSelect: 'none'}}
                     onDoubleClick={async (e) => {
                         Settings.addSettingValue(props.setting.key + '.hide', (e.target as any).textContent);
                         await updateHideSettings();
                     }}
                     onClose={async () => {
                         Settings.delSettingValue(props.setting, setting)
                         await updateSettings()
                         updateBox()
                     }}>{setting}</Tag>
            )}
            {!hide && settings.filter(setting => hideSettings.includes(setting)).map(setting =>
                <Tag closable={true} key={setting} style={{userSelect: 'none'}}
                     color={'#00000080'}
                     onDoubleClick={async () => {
                         Settings.delSettingValue(props.setting.key + '.hide', setting);
                         await updateHideSettings();
                     }}
                     onClose={async () => {
                         Settings.delSettingValue(props.setting, setting)
                         await updateSettings()
                         updateBox()
                     }}>{setting}</Tag>
            )}
        </Card>
        <Row>
            <Col span={18}>
                <Input type='text' value={inputValue} placeholder={setting.name}
                       allowClear={true}
                       onChange={e => setInputValue(e.target.value)}>
                </Input>
            </Col>
            <Col span={3}>
                <Button
                    block
                    icon={<PlusOutlined/>}
                    // 输入框为空 或者 输入框与已有配置相同  disabled
                    disabled={!inputValue || settings.filter(setting => setting === inputValue).length > 0}
                    onClick={async () => {
                        // 添加 保存到GM
                        if (inputValue) {
                            Settings.addSettingValue(setting, inputValue)
                        }
                        setInputValue('')
                        await updateSettings()
                        updateBox()
                    }}></Button>
            </Col>
            <Col span={3}>
                <Button
                    block
                    icon={hide ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                    onClick={() => setHide(!hide)}>
                </Button>
            </Col>
        </Row>
    </>
}