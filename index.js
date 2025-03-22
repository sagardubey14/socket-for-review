const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.io server running!');
});
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('message', (msg) => {
        console.log('Received message: ' + msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('HTTP Server listening on port 3000');
});