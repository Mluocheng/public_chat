import { FC, createContext, useEffect, useMemo, useState } from 'react';
interface AppProviderProps {
    children: React.ReactNode; // 定义children属性应为React节点
}

// 定义Context中的数据类型
interface AppContextState {
    text?: string;
    avatar?: string;// 头像
    user?: string;// 当前用户
    receUser?: string;// 接收用户
    contentHeight?: number;// 内容高度
    receUsers: { key: string, label: string }[];// 接收用户列表
    filterReceUser: boolean,
    setFilterReceUser: (filterReceUser: boolean) => void;
    setReceUsers: (receUsers: { key: string, label: string }[]) => void;
    setAvatar: (avatar: string) => void;
    setUser: (user: string) => void;
    setReceUser: (receUser: string) => void;
}

// 创建一个Context对象，初始值可以根据需要设置
const AppContext = createContext<AppContextState>({
    text: 'Hello, World!',
    avatar: "",
    user: "",
    receUser: "",
    contentHeight: 0,
    receUsers: [],
    filterReceUser: false,
    setFilterReceUser: () => { },
    setReceUsers: () => { },
    setReceUser: () => { },
    setUser: () => { },
    setAvatar: () => { },
});

// 创建一个Provider组件
const AppProvider: FC<AppProviderProps> = ({ children }: AppProviderProps) => {
    const [avatar, setAvatar] = useState("");
    const [user, setUser] = useState("");
    const [receUser, setReceUser] = useState(""); // 当前消息对象 私聊
    const [receUsers, setReceUsers] = useState<{ key: string, label: string }[]>([{ key: "ALL", label: "ALL" }]); // 所有消息对象 私聊
    const [filterReceUser, setFilterReceUser] = useState<boolean>(false); // 是否过滤了用户消息
    const [windowHeight, setWindowHeight] = useState(0);
    const [socket, setSocket] = useState<any>();

    useEffect(() => {
        const updateHeight = () => {
            setWindowHeight(window.innerHeight);
        };
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);



    const store: AppContextState = useMemo<AppContextState>(() => {
        return {
            text: 'Hello, World!',
            avatar: avatar,
            user: user,
            receUser: receUser,
            contentHeight: windowHeight - 40 - 46 - 20 - 48 - 46 - 20,
            socket: socket,
            receUsers: receUsers,
            filterReceUser: filterReceUser,
            setFilterReceUser,
            setReceUsers,
            setSocket,
            setReceUser,
            setUser,
            setAvatar
        }
    }, [avatar, filterReceUser, receUser, receUsers, socket, user, windowHeight])

    return (
        <AppContext.Provider value={store}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
