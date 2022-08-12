import { Setting, Settings } from "@/config/setting/setting";
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Tag } from "antd";
import React from "react";

export class SettingView extends React.Component {
    constructor(any: any) {
        super(any)
    }
    props = {
        setting: {} as Setting,
        updateBox: () => { }
    }
    state = {
        settings: [],
        inputValue: ''
    }
    updateSettings = async () => {
        this.setState({ settings: await Settings.getSettingValue(this.props.setting) })
    }
    componentDidMount(): void {
        this.updateSettings()
    }
    render() {
        return <Card>
            <Card>
                <div>
                    {this.props.setting.key + ':' + this.props.setting.name}
                </div>
                {this.state.settings.map(setting =>
                    <Tag closable={true} onClose={() => {
                        Settings.delSettingValue(this.props.setting, setting)
                        this.updateSettings()
                        this.props.updateBox()
                    }}>{setting}</Tag>
                )}
            </Card>
            <Row>
                <Col span={20}>
                    <Input type='text' onChange={(e) => this.setState({ inputValue: e.target.value })}></Input>
                </Col>
                <Col span={4}>
                    <Button
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            // 添加 保存到GM
                            if (this.state.inputValue) {
                                Settings.addSettingValue(this.props.setting, this.state.inputValue)
                            }
                            this.updateSettings()
                            this.props.updateBox()
                        }}></Button>
                </Col>
            </Row>
        </Card>
    }
}