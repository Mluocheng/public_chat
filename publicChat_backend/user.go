package main

import (
	"container/list"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gorilla/websocket"
)

// 用户上线
func goLive(user User) {
	users[user.Name] = user
	str := fmt.Sprintf("%s 加入聊天室，当前聊天室人数为 %d。", user.Name, len(users))
	fmt.Println(str)
	// 发送上线消息给其他用户
	msg := Msg{
		SendUser: user.Name,
		SendTime: time.Now().Format("2006-01-02 15:04:05"), // 日期格式化为 yyyy-MM-dd HH:mm:ss 格式
		Msg:      str,
		IsPublic: true,
		IsRece:   true,
		IsSend:   false,
		IsImg:    user.IsImg,
		Pic:      user.Pic,
	}
	publicMessage(msg)
	privateMessageHandle(user)
}

// 用户上线，处理自己的私信消息
func privateMessageHandle(user User) {
	// 用户上线时，遍历消息列表，看是否有当前上线用户的未处理的私信
	var next *list.Element
	for el := msgs.Front(); el != nil; el = next {
		next = el.Next()
		v := el.Value.(Msg) // 用户上线处理这个用户的私信消息
		if v.ReceUser == user.Name && !v.IsRece {
			err := user.Conn.WriteMessage(websocket.TextMessage, v.EncodeMessage())
			if err != nil {
				log.Println(err)
			}
			msgs.Remove(el) // 处理完成后，将这条私信从消息列表中移除
		}
	}
}

// 用户下线
func offLine(user User) {
	name := user.Name
	removeUser(user) // 删除用户
	str := fmt.Sprintf("%s 离开了聊天室，当前聊天室人数为 %d。", name, len(users))
	fmt.Println(str)
	// 发送下线消息给其他用户
	msg1 := Msg{
		SendUser: name,
		SendTime: time.Now().Format("2006-01-02 15:04:05"),
		Msg:      str,
		IsPublic: true,
		IsRece:   true,
		IsSend:   false,
		IsImg:    user.IsImg,
		Pic:      user.Pic,
	}
	publicMessage(msg1)
}

// 用户下线删除用户
func removeUser(user User) {
	for _, v := range users {
		if v.Name == user.Name {
			os.Remove(user.Pic) // 删除头像文件
			delete(users, v.Name)
			break
		}
	}
}
