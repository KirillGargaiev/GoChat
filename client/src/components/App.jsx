import React, {useEffect} from 'react';
import Chat from "./Chat";
import {io} from 'socket.io-client';
import WebFont from "webfontloader";
import {checkUser} from "../utils/service";


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
        const _user = checkUser()
        newSocket.emit('authUser', _user)
        setSocket(newSocket)
        setUser(_user)
    }, [])
    if (!user) return null
    return (
        <div>
            <Chat socket={socket} user={user} />
        </div>
    );
};

export default App;