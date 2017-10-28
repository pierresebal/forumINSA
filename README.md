# Forum INSA Entreprise

Platform where company can buy their place for the stand

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

## Debug - Log file
Log is like an app diary, helpful for developer for debugging.<br/>
Tag convention:
* Controller: sails.log.warn([Controller].[action]: [message]);
* Service: sails.log.warn([ServiceName]: [message]);
Level convention:
* when error occur: sails.log.error(err);
* Info for debug: sails.log.debug(err);
* Info for realtime debug: sails.log.info(err);

## Model system
Ideal model:
- User: user for login method (passport)
- Student extends<User>
- Company extends<User>
- CompanyStatus: define type of company so that define which offer company can see
- Offer: what we sell in FIE, has filter following CompanyStatus
- Sell: (* - 1) to Offer and (* - 1) to Company, definite quantity company bought
- Bill: contains array of sell, permit admin to edit easily sell
- SjdSession: define the session, relate to Company and to student
- GeneralSettings: define setting for web package
- Speciality
- Task: reminder in admin side

Todo list:
- After the inscription period:
implement new sell and offer, implement company status, implement speciality
delete Sells, delte YearSettings (replaced buy Offer)

- Long term:
dev Task, improve GeneralSetting (move it into a file or sth, not in database)

## View architecture
See here

## Nodejs dependancy
See more in [nodejs.md](readme/nodejs.md)



