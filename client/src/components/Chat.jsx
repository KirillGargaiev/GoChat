import React, {useEffect, useState} from 'react';
import styles from '../styles/main.module.css'
import images from '../images'

const Chat = ({socket, user}) => {

    const [currentUser, setCurrentUser] = useState(null)
    const [activeReceiver, setActiveReceiver] = useState(null)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState(user)
    const [filteredUsers, setFilteredUsers] = useState('')
    const [searchValue, setSearchInput] = useState('')


    useEffect(() => {
        socket.on('users', (users) => {
            setUsers(users)
            setFilteredUsers(users)
        })
        socket.on('message:loaded', (data) => {
            setMessages(data.messages)
            setCurrentUser(data.sender)
        })
    }, [socket])

    function sendMessage(data) {
        if (!data.trim()) return;
        socket.emit('message:send', {message: data.trim(), receiver: activeReceiver})
        setMessage('')
    }

    const searchItems = (searchValue) => {
        setSearchInput(searchValue)
        setFilteredUsers(users.filter(item => Object.values(item).join('').toLowerCase().includes(searchValue)))
    }

    function handleMessage(user) {
        setActiveReceiver(user)
        socket.emit('message:load', user)
    }

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <div className={styles.header__title}>
                    Chat bots 2.0
                </div>
            </header>
            <main className={styles.main}>
                <div className={styles.main__content}>
                    <div className={styles.chat__container}>
                        <div className={styles.chat__info}>
                            <img className={styles.chat__img} src={images[user.img]} alt="img"/>
                            <div className={styles.chat__description}>
                            </div>
                        </div>
                        <div className={styles.chat__field}>
                            <div className={styles.chat__messages}>
                                {!!messages.length && messages.map((item) => (
                                    <div
                                        className={item.receiver.id === activeReceiver.id ? styles.chat__messageReceiver : styles.chat__messageSender}>{item.messageText}</div>
                                ))
                                }
                            </div>
                            <div className={styles.chat__inputField}>
                                <input className={styles.chat__input} value={message}
                                       onKeyDown={event => {
                                           if (event.key === 'Enter') {
                                               sendMessage(message)
                                           }
                                       }}
                                       onChange={event => setMessage(event.target.value)}/>
                                <button disabled={activeReceiver === null} onClick={() => sendMessage(message)}
                                        className={styles.chat__inputButton}> Send
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.chat__list}>
                        <div className={styles.chat__listOptions}>
                            <div onClick={() => setFilteredUsers(users.filter(item => item.online))}
                                 className={styles.chat__listOption}>Online
                            </div>
                            <div onClick={() => setFilteredUsers(users)} className={styles.chat__listOption}>All</div>
                        </div>
                        <div className={styles.chat__listWrap}>
                            {filteredUsers.length >= 1 && filteredUsers.filter(el => el.id !== user.id).map((user) => (
                                <div onClick={() => handleMessage(user)}
                                     className={activeReceiver === user ? styles.chat__listItemActive : styles.chat__listItem}
                                     key={user.id}>{user.username}</div>
                            ))}
                        </div>
                        <div className={styles.chat__searchInputField}><input className={styles.chat__searchInput} placeholder='Search user'
                               onChange={(e) => searchItems(e.target.value)}/></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Chat;
