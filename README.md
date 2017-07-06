# FIE

## Getting started
### Required
* MongoDB
* SailsJS
* NodeJS

### Update dependancies
```
npm install
```

### Launch project
```
sails lift
```

### Working with MongoDB
(Window)
Command Prompt
```
"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath "d:\test\mongo db data"
```

### Debug - Log file
Log is like an app diary, helpful for developer for debugging.<br/>
Tag convention:
* Controller: sails.log.warn([Controller].[action]: [message]);
* Service: sails.log.warn([ServiceName]: [message]);
Level convention:
* when error occur: sails.log.error(err);
* Info for debug: sails.log.debug(err);
* Info for realtime debug: sails.log.info(err);