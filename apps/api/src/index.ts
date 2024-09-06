import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { PORT, SOCKET_IO_ORIGIN } from './config';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: SOCKET_IO_ORIGIN,
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
