/**
 * `copy`
 *
 * ---------------------------------------------------------------
 *
 * Copy files and/or folders from your `assets/` directory into
 * the web root (`.tmp/public`) so they can be served via HTTP,
 * and also for further pre-processing by other Grunt tasks.
 *
 * #### Normal usage (`sails lift`)
 * Copies all directories and files (except CoffeeScript and LESS)
 * from the `assets/` folder into the web root -- conventionally a
 * hidden directory located `.tmp/public`.
 *
 * #### Via the `build` tasklist (`sails www`)
 * Copies all directories and files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-copy
 *
 */
module.exports = function (grunt) {

    grunt.config.set('copy', {
        dev: {
            files: [{
                expand: true,
                cwd: './assets',
                src: ['**/*.!(coffee|less)'],
                dest: '.tmp/public'
            }]
        },
        build: {
            files: [{
                expand: true,
                cwd: '.tmp/public',
                src: ['**/*'],
                dest: 'www'
            }]
        },

        node_dependancy:    {       // custom: declare in here the external lib for the app
            files:  [{
                cwd: './node_modules/sweetalert2/dist',
                src: ['*'],
                dest: '.tmp/public/dependencies/sweetalert2',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/jquery/dist',
                src: ['*.js'],
                dest: '.tmp/public/dependencies/jquery',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/bootstrap/dist',
                src: ['**/*'],
                dest: '.tmp/public/dependencies/bootstrap',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/morris.js',
                src: ['*.css','morris.js','morris.min.js'],
                dest: '.tmp/public/dependencies/morris.js',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/ionicons/dist',
                src: ['**/*', '!**/*.scss'],
                dest: '.tmp/public/dependencies/ionicons',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/jvectormap',
                src: ['*.css','*.js'],
                dest: '.tmp/public/dependencies/jvectormap',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/bootstrap-datepicker/dist',
                src: ['**/*'],
                dest: '.tmp/public/dependencies/bootstrap-datepicker',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/bootstrap-daterangepicker',
                src: ['*.js', '*.css'],
                dest: '.tmp/public/dependencies/bootstrap-daterangepicker',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/raphael',
                src: ['raphael.min.js'],
                dest: '.tmp/public/dependencies/raphael',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/jquery-sparkline',
                src: ['*.js'],
                dest: '.tmp/public/dependencies/jquery-sparkline',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/jquery-knob/dist',
                src: ['*'],
                dest: '.tmp/public/dependencies/jquery-knob',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/jquery-slimscroll',
                src: ['*.js'],
                dest: '.tmp/public/dependencies/jquery-slimscroll',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/fastclick/lib',
                src: ['*.js'],
                dest: '.tmp/public/dependencies/fastclick',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/jquery-ui-dist',
                src: ['**/*'],
                dest: '.tmp/public/dependencies/jquery-ui',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/bootstrap-switch/dist',
                src: ['**/*.js', 'css/bootstrap3/*.css' ],
                dest: '.tmp/public/dependencies/bootstrap-switch',
                flattern: true,
                expand: true
            }, {
                cwd: './node_modules/toastr/build',
                src: ['**/*.js', '**/*.css' ],
                dest: '.tmp/public/dependencies/toastr',
                flattern: true,
                expand: true
            },  {
                cwd: './node_modules/font-awesome',
                src: ['**/*'],
                dest: '.tmp/public/dependencies/font-awesome',
                flattern: true,
                expand: true
            }]
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};
