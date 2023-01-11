import React from "react";
import {AutoComplete, Button, Col, Input, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {UidUsername} from "@/config/setting/special/impl/uid-username";

export function UidUsernameSearchView(props: UidUsernameSearchViewProps) {
    const {commit} = props;
    const uu: UidUsername = React.useState(new UidUsername())[0];
    const [uid, setUid] = React.useState('');
    const [username, setUsername] = React.useState<string | undefined>(undefined);
    const [userInfos, setUserInfos] = React.useState<{ uid: number, username: string; }[]>([]);
    const [searchType, setSearchType] = React.useState<'uid2username' | 'username2uid'>('uid2username');
    const [userInfoEnd, setUserInfoEnd] = React.useState(false);
    const uid2username = async (uid: string) => {
        let username: string | undefined = await uu.uid2username(uid);
        username = username === '' ? undefined : username;
        return username;
    }
    return <>
        <Col span={18}>
            <Row>
                {/* uid输入框 */}
                <Input size={'small'} allowClear={true} value={uid} placeholder={'uid'}
                       onChange={(e) => {
                           let value = e.target.value
                           setSearchType('uid2username');
                           if (value === '') {
                               // 清空, 清空所有
                               setUid('');
                               setUsername(undefined);
                               setUserInfos([]);
                               setUserInfoEnd(false);
                           } else if (/^[1-9](\d+)?$/.test(value)) {
                               // 手动更改uid后, 清空username选项
                               setUid(String(value));
                               uid2username(String(value)).then(setUsername)
                               setUserInfos([])
                               setUserInfoEnd(false);
                           } else {  // 不是正整数 => 不改变(变为上一次的值)
                               setUid(uid);
                               // 上一次是username搜索, 清空备选列
                               if (searchType === 'username2uid') {
                                   uid2username(uid).then(setUsername);
                                   setUserInfos([]);
                                   setUserInfoEnd(false);
                               }
                           }
                       }}></Input>
            </Row>
            <Row>
                {/* username输入框 */}
                <AutoComplete size={'small'} style={{width: '100%'}} showSearch={true} placeholder={'username'}
                              allowClear={true}
                              getPopupContainer={target => target} value={username}
                              disabled={searchType === 'uid2username' && uid !== ''}
                              onSearch={(keyword) => {
                                  setSearchType('username2uid');
                                  setUid('');
                                  setUsername(keyword);
                                  uu.username2infos(keyword).then(setUserInfos);
                                  setUserInfoEnd(false);
                              }}
                              onSelect={(uid) => {
                                  setSearchType('username2uid');
                                  setUid(uid);
                                  uid2username(uid).then(setUsername);
                              }}
                              onPopupScroll={(e) => {
                                  let target: any = e.target;
                                  if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
                                      // 滑动到底部
                                      if (!userInfoEnd) {
                                          if (username) {
                                              uu.username2infos(username, userInfos.length / 20 + 1).then(newInfos => {
                                                  if (newInfos.length === 0 || newInfos.length % 20 !== 0) {
                                                      setUserInfoEnd(true);
                                                  }
                                                  setUserInfos([...userInfos, ...newInfos]);
                                              })
                                          } else {
                                              setUserInfoEnd(true);
                                          }
                                      }
                                  }
                              }}>
                    {userInfos.map(result =>
                        <AutoComplete.Option key={result.uid}>
                            {result.username}
                        </AutoComplete.Option>)}
                </AutoComplete>
            </Row>
        </Col>
        <Col span={2}>
            {/* 按钮 */}
            <Button
                size={'small'}
                style={{width: '100%', height: '100%'}}
                block
                disabled={!uid || !username}
                icon={<PlusOutlined/>}
                onMouseUp={async (event) => {
                    if (event.button === 2) {
                        // 单击右键
                        switch (searchType) {
                            case 'username2uid':  // 清空
                                setUid('');
                                setUsername(undefined);
                                setUserInfos([]);
                                setUserInfoEnd(false);
                                break;
                            case 'uid2username':  // 取消准备
                                setSearchType('username2uid');
                                uu.username2infos(username ?? '').then(setUserInfos);
                                setUserInfoEnd(false);
                                break;
                        }
                    }
                }}
                onClick={async () => {
                    if (uid) {  // 有输入uid再处理
                        switch (searchType) {
                            case 'username2uid':  // 准备
                                setSearchType('uid2username');
                                break;
                            case 'uid2username':  // 添加
                                setUid('');
                                setUsername(undefined);
                                setUserInfos([]);
                                setUserInfoEnd(false);
                                commit(uid);
                                break;
                        }
                    }
                }}></Button>
        </Col>
    </>
}

export interface UidUsernameSearchViewProps {
    commit: (uid: string) => void;
}