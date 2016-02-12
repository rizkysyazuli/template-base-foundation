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
                sourceMapIn: 'js/main.js.map',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            all: {
                files: {
                    'js/main.min.js': ['js/main.js']
                }
            }
        },

        concat: {
            options: {
                sourceMap: true,
                sourceMapName: function(des) {
                    grunt.log.write(des);
                    return 'js/main.js.map';
                }
            },
            all: {
                files: [{
                    src: 'js/src/**/*.js',
                    dest: 'js/main.js'
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

        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            all: {
                files: {
                    'main.css': 'main.css'
                }
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: ['css/**/*.css', '**/*.html', 'js/main.js']
                },
                options: {
                    proxy: 'http://localhost/~rzky/templates/base-foundation/',
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
                files: ['Gruntfile.js'],
                tasks: ['sass', 'concat']
            },
            sass: {
                files: 'scss/**/*.scss',
                tasks: ['sass']
            },
            concat: {
                files: 'js/src/*.js',
                tasks: ['concat']
            },
            // uglify: {
            //     files: 'js/main.js',
            //     tasks: ['uglify']
            // },
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            livereload: {
                files: ['js/main.js', 'css/**/*.css', '**/*.html'],
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
                        'bower_components/**/*',
                        'css/**/*',
                        'fonts/**/*',
                        'js/**/*',
                        '*.html',
                        '.htaccess',
                        'browserconfig.xml',
                        'crossdomain.xml',
                        'favicon.ico',
                        'humans.txt',
                        'robots.txt',
                        'apple-touch-icon.png',
                        'favicon.ico',
                        'tile-wide.png',
                        'tile.png'
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
                    'bower.json',
                    'compass.rb',
                    'Gruntfile.js',
                    'node_modules',
                    'package.json',
                    'scss',
                    'sass'
                ]
            }
        }
    });

    // Default task
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('build', ['sass', 'autoprefixer', 'concat', 'uglify', 'clean', 'copy', 'imagemin']);
    grunt.registerTask('deploy', ['sftp-deploy']);
};
