# Forum INSA Entreprise

## Using Log for debug

Log is like an app diary, helpful for developer for debugging.

### Conventions
Tag convention:
* Controller: 
```
sails.log.warn([Controller].[action]: [message]);
```
* Service: 
```
sails.log.warn([ServiceName]: [message]);
```

Level convention:
* when error occur: sails.log.error(err);
* Info for debug: sails.log.debug(err);
* Info for realtime debug: sails.log.info(err);

### Where to find log file
Log file is stored in FIE/logs/*.log. For instance we only have app.log which contains the diary of the log.

### TODO
* Limit the size of log file
* Generate a log file / days and store only 7 logs files (or more for security track)
* Webmaster can consult the log from browser (or not)
* Generate different log for different action (In the future transaction - online payment, modification in admin space, ...)

### Log configuration
Normally, this step has been done by Kihansi95 - webmaster in 2017-2018 and it needs to be done once. <br/>
The following guide is for experience purpose.

Reference: [http://sailsjs.com/documentation/reference/configuration/sails-config-log](http://sailsjs.com/documentation/reference/configuration/sails-config-log)
All the configurations are done in log.js

In nodejs we use winston logger