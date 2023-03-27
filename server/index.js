const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const fs = require('fs')
const app = express()
const {EchoBot, ReverseBot, SpamBot, IgnoreBot, generateRandomString} = require('./bots')


app.use(cors({origin: "*"}))

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
let curUsr = {}
let curReceiver = {}
let userList = []

const onConnection = (socket) => {

    console.log('User connected')
    const {id} = socket.handshake.query

    socket.id = id
    socket.join(id)


    const onLoadMessages = () => {
        const messagesCluster = fs.readFileSync('./lib/messageData.json', 'utf-8')
        const messages = JSON.parse(messagesCluster)
        const privateMessages = messages.filter(el =>
            (el.sender.id === curUsr.id || el.sender.id === curReceiver.id) &&
            (el.receiver.id === curReceiver.id || el.receiver.id === curUsr.id)
        );
        socket.local.emit('message:loaded', {messages:privateMessages, user:curUsr, receiver: curReceiver})
    }

    const onUserConnected = (list) => {
        io.emit('users', list)
        }

    socket.on('message:load', onLoadMessages)

    socket.on('setCurrentReceiver', (user)=>{curReceiver = user})

    socket.on('message:send', (data) => {
        console.log(data)
        let newMessage = {}
        if(!data.sender){
            newMessage = {
                messageText: data.message,
                receiver: data.receiver,
                sender: curUsr
            }
        } else {
            newMessage = {
                messageText: data.message,
                sender: data.sender,
                receiver: data.receiver
            }

        }
        const messages = JSON.parse(fs.readFileSync('./lib/messageData.json', 'utf-8'))
        messages.push(newMessage)
        fs.writeFileSync('./lib/messageData.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) throw err;
        })
        if (!data.sender){
            onLoadMessages()
        } else {
            onLoadMessages()
        }
    })

    socket.on('authUser', (user) => {
        userList = JSON.parse(fs.readFileSync('./lib/userData.json', 'utf-8'))
        curUsr = user
        socket.emit('authorized', user)
        const index = userList.findIndex(el => el.id === curUsr.id)
        if (index !== -1) {
            userList[index].online = true
            fs.writeFile('./lib/userData.json', JSON.stringify(userList, null, 2), err => {
                if (err) throw err;
            })
            } else {
            userList.push(curUsr)
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
        onUserConnected(userList)
        socket.leave(id)
    })
}

io.on('connection', onConnection)

server.listen(5000, () => {
    console.log("Server works")
})

