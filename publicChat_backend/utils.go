package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

// 解析base64图片
func (user *User) EncodingBase64() error {
	if user.IsImg {
		splits := strings.Split(user.Pic, ",")
		// 截取文件后缀
		imgType := splits[0][strings.LastIndex(splits[0], "/")+1 : strings.LastIndex(splits[0], ";")]
		imgType = strings.Replace(imgType, "e", "", -1) // jpeg 去掉 e，改成jpg格式
		// 解码base64图片数据
		imageBytes, err := base64.StdEncoding.DecodeString(strings.Replace(user.Pic, splits[0]+",", "", 1))
		if err != nil {
			fmt.Println(err)
			return err
		}
		dirPath := "img"
		// 创建目录
		err = os.MkdirAll(dirPath, os.ModePerm)
		if err != nil {
			fmt.Println(err)
			return err
		}
		// 拼接图片路径
		//savePath := "聊天室/main/img/" + user.Name + "." + imgType
		imgPath := dirPath + "/" + user.Name + "." + imgType // 相对路径
		// 保存图片到服务器
		err = os.WriteFile(imgPath, imageBytes, 0644)
		if err != nil {
			fmt.Println(err)
			return err
		}
		user.Pic = imgPath
	}
	return nil
}

// 解析消息的方法（将客户端返回的消息解析）
func (msg *Msg) ParseMessage(message []byte) error {
	fmt.Println(string(message))
	err := json.Unmarshal(message, msg)
	if err != nil {
		fmt.Println(err)
	}
	return nil
}

// 编码消息（将服务端消息发送给客户端）
func (msg *Msg) EncodeMessage() []byte {
	b, _ := json.Marshal(msg) // 直接将对象返回过去
	return b
}
