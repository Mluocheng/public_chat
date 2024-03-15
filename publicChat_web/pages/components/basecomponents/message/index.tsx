import { useContext } from 'react';
import styles from './index.module.css';
import { AppContext } from '@/pages/contex';

type Props = {
  messages: Message[];
  isPublic?: boolean;
};

export default function Message({ messages, isPublic = false }: Props) {
  const { user } = useContext(AppContext);

  // 渲染头像
  const renderAvatar = (item: Message) => {
    return <>
      {item.IsImg ? <img src={item.Pic} width="50" /> : <span>{item.Pic}</span>}
    </>;
  }

  // 消息体渲染
  const renderMessage = (item: Message) => {
    let content = <></>
    if (isPublic) {
      // 公共消息右边
      if ((item['SendUser'] == user) || (item['SendUser'] == '我')) {
        content = (
          <div className={`${styles.content} ${styles.publicMessageRight}`}>
            <div className={styles.contentTitle}>
              <span>{item.SendTime}</span>
              <span className={styles.sendUser}> {item.SendUser}</span>
            </div>
            <div className={styles.contentDetail}>{item.Msg}</div>
          </div>
        )
      } else {
        // 公共消息左边
        content = (
          <div className={`${styles.content} ${styles.publicMessageLeft}`}>
            <div className={styles.contentTitle}>
              <span className={styles.sendUser}>{item.IsSend? item.SendUser : ''} </span>
              <span>{item.SendTime}</span>
            </div>
            <div className={styles.contentDetail}>{item.Msg}</div>
          </div>
        )
      }


    } else {
      // 个人消息右边
      if (item.SendUser === "我") {
        content = (
          <div className={`${styles.content} ${styles.privateMessageRight}`}>
            <div className={styles.contentTitle}>
              <span>{item.SendTime}</span>
              <span className={styles.sendUser}> {item.SendUser}</span>
              <span>发给</span>
              <span className={styles.receUser}>{item.ReceUser}</span>
            </div>
            <div className={styles.contentDetail}>{item.Msg}</div>
          </div>
        )
      } else {
        // 个人消息左边
        content = (
          <div className={`${styles.content} ${styles.privateMessageLeft}`}>
            <div className={styles.contentTitle}>
              <span className={styles.receUser}>{item.SendUser}</span>
              <span>发给</span>
              <span className={styles.sendUser}>{item.ReceUser === user ? '我': item.ReceUser} </span>
              <span>{item.SendTime}</span>
            </div>
            <div className={styles.contentDetail}>{item.Msg}</div>
          </div>
        )
      }

    }

    return content
  }

  if (!messages.length) return <></>
  return messages?.map((item, index) => {
    const isRight = ((item.SendUser == "我") || (item.SendUser === user));

    return (
      <div key={`leftMessage${isPublic ? 'public' : ''}${index}`} className={`${styles.messageItem} ${isRight ? styles.messageItemRight : styles.messageItemLeft}`}>
        {!isRight && <div className={`${styles.ava} ${styles.leftAva}`}>{renderAvatar(item)}</div>}
        {renderMessage(item)}
        {isRight && <div className={`${styles.ava} ${styles.rightAva}`}>{renderAvatar(item)}</div>}
      </div>
    )
  })
}
