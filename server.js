require('dotenv').config();
const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions =  require('./config/corsOptions');
const connectDB = require('./config/db.Conn');
const mongoose = require('mongoose');
const { logEvents } = require('./middleware/logger');

const PORT = process.env.PORT || 3500;
const app = express();

connectDB();

app.use(logger)//placed first to record all events
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser())//third-party miidleware
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'));
app.all('*', require('./routes/404'));

app.use(errorHandler)//placed last to record all possible error

//mongoose events
mongoose.connection.once('open', () => {
  console.log('Connected to mongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  });
});

mongoose.connection.on('error', err => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});