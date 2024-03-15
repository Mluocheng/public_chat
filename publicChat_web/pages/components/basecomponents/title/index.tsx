import { useCallback, useContext } from 'react';
import styles from './index.module.css';
import { AppContext } from '@/pages/contex';
import { Dropdown, DropdownProps, MenuProps, Space } from 'antd';
import iconDownMenu from '@/assets/downMenu.png';
import Image from 'next/image';
type Props = {
  title: string;
  isPublic?: boolean;
}

export default function Title({ title, isPublic = false }: Props) {
  const { receUser, setReceUser, receUsers, setFilterReceUser } = useContext(AppContext)

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setReceUser(e.key)
    setFilterReceUser(true)
  };

  // 渲染个人
  const renderPersonal = useCallback(() => {
    return (
      <>
        <input value={receUser} onChange={e => {
          setReceUser(e.target.value)
          setFilterReceUser(false)
        }} type="text" className={styles.inputusername} placeholder='接收用户' />
        <Dropdown
          menu={{
            items: receUsers,
            onClick: handleMenuClick,
          }}
        >
          <div className={styles.dropdown}>
            <Image
              src="/downMenu.png"
              alt="Description of the image"
              width={20}
              height={10}
            />
          </div>
        </Dropdown>
      </>
    )
  }, [receUser, receUsers])

  return (
    <div className={styles.title}>
      {title}
      {!isPublic && renderPersonal()}
    </div>
  );
}
