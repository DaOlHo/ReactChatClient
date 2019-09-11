import io from 'socket.io-client'
const socket = io.connect('ws://dropideas.com', { path: '/chatserver' })

function subscribeToMsgs(cb) {
    socket.on('msgs', msgs => cb(null, msgs))
    socket.emit('subscribeToMsgs')
}

function sendMsg(msg) {
    socket.emit('sendMsg', msg)
}

export { subscribeToMsgs, sendMsg }