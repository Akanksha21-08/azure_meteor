const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const app = require('./app');
const initSocket = require('./socket/socketHandler');

connectDB();

const PORT = process.env.PORT || 5000;

// Wrap Express in an HTTP server so Socket.io can share it
const server = http.createServer(app);

// Attach Socket.io with CORS matching the app config
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.CLIENT_URL,
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Reconnection settings
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Make io accessible in Express controllers via app.get('io')
app.set('io', io);

// Boot all socket event handlers
initSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.io running on port ${PORT}`);
});
