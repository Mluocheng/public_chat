import { useContext, useMemo } from 'react';
import Textarea from '../basecomponents/textarea';
import Title from '../basecomponents/title';
import styles from './index.module.css';
import { AppContext } from '@/pages/contex';
import Message from '../basecomponents/message';

type Props = {
    messages: Message[],
    onPressEnter: (value: string) => void;
}

export default function Right({ messages, onPressEnter }: Props) {
    const { contentHeight, receUser, filterReceUser } = useContext(AppContext);
   
    const data = useMemo(() => {
        const _messages = messages?.filter((item) => !item.IsPublic) || [];

        if(filterReceUser && (receUser?.toLocaleLowerCase() !== "all")) {
            return _messages.filter((item) => (item.ReceUser === receUser) || (item.SendUser === receUser))
        } else{
            return _messages
        }
    }, [filterReceUser, messages, receUser])
    // const onPressEnter = (value: string) => {
    //     console.log(value)
    // }
    return (
        <div className={styles.right}>
            <Title title='个人' />
            <div className={styles.content} style={{ height: `${contentHeight}px` }}>
                <Message messages={data} />
            </div>
            <Textarea onPressEnter={onPressEnter} />
        </div>
    );
}
