import { useContext } from 'react';
import Textarea from '../basecomponents/textarea';
import Title from '../basecomponents/title';
import styles from './index.module.css';
import { AppContext } from '@/pages/contex';
import Message from '../basecomponents/message';

type Props = {
  messages: Message[]; // 替换为实际的类型定义
  onPressEnter: (value: string) => void;
}

export default function Left({ messages, onPressEnter }: Props) {
    const { contentHeight } = useContext(AppContext);
    const _messages = messages?.filter((item) => item.IsPublic) || [];


    return (
      <div className={styles.left}>
            <Title title='广场'  isPublic />
            <div className={styles.content} style={{ height: `${contentHeight}px` }}>
                <Message messages={_messages} isPublic/>
            </div>
            <Textarea onPressEnter={onPressEnter} isPublic />
      </div>
    );
  }
  