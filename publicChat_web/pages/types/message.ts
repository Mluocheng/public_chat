type Message = {
    "SendUser": string, // 发送人
    "SendTime": string, // 发送时间
    "Msg": string, //  消息内容
    "IsSend": boolean, //  // 是否是发送消息，用于区分发送消息和上线下线消息（true 发送消息 false 上线/下线消息）
    "IsPublic": boolean, // 消息类型是否是公开的 true 公开 false 私信
    "ReceUser": string, // 接收人
    "IsImg": boolean, // 头像是否是图片
    "Pic": string, // 头像图片地址
}