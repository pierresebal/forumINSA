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

### Auto restart project when code change
Installer forever
```
sudo npm -g forever
```

Le projet va écrire en infinité au .tmp, pour l'éviter, créer fichier .foreverignore dont le contenu:
```
**/.tmp/**
**/views/**
**/assets/**
```

Lancer dans l'endroit du projet:
```
forever -w start app.js
```

### Working with MongoDB
(Window)
Command Prompt
```
"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath "d:\test\mongo db data"
```