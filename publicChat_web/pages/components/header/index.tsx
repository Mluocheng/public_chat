import { useContext, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { AppContext } from '@/contex';
import Button from '../basecomponents/button';
import styles from './index.module.css';
import { isKeyword } from '@/utils/iskeyword';

type Props = {
  onLogin: (params: { user: string, pic: string }) => void;
  onLogout: () => void;
}

export default function Header({ onLogin, onLogout }: Props) {
  const { user, avatar, setAvatar, setUser } = useContext(AppContext)
  const [name, setName] = useState<string>("");
  const [_ava, set_ava] = useState<string>("");
  const inputRef = useRef<any>(null);

  // 登录
  function handleLogin() {
    if (isKeyword(name)) {
      message.error({ content: '用户名使用关键字！' })
      setUser("")
      return;
    }
    if(!name) return;
    if (user) return;
    setUser(name)
    onLogin({ user: name, pic: _ava })
  }

  // 退出
  function handleLogout() {
    if(!user) return; 
    message.info({ content: '退出登录！' })
    setName("")
    onLogout();
  }

  // 选择头像
  function handleFileChange(e: any) {
    let fileSuffix = '';
    if (avatar) {
      return;
    }
    if (e.target.files.length > 0) {
      var selectedImage = e.target.files[0]

      var fileSize = selectedImage.size / 1024 // 转换为KB
      if (fileSize > 1024) {
        message.error({ content: '文件大小不得超过1MB！' })
        return
      }
      var name = selectedImage.name
      fileSuffix = name.slice(name.lastIndexOf('.')).replace('e', '') // 获取文件后缀
      var fileReader = new FileReader()
      fileReader.readAsDataURL(selectedImage) // 文件读取为url
      fileReader.onload = function (e: any) {
        setAvatar(e.target.result)
        set_ava(e.target.result)
      }
    }
  }

  return (
    <div className={styles.haeder}>
      <input disabled={!!user} value={name} onChange={e => setName(e.target.value)} type="text" className={styles.inputusername} placeholder='用户名' />
      {avatar ?
        <div className={styles.avaImgBox}><img className={styles.avaImg} src={avatar} alt="" /></div> :
        <div className={styles.ava} onClick={() => inputRef?.current?.click()}>
          <input type="file" className={styles.inputFile} ref={inputRef} onChange={handleFileChange} />
          <div>头像</div>
        </div>
      }
      <Button type="submit" text="登录" onClick={handleLogin} className={styles.leftBtn} />
      <Button type="submit" text="退出" onClick={handleLogout} />
    </div>
  );
}
