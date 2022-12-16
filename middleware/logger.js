const { format } = require('date-fns');
const {v4:uuid} = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (logMessage, logFileName) => {
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuid()}\t${logMessage}\n`;

  try{
    //create logs Folder if not exist
    if(!fs.existsSync(path.join(__dirname,'..','logs'))) {
      await fsPromises.mkdir(path.join(__dirname,'..','logs'))
    }
    //add log history to logFile
    await fsPromises.appendFile(path.join(__dirname,'..','logs',logFileName), logItem);
  }
  catch(e){
    console.log(e)
  }
}

//custom log middleware
const logger = (req,res,next) => {
  logEvents(
    `${req.method}\t${req.url}\t${req.header.origin}`,
    'reqLog.log'
  );
  console.log(`${req.method} ${req.path}`);
  next();
}

module.exports = { logEvents, logger }