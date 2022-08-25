import {Setting, Settings} from "@/config/setting/setting";
import {PlusOutlined} from '@ant-design/icons';
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
    React.useEffect(() => {
        updateSettings()
    }, [])
    return <Card>
        <Card>
            <div>
                {setting.key + ':' + setting.name}
            </div>
            {settings.map(setting =>
                <Tag closable={true} key={setting} style={{userSelect: 'none'}}
                     onDoubleClick={(e) => {
                         setInputValue((e.target as any).textContent)
                     }}
                     onClose={async () => {
                         Settings.delSettingValue(props.setting, setting)
                         await updateSettings()
                         updateBox()
                     }}>{setting}</Tag>
            )}
        </Card>
        <Row>
            <Col span={20}>
                <Input type='text' value={inputValue}
                       allowClear={true}
                       onChange={(e) => {
                           setInputValue(e.target.value);
                       }}></Input>
            </Col>
            <Col span={4}>
                <Button
                    size="small"
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
        </Row>
    </Card>
}