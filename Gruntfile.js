module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);

    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration
        uglify: {
            options: {
                mangle: false,
                compress: {
                    drop_console: true
                },
                sourceMap: true,
                sourceMapIn: 'js/src/sourcemaps/all.js.map',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            all: {
                files: {
                    'js/all.min.js': ['js/all.js']
                }
            }
        },

        concat: {
            options: {
                sourceMap: true,
                sourceMapName: function(des) {
                    grunt.log.write(des);
                    return "js/src/sourcemaps/all.js.map";
                }
            },
            all: {
                files: [{
                    src: 'js/src/**/*.js',
                    dest: 'js/all.js'
                }]
            }
        },

        sass: {
            dist: {
                options: {
                    compass: false,
                    style: 'compressed',
                    sourcemap: 'auto',
                    loadPath: ['bower_components/foundation-sites/scss/']
                },
                files: [{
                    expand: true,
                    cwd: 'scss',
                    src: ['*.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: ['css/**/*.css', "**/*.html", "js/all.js"]
                },
                options: {
                    proxy: "http://localhost/base-foundation/",
                    watchTask: true,
                    port: 8000
                }
            }
        },

        wiredep: {
            bower: {
                src: [
                    'index.html',
                    'scss/main.scss'
                ]
            }
        },

        watch: {
            grunt: {
                files: ["Gruntfile.js"]
            },
            sass: {
                files: "scss/**/*.scss",
                tasks: ["sass"]
            },
            concat: {
                files: "js/src/*.js",
                tasks: ["concat"]
            },
            uglify: {
                files: "js/all.js",
                tasks: ["uglify"]
            },
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            livereload: {
                files: ["js/all.js", "css/**/*.css", "**/*.html"],
                options: {
                    livereload: true
                }
            }
        },

        copy: {
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    dest: 'build',
                    src: [
                        'css/**/*',
                        'fonts/**/*',
                        'js/**/*',
                        '.htaccess',
                        'crossdomain.xml',
                        'favicon.ico',
                        'humans.txt',
                        'robots.txt',
                        '*.html'
                    ]
                }]
            }
        },

        clean: {
            build: ['build']
        },

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 5
                },
                files: [{
                    expand: true,
                    cwd: 'img',
                    src: '{,*/}*.{gif,jpeg,jpg,png,svg}',
                    dest: 'build/img'
                }]
            }
        },

        'sftp-deploy': {
            build: {
                auth: {
                    host: '127.0.0.1',
                    authKey: 'key1'
                },
                src: 'build',
                dest: '/path/to/www',
                exclusions: [
                    '.DS_Store',
                    '.editorconfig',
                    '.ftppass',
                    '.git',
                    '.gitattributes',
                    '.gitignore',
                    '.npmignore',
                    '.htaccess',
                    '.sass-cache',
                    'bower_components',
                    'bower.json',
                    'compass.rb',
                    'Gruntfile.js',
                    'node_modules',
                    'package.json',
                    'scss'
                ]
            }
        }
    });

    // Default task
    grunt.registerTask("default", ["browserSync", "watch"]);
    grunt.registerTask("build", ["sass", "concat", "uglify", "clean", "copy", "imagemin"]);
    grunt.registerTask("deploy", ["sftp-deploy"]);
};
