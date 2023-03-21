import React, {useEffect, useState} from 'react';
import styles from '../styles/main.module.css'
import images from '../images'

const Chat = (props) => {

    useEffect(() => {
        props.socket.on('users', (users) => {
            setUsers(users)
        })
    }, [props.socket])

    useEffect(()=>{
        props.socket.on('message:loaded', (messages) => {
            setMessages(messages)
        })
    }, [props.socket])

    const [activeReceiver, setActiveReceiver] = useState(null)
    const [messages, setMessages] = useState('')
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState(props.user)

    console.log("Printing messages")
    console.log(messages)

    function sendMessage(data) {
        if (data.trim().length > 0)
            props.socket.emit('message:send', {message: data.trim(), receiver: activeReceiver})
        setMessage('')
    }


    function handleMessage(user) {
        setActiveReceiver(user)
        props.socket.emit('message:load', user)
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
                            <img className={styles.chat__img} src={images[props.user.img]} alt="img"/>
                            <div className={styles.chat__description}>
                            </div>
                        </div>
                        <div className={styles.chat__field}>
                            <div className={styles.chat__messages}>
                                {messages.length>0 && messages.map((item) => (
                                    <div className={item.receiver.id === activeReceiver.id ? styles.chat__messageReceiver : styles.chat__messageSender}>{item.messageText}</div>
                                ))
                                }
                            </div>
                            <div className={styles.chat__inputField}>
                                <input className={styles.chat__input} value={message}
                                       onKeyDown={event => {if(event.key === 'Enter'){  sendMessage(message) }}}
                                       onChange={event => setMessage(event.target.value)}/>
                                <button disabled={activeReceiver === null}  onClick={() => sendMessage(message)}
                                        className={styles.chat__inputButton}> Send
                                </button>
                            </div>
                        </div>
                    </div>
                    {users.length > 1 &&
                        <div className={styles.chat__list}>
                            {users.filter(el => el.id !== props.user.id).map((user) => (
                                <div onClick={() => handleMessage(user)}
                                     className={activeReceiver === user ? styles.chat__listItemActive : styles.chat__listItem}
                                     key={user.id}>{user.username}</div>
                            ))}
                        </div>
                    }
                </div>
            </main>
        </div>
    );
};

export default Chat;
