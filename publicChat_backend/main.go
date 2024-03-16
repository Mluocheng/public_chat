package main

import (
	"container/list"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
)

type User struct {
	Name  string
	Pic   string
	IsImg bool
	Conn  *websocket.Conn
}

type Msg struct {
	SendUser string // 发送人
	ReceUser string // 接收人
	SendTime string // 发送时间
	Msg      string // 消息内容
	IsPublic bool   // 消息类型是否是公开的 true 公开 false 私信
	IsRece   bool   // 接收人是否接收成功 true 接收成功 false 离线还未接收（当接收人离线时，设置为false，当对方上线时，将消息发过去，改为true）
	IsSend   bool   // 是否是发送消息，用于区分发送消息和上线下线消息（true 发送消息 false 上线/下线消息）
	IsImg    bool   // 头像是否是图片
	Pic      string // 头像图片地址
}

var users = make(map[string]User) // 用户列表，用户名作为key
var msgs = list.New()             // 消息列表（用于存储私信消息）
var port = "34001"                // 端口号
var envVar = os.Getenv("ENV_VAR")

// 定义WebSocket连接的升级器。升级器是一个http.HandlerFunc，它将HTTP连接升级为WebSocket连接
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func test(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, World!"))
}

func main() {
	fmt.Println("当前环境：", envVar)

	http.HandleFunc("/test", test)
	http.HandleFunc("/web-socket", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("err====>>>", err)
			return
		}
		go handleConnection(conn, r)
	})

	// log.Fatal(http.ListenAndServe(":"+port, nil))

	certFile := "./ssl/luocheng.fun.pem"
	keyFile := "./ssl/luocheng.fun.key"

	// 本地开发使用自签名证书

	if envVar == "dev" {
		certFile = "./ssl/localhost.crt"
		keyFile = "./ssl/localhost.key"
	}
	fmt.Println("starting server:", ":"+port)
	ListenAndServeTLSErr := http.ListenAndServeTLS(":"+port, certFile, keyFile, nil)
	if ListenAndServeTLSErr != nil {
		fmt.Println("Error starting server:", ListenAndServeTLSErr)
	}

}

func handleConnection(conn *websocket.Conn, r *http.Request) {
	defer conn.Close()
	user := User{}
	data := r.FormValue("data") // 获取连接的数据
	err := json.Unmarshal([]byte(data), &user)
	if err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte("连接发生错误"))
		return
	}
	_, ok := users[user.Name]
	if ok { // 当用户已经在线时，不允许重复连接
		conn.WriteMessage(websocket.TextMessage, []byte("该用户已连接，不允许重复连接"))
		return
	}
	err = user.EncodingBase64() // 解码用户头像
	if err != nil {
		conn.WriteMessage(websocket.TextMessage, []byte("连接发生错误"))
		return
	}
	// 用户上线
	user.Conn = conn
	goLive(user)
	// 处理消息
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			conn.WriteMessage(websocket.TextMessage, []byte("连接已关闭"))
			log.Println(conn.RemoteAddr().String(), "关闭连接", err)
			break
		}
		// 解析消息
		msg := Msg{}
		err = msg.ParseMessage(message)
		if err != nil {
			log.Println(err)
			break
		}
		if msg.IsPublic {
			// 群聊消息
			publicMessage(msg)
		} else {
			// 私聊消息
			privateMessage(msg)
		}
	}
	offLine(user)
}
