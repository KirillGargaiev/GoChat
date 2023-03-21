const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const fs = require('fs')
const app = express()

app.use(cors({origin: "*"}))

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
let curUsr = {}
const userList = [{
    id: 'bb0bfc56-621d-4a7f-bfec-e23a9a3c0346',
    username: "yellow lion",
    img: 'avatar1',
    online: false
}, {
    id: '4b6ee714-00ff-4ae0-be46-04f7427aea4f',
    username: 'gray_lion',
    img: 'avatar2',
    online: false
}
]

function changeStatus(user) {
    for (let el of userList) {
        if (el.id === user.id) {
            el.online = false
        }
    }
}

const onConnection = (socket) => {
    console.log('User connected')

    const {id} = socket.handshake.query

    socket.id = id
    socket.join(id)

    socket.on('message:load', (receiver) => {
        const messagesData = JSON.parse(fs.readFileSync('messageData.json', 'utf-8'))
        const privateMessages = messagesData.filter(el => (el.sender.id === curUsr.id || el.sender.id === receiver.id)
            && (el.receiver.id === receiver.id || el.receiver.id === curUsr.id))
        socket.emit('message:loaded', privateMessages)
    })

    socket.on('message:send', (data) => {
        const message = {
            messageText: data.message,
            receiver: data.receiver,
            sender: curUsr
        }
        const messagesData = JSON.parse(fs.readFileSync('messageData.json', 'utf-8'))
        messagesData.push(message)
        fs.writeFile('messageData.json', JSON.stringify(messagesData, null, 2), (err) => {
            if (err) throw err;
        })
        socket.emit('message:load')
    })

    socket.on('authUser', (user) => {
        curUsr = user
        const isUserInList = userList.some(u => u.id === curUsr.id)
        if (!isUserInList) {
            userList.push(curUsr)
        }
        console.log(user)
        socket.emit('users', userList)
    })


    socket.on('disconnect', () => {
        socket.emit('userUnload')
        changeStatus(curUsr)
        console.log('User disconnected')
        socket.leave(id)
    })
}

io.on('connection', onConnection)

server.listen(5000, () => {
    console.log("Server works")
})

