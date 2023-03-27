import React, {useEffect} from 'react';
import {io} from 'socket.io-client';
import WebFont from "webfontloader";
import {getUser} from "../utils/service";
// components
import Chat from "./Chat";

const App = () => {
    const [socket, setSocket] = React.useState(null)
    const [user, setUser] = React.useState(null)
    useEffect(() => {
        WebFont.load({
            google: {
                families: ['Poppins', 'Open-Sans']
            }
        });
        const newSocket = io("http://localhost:5000", {
            forceNew: true,
            handshake: true,
            reconnection: true,
            reconnectionDelay: 3000,
            reconnectionAttempts: 20,
        })
        const _user = getUser()
        setSocket(newSocket)
        setUser(_user)
        //waiting for socket listeners
        const timeout = setTimeout(() => {
            newSocket.emit('authUser', _user)
            clearTimeout(timeout)
        }, 100)
    }, [])
    if (!user) return null
    return (
        <div>
            <Chat socket={socket} user={user}/>
        </div>
    );
};

export default App;