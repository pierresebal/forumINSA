# Forum INSA Entreprise


## Using external Nodejs module

The description is from the experience for developper

### For server back-end
install the package
```
npm install --save bcryptjs
```

or unistall the package

```
npm uninstall --save bcryptjs
```

For the use in code (controller, model, policy, ...)

```
// api/models/Company.js
var bcrypt = require('bcryptjs'); // for password encryption

function hashPassword(password, callback)   {
    bcrypt.hash(password, SALT_WORK_FACTOR, function(err, encryptedPassword) {
        callback(err, encryptedPassword);
    });
}
```

### For client web front-end
If you want to copy some code into your template which keep it up to date. 

install the package
```
npm install --save jquery
```

Add new task specifique for nodejs dependancy:
    In the example we set a new task of copy named "node_dependancy"

```
// compileAssets.js

...
grunt.registerTask('compileAssets', [
    ...
    'copy:node_dependancy',
    ...
]
...

```


Modify the copy.js: (Copy only distant files we need)
    In the example, copy every files in sweetalert2 to the folder corespond in .tmp 
```
// copy.js

...

    grunt.config.set('copy', {
        dev : {...},
        build: {...},
        
        node_dependancy : {
            files: [
            {
                cwd: './node_modules/sweetalert2/dist',
                src: ['*'],
                dest: '.tmp/public/dependencies/sweetalert2',
                flattern: true,
                expand: true
            },
            {...}, ...
            ],
        }
    })

...
```

When we do sails lift, files is copied to .tmp folder at the specified