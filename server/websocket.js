const ws = require('ws')

const wss = new ws.Server({
    port: 5000
}, () => console.log('Server started on 5000'))

const broadcastMessage = (message) => {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(message))
    })
}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        message = JSON.parse(message)
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            case 'connection':
                broadcastMessage(message)
                break;
        }
    })
})
