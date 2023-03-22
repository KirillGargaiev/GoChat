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
let userList = []


const onConnection = (socket) => {
    console.log('User connected')
    const {id} = socket.handshake.query

    socket.id = id
    socket.join(id)

    const onLoadMessages = (receiver) => {
        const messagesCluster = fs.readFileSync('./lib/messageData.json', 'utf-8')
        const messages = JSON.parse(messagesCluster)
        const privateMessages = messages.filter(el =>
            (el.sender.id === curUsr.id || el.sender.id === receiver.id) &&
            (el.receiver.id === receiver.id || el.receiver.id === curUsr.id)
        );
        socket.emit('message:loaded', {messages:privateMessages, sender:curUsr, receiver: receiver})
    }

    const onUserConnected = (list) => {
        socket.emit('users', list)
        }

    socket.on('message:load', onLoadMessages)

    socket.on('message:send', (data) => {
        const newMessage = {
            messageText: data.message,
            receiver: data.receiver,
            sender: curUsr
        }
        const messages = JSON.parse(fs.readFileSync('./lib/messageData.json', 'utf-8'))
        messages.push(newMessage)
        fs.writeFileSync('./lib/messageData.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) throw err;
        })
        onLoadMessages(data.receiver)
    })

    socket.on('authUser', (user) => {
        userList = JSON.parse(fs.readFileSync('./lib/userData.json', 'utf-8'))
        curUsr = user
        const isUserInList = userList.some(u => u.id === curUsr.id)
        if (!isUserInList) {
            userList.push(curUsr)
            fs.writeFile('./lib/userData.json', JSON.stringify(userList, null, 2), err => {
                if (err) throw err;
            })
        } else {
            const index = userList.findIndex(el => el.id === curUsr.id)
            userList[index].online = true
            fs.writeFile('./lib/userData.json', JSON.stringify(userList, null, 2), err => {
                if (err) throw err;
            })
        }
        console.log(user)
        onUserConnected(userList)
    })



    socket.on('disconnect', () => {
        userList = JSON.parse(fs.readFileSync('./lib/userData.json', 'utf-8'))
        const index = userList.findIndex(el => el.id === curUsr.id)
        console.log(curUsr)
        userList[index].online = false
        fs.writeFile('./lib/userData.json', JSON.stringify(userList, null, 2), err => {
            if (err) throw err;
        })
        console.log('User disconnected')
        socket.leave(id)
    })
}

io.on('connection', onConnection)

server.listen(5000, () => {
    console.log("Server works")
})

