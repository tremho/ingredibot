
 
const winston = require('winston');
const Path = require('path')
const FS = require('fs')

const { combine, timestamp, json, simple } = winston.format;

const logdir = Path.join(__dirname, 'logs');

if (!FS.existsSync(logdir)) {
  FS.mkdirSync(logdir)
}

const transports = {
  console: new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    format:  combine(
      timestamp({
        format: 'HH:mm:ss'
      }),
      simple()
    )
  }),
  file: new winston.transports.File({
    filename: Path.join(logdir,'wagtales.log'),
    level: 'debug',
    handleExceptions: true,
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      json()
    )
  })
};

const logger = winston.createLogger({

  //levels -- use the default npm levels of error, warn, info, http, verbose, debug, silly

  transports: [
    transports.console,
    transports.file
  ],

  exitOnError: false

})

logger.exception = function(optmsg, e) {
  if(!e) {
    // single parameter error object
    e = optmsg
    optmsg = ''
  }
  let message
  if(optmsg) message = optmsg + ':: ' + e.name + ': ' + e.message
  else message = e.message
  let stackArray = (e.stack || '').split('\n')
  stackArray.shift() // throw away first
  let where = '\n'+ stackArray.join('\n')
  logger.error('Exception: ' +  message + " " + where)
}

module.exports = {
   transports,
   logger
 };


