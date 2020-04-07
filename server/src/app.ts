import * as cors from 'cors';
import * as express from 'express';
import { Server } from 'http';
import * as morgan from 'morgan';
import * as socketio from 'socket.io';
import { PORT } from './config';
import { handleSocketEvents } from './sockets/handler';
import { LoggerStream } from './utils/logger';
import { RedisManager } from './utils/redis';

const app = express();
const server = new Server(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sockets with socket.io
const io = socketio(server);
io.on('connection', handleSocketEvents);

// Start redis
if (RedisManager.isStarted) {
  console.log('Redis is listening on port 6379');
}
// Logging
app.use(morgan('combined', { stream: new LoggerStream() }));

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
