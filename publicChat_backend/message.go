package main

import (
	"log"

	"github.com/gorilla/websocket"
)

// 公共消息
func publicMessage(msg Msg) {
	for _, user := range users {
		// 当 msg.IsSend 为true时，说明是发送消息，则必须判断 user.Name != msg.SendUser
		if user.Conn != nil && ((msg.IsSend && user.Name != msg.SendUser) || !msg.IsSend) {
			err := user.Conn.WriteMessage(websocket.TextMessage, msg.EncodeMessage())
			if err != nil {
				log.Println(err)
			}
		}
	}
}

// 发送私聊消息给指定用户
func privateMessage(msg Msg) {
	for _, user := range users {
		if user.Name == msg.ReceUser && user.Conn != nil { // 当接收人在线时
			// 发送私聊消息
			err := user.Conn.WriteMessage(websocket.TextMessage, msg.EncodeMessage())
			if err != nil {
				log.Println(err)
			}
			msg.IsRece = true // 将 IsRece 设置为true
			break
		}
	}
	if !msg.IsRece { // 只有接收人离线时，才将消息存到消息列表中
		msgs.PushBack(msg)
	}
}
