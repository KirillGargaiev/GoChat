import {useEffect, useRef, useState} from "react";
import io from 'socket.io-client'
import {nanoid} from 'nanoid'
import {useLocalStorage} from './useLocalStorage'
import {useBeforeUnload} from "./useBeforeUnload";

const SERVER_URL = 'http://localhost:5000'

export const useChat = (userIdentifier) => {
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])

    const [userId] = useLocalStorage('userId', nanoid(8))
    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io(SERVER_URL, {
            query: {userIdentifier}
        })
        socketRef.current.emit('user:add', {userId})

        socketRef.current.on('users', (users) => {
            setUsers(users)
        })
        socketRef.current.emit('message:get')
        socketRef.current.on('messages', (messages) => {
            const newMessages = messages.map((el)=>el.userId === userId ? {...el, currentUser: true} : el)
            setMessages(newMessages)
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [userIdentifier, userId])

    const sendMessage = ({messageText, senderName}) => {
        socketRef.current.emit('message:add', {
            userId,
            messageText,
            senderName
        })
    }
    const removeMessage = (id) => {
        socketRef.current.emit('message:remove', id)
    }
    useBeforeUnload(()=>{
        socketRef.current.emit('user:leave', userId)
    })
    return {users, messages, sendMessage, removeMessage}
}