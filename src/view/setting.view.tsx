import {Setting, Settings} from "@/config/setting/setting";
import {EyeInvisibleOutlined, EyeOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Card, Col, Input, Row, Tag} from "antd";
import React from "react";
import {SettingData} from "@/config/setting/setting-data";

export function SettingView(props: {
    setting: Setting,
    updateBox: () => void
}) {
    const {setting, updateBox} = props;
    const [settings, setSettings] = React.useState<SettingData[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const [hide, setHide] = React.useState(true);
    const updateSettings = () => {
        Settings.selectSettingData(setting.key).then(setSettings);
    };
    React.useEffect(() => {
        updateSettings();
    }, [])
    return <>
        <Card>
            {
                settings.filter(setting => !hide || !setting.hide)
                    .sort(setting => setting.hide ? 1 : -1)
                    .map(setting =>
                        <Tag closable={true} key={setting.key}
                             style={{userSelect: 'none', maxWidth: '300px', whiteSpace: 'normal'}}
                             color={setting.hide ? '#00000080' : undefined}
                             onDoubleClick={() => {
                                 Settings.updateSettingData(props.setting.key, {key: setting.key, hide: !setting.hide});
                                 updateSettings();
                             }}
                             onAuxClick={() => setInputValue(setting.key)}
                             onClose={() => {
                                 Settings.deleteSettingData(props.setting.key, {key: setting.key})
                                 updateSettings();
                                 updateBox();
                             }}
                        >{setting.key}</Tag>
                    )
            }
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
                    disabled={!inputValue || settings.filter(setting => setting.key === inputValue).length > 0}
                    onClick={() => {
                        // 添加 保存到GM
                        if (inputValue) {
                            Settings.insertSettingData(setting.key, {key: inputValue})
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
    </>;
}