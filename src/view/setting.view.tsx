import {Setting, Settings} from "@/config/setting/setting";
import {EyeInvisibleOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Card, Col, Input, Row, Tag} from "antd";
import React from "react";

export function SettingView(props: {
    setting: Setting,
    updateBox: () => void
}) {
    const {setting, updateBox} = props;
    const [settings, setSettings] = React.useState<string[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const [hide, setHide] = React.useState(true);
    const [hideSettings, setHideSettings] = React.useState<string[]>([]);
    const updateSettings = () => {
        Settings.getSettingValue(setting).then(setSettings);
    };
    const updateHideSettings = () => {
        Settings.getSettingValue(setting.key + '.hide').then(setHideSettings);
    }
    React.useEffect(() => {
        updateSettings();
        updateHideSettings();
    }, [])
    return <>
        <Card>
            {settings.filter(setting => !hideSettings.includes(setting)).map(setting =>
                <Tag closable={true} key={setting} style={{userSelect: 'none'}}
                     onDoubleClick={(e) => {
                         Settings.addSettingValue(props.setting.key + '.hide', (e.target as any).textContent);
                         updateHideSettings();
                     }}
                     onAuxClick={() => setInputValue(setting)}
                     onClose={() => {
                         Settings.delSettingValue(props.setting, setting)
                         updateSettings()
                         updateBox()
                     }}>{setting}</Tag>
            )}
            {!hide && settings.filter(setting => hideSettings.includes(setting)).map(setting =>
                <Tag closable={true} key={setting} style={{userSelect: 'none'}}
                     color={'#00000080'}
                     onDoubleClick={() => {
                         Settings.delSettingValue(props.setting.key + '.hide', setting);
                         updateHideSettings();
                     }}
                     onAuxClick={() => setInputValue(setting)}
                     onClose={() => {
                         Settings.delSettingValue(props.setting, setting)
                         updateSettings()
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
                    onClick={() => {
                        // 添加 保存到GM
                        if (inputValue) {
                            Settings.addSettingValue(setting, inputValue)
                        }
                        setInputValue('')
                        updateSettings()
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