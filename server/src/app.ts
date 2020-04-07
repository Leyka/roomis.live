import * as cors from 'cors';
import * as express from 'express';
import { Server } from 'http';
import * as morgan from 'morgan';
import * as socketio from 'socket.io';
import { PORT } from './config';
import { LoggerStream } from './logger';
import { handleSocketEvents } from './sockets/handler';

const app = express();
const server = new Server(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging
app.use(morgan('combined', { stream: new LoggerStream() }));

// Sockets
io.on('connection', handleSocketEvents);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
