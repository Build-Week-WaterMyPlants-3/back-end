const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const restricted = require('./middleware/restricted');

const authRouter = require('./users/usersRouter');
const plantsRouter = require('./plants/plantsRouter');

const server = express();

server.use(cors());
server.use(helmet());
server.use(express.json());

server.use('/api/auth', authRouter);
server.use('/api/plants', plantsRouter);

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Server running' });
});

server.use((err, req, res, next) => {
  err.statusCode = err.statusCode ? err.statusCode : 500;
  res.status(err.statusCode).json({
    message: err.message,
    stack: err.stack
  });
});

module.exports = server;
