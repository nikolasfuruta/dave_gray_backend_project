const allowedOrigins = require('./allowedOrigins');

//this is a 3dt party pack
const corsOptions = {
  origin: (origin, callback) => {
    if(allowedOrigins.indexOf(origin) !== -1 || !origin) { //!origin => thunderClient
      callback(null, true)
    }
    else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, //allow credential header
  optionsSuccessStatus: 200
}

module.exports = corsOptions;