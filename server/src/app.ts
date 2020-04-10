import * as cors from 'cors';
import * as express from 'express';
import { Server } from 'http';
import * as morgan from 'morgan';
import * as socketio from 'socket.io';
import { PORT } from './config';
import { dispatchEvents } from './router';
import { logger, LoggerStream } from './utils/logger';

const app = express();
const server = new Server(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sockets with socket.io
const io = socketio(server);
io.on('connection', dispatchEvents);

// Logging
app.use(morgan('combined', { stream: new LoggerStream() }));

server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
