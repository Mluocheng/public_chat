'use client';

import styles from './index.module.css';
import Header from "./header";
import Left from "./left";
import Right from "./right";
import { useContext, useEffect, useRef, useState } from 'react';
import { getCurrentTime } from '../utils/getCurrentTime';
import { AppContext } from '../contex';
import { message } from 'antd';
import { mapToJson } from '../utils/mapToJson';
import { useWebSocket } from "ahooks";
import { isKeyword } from '../utils/iskeyword';

export default function Layout() {
    const { receUser, user, avatar, receUsers, setAvatar, setUser, setReceUser, setReceUsers } = useContext(AppContext)
    const [messages, setMessages] = useState<Message[]>([]);
    const [url, setUrl] = useState('');

    const {
        readyState,
        sendMessage,
        latestMessage,
        connect,
        disconnect,
    } = useWebSocket(url, {
        manual: true, // 禁止自动连接
        reconnectLimit: 10, // 断开后重连次数,-1为无限重连
        reconnectInterval: 5000, // 重连间隔时间
    });

    useEffect(() => {
        if (latestMessage) {
            const data: Message = JSON.parse(latestMessage.data);
            setMessages((prevMessages) => prevMessages.concat(data));
            // 私聊消息用户不在receUsers， 将用户添加到receUsers
            if (!data.IsPublic) {
                if ((receUsers.length == 0) || !receUsers.find(item => item.label === data.SendUser)) {
                    setReceUsers([...receUsers, { label: data.SendUser, key: data.SendUser }])
                }
            }
        }
    }, [latestMessage])

    function onLogin(params: { user: any; pic: any; }) {
    
        const { user: _user, pic: _pic } = params;
        const pic = _pic ? _pic : _user?.slice(0, 2)
        const jsonData = { Name: _user, Pic: pic, IsImg: !!_pic } // 准备要发送的JSON数据
        const jsonStr = JSON.stringify(jsonData) // 将JSON数据转换为字符串
        const fullUrl = `ws://localhost:34005/web-socket?data=${encodeURIComponent(jsonStr)}`;
        setUrl(fullUrl);
        setTimeout(() => { connect() }, 0)
        message.info({ content: '登录成功！' })
    }

    function onPressEnterPublic(msg: string, isPublic: boolean) {
 
        if (!isPublic) addReceUsers();
        var m = new Map() // 空Map
        var sendUser = user; //发送者
        if (msg === '') {
            message.error({ content: '不能发送空消息', type: 'error' })
            return
        }
        var currentTime = getCurrentTime()
        m.set('SendUser', user)
        m.set('SendTime', currentTime)
        m.set('Msg', msg)
        m.set('IsSend', true)
        m.set('IsPublic', isPublic)
        if (!isPublic) {
            if (receUser === '') {
                message.error({ content: '私聊对象不能为空', type: 'error' })
                return
            }
            m.set('ReceUser', receUser)
        } else {
            m.set('ReceUser', '')
        }
        m.set('IsImg', !!avatar)
        m.set(
            'Pic',
            !!avatar
                ? avatar
                : sendUser?.slice(0, 2)
        )
        var json = mapToJson(m) // map转json
        sendMessage(JSON.stringify(json))
        json['SendUser'] = '我'
        setMessages([...messages, json])
    }

    function addReceUsers() {
        if (receUser && !receUsers.find(item => item.label === receUser)) {
            setReceUsers([...receUsers, { label: receUser, key: receUser }])
        }
    }

    function onLogout() {
        setUser('')
        setAvatar('')
        setReceUser('')
        setMessages([])
        disconnect()
    }

    return (
        <div className={styles.layout}>
            <Header onLogin={(params) => onLogin(params)} onLogout={onLogout} />
            <div className={styles.body}>
                <Left messages={messages} onPressEnter={(v) => onPressEnterPublic(v, true)} />
                <div className={styles.space} />
                <Right messages={messages} onPressEnter={(v) => onPressEnterPublic(v, false)} />
            </div>
        </div>
    );
}
