import { SetStateAction, useContext, useRef, useState } from 'react';
import styles from './index.module.css';
import { Input, message } from 'antd';
import { isKeyword } from '@/utils/iskeyword';
import { AppContext } from '@/contex';

type Props = {
  onPressEnter: (e: any) => void,
  isPublic?: boolean;
}

export default function Textarea({ onPressEnter, isPublic = false }: Props) {
  const [value, setValue] = useState('');
  const { receUser } = useContext(AppContext)

  // 发送消息
  const handlePressEnter = (e: { preventDefault: () => void; }) => {
    if (!isPublic && isKeyword(receUser)) {
      message.error({ content: '用户名使用关键字！' })
      return;
    }
    onPressEnter(value)
    e.preventDefault();
    setValue('');
  };

  const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setValue(e.target.value);
  };

  return (
    <Input.TextArea
      className={styles.textarea}
      placeholder="按Enter发送消息（Shift + Enter 换行）"
      value={value}
      onChange={handleChange}
      onPressEnter={handlePressEnter}
      style={{ resize: 'none' }}
    ></Input.TextArea>
  );
}
