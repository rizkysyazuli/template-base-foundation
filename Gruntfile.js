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
                    'js/main.min.js': 'js/main.js'
                }
            }
        },

        concat: {
            options: {
                sourceMap: true
            },
            all: {
                files: [{
                    src: 'js/src/**/*.js',
                    dest: 'js/main.js'
                }]
            }
        },

        sass: {
            options: {
                compass: false,
                outputStyle: 'expanded',
                // sourceMap: true,
                // add any css framework/plugin here
                includePaths: ['bower_components/foundation-sites/scss/']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'scss',
                    src: ['*.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1,
                processImport: false
                // sourceMap: true
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css', '!*.css.map'],
                    dest: 'css',
                    ext: '.min.css'
                }]
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            all: {
                files: {
                    'css/main.css': 'css/main.css'
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
                tasks: ['sass', 'autoprefixer', 'concat']
            },
            sass: {
                files: 'scss/**/*.scss',
                tasks: ['sass', 'autoprefixer']
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
            }
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

        copy: {
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    dest: 'build',
                    src: [
                        // 'bower_components/**/*',
                        // 'css/**/*',
                        // 'js/**/*',
                        'fonts/**/*',
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
            build: ['build', '.tmp']
        },

        filerev: {
            options: {
                algorithm: 'md5',
                length: 5
            },
            all: {
                src: ['css/**/*.css', 'js/main.js']
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
        },

        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'build/'
                // flow: {
                //     html: {
                //         steps: {
                //             css: ['sass', 'autoprefixer']
                //         }
                //     }
                // }
            }
        },

        usemin: {
            html: 'build/index.html'
            // options: {
            //     assetsDirs: ['build/css', 'build/js']
            // }
        }
    });

    // Default task
    grunt.registerTask('init', [
        'wiredep',
        'sass',
        'autoprefixer',
        'concat'
    ]);
    grunt.registerTask('default', [
        'browserSync',
        'watch'
    ]);
    grunt.registerTask('build', [
        'clean',
        'useminPrepare',
        'sass',
        'autoprefixer',
        'concat',
        'uglify',
        'cssmin',
        // 'copy',
        'usemin',
        'imagemin'
    ]);
    grunt.registerTask('deploy', ['sftp-deploy']);
};
