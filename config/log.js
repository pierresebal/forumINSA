/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#!/documentation/concepts/Logging
 */

// FIE: as sails doesn't support the log file, we use winston logger. (cf: http://sailsjs.com/documentation/reference/configuration/sails-config-log)
// doc for winston transport: https://github.com/winstonjs/winston/blob/master/docs/transports.md
const winston = require('winston');
const fs = require('fs');
const FIELogger = new winston.Logger();
const LOGDIR = 'logs';
const LOGNAME = 'app.log';

//create log directory if not exist
if(!fs.existsSync(LOGDIR)) {
    fs.mkdirSync(LOGDIR);
}


// log to file
FIELogger.add(winston.transports.File, {
    filename: LOGDIR + '/' + LOGNAME, // FIE/logs/app.log
    json: false,
    exitOnError: false,
    colorize: false,
    timestamp: true,
    maximize: 1000,
    maxFile: 1,
    level: 'info'
});

// log to console
FIELogger.add(winston.transports.Console, {
    level: 'info',
    exitOnError: false,
    timestamp: false,
    colorize: true
});

module.exports.log = {

  /***************************************************************************
  *                                                                          *
  * Valid `level` configs: i.e. the minimum log level to capture with        *
  * sails.log.*()                                                            *
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, verbose, info, debug, warn, error                                 *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  ***************************************************************************/

    custom: FIELogger,  // pass our custom logger
    level: 'silly',
    inspect: false      // captain's log so it doesn't prefix or stringify our meta data
};
