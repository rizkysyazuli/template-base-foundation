module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var env = grunt.option('env') || 'development';

    grunt.initConfig({
        // Metadata
        conf: grunt.file.readJSON('config.json'),

        // compile scss using node-sass
        // https://www.npmjs.com/package/grunt-sass
        sass: {
            options: {
                sourceMap: env === 'development' ? true : false,
                outputStyle: 'compressed',
                includePaths: [
                    'node_modules/foundation-sites/scss'
                ]
            },
            default: {
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: '**/*.scss',
                    dest: '.tmp/css/',
                    ext: '.min.css'
                }]
            }
        },

        // add vendor prefixes
        // https://github.com/nDmitry/grunt-autoprefixer
        autoprefixer: {
            options: {
                browsers: [
                    'last 2 versions',
                    'ie >= 9',
                    'Android >= 2.3',
                    'ios >= 7'
                ],
                map: true
            },
            default: {
                files: [{
                    expand: true,
                    cwd: '.tmp/css',
                    src: '**/*.css',
                    dest: 'dist/css'
                }]
            }
        },

        // minify images
        // https://github.com/gruntjs/grunt-contrib-imagemin
        imagemin: {
            options: {
                optimizationLevel: env === 'development' ? 0 : 3
            },
            default: {
                files: [{
                    expand: true,
                    cwd: 'src/img',
                    src: '**/*.{gif,jpeg,jpg,png,svg}',
                    dest: 'dist/img'
                }]
            }
        },

        // Use next generation JavaScript
        // https://github.com/babel/grunt-babel
        babel: {
            options: {
                sourceMap: env === 'development' ? true : false,
                presets: ['env']
            },
            default: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: ['**/*.js', '!vendor/**'],
                    dest: '.tmp/js'
                }]
            }
        },

        // compress & concat JS files.
        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            options: {
                sourceMap: env === 'development' ? true : false,
                output: {
                    comments: false
                },
                compress: env === 'development' ? null : {
                    drop_console: true
                }
            },
            libraries: {
                files: [{
                    src: [
                        'node_modules/foundation-sites/dist/js/foundation.min.js'
                    ],
                    dest: '.tmp/js/libs.js'
                }]
            },
            default: {
                files: [{
                    src: [
                        '.tmp/js/libs.js',
                        '.tmp/js/plugins.js',
                        '.tmp/js/main.js'
                    ],
                    dest: 'dist/js/main.min.js'
                }]
            }
        },

        // folder cleanup
        // https://github.com/gruntjs/grunt-contrib-clean
        clean: ['dist', '.tmp'],

        // Copy files
        // https://github.com/gruntjs/grunt-contrib-copy
        copy: {
            default: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.html',
                    dest: 'dist'
                }],
            },
            vendor: {
                files: [{
                    expand: true,
                    cwd: 'src/js/vendor',
                    src: '**/*.js',
                    dest: 'dist/js/vendor'
                }]
            },
            static: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: [
                        '*.{ico,png,txt,xml}',
                        '.htaccess',
                        'img/**',
                        'video/**'
                    ],
                    dest: 'dist'
                }]
            }
        },

        // file watcher & task runner for all the previous tasks above
        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            options: {
                spawn: false
            },
            grunt: {
                files: 'Gruntfile.js',
                tasks: ['build']
            },
            html: {
                files: 'src/**/*.html',
                tasks: ['copy:default']
            },
            styles: {
                files: 'src/scss/**/*.scss',
                tasks: ['sass', 'autoprefixer']
            },
            scripts: {
                files: 'src/js/**/*.js',
                tasks: ['babel', 'uglify']
            },
            vendor: {
                files: 'src/js/vendor/**/*.js',
                tasks: ['copy:vendor']
            },
            static: {
                files: [
                    'src/*.{ico,png,txt,xml}',
                    'src/.htaccess',
                    'src/img/**'
                ],
                tasks: ['copy:static']
            },
            images: {
                files: 'src/img/**/*.{gif,jpeg,jpg,png,svg}',
                tasks: ['newer:imagemin']
            }
        },

        // synchronized browser testing & live reload
        // https://github.com/BrowserSync/grunt-browser-sync
        browserSync: {
            dev: {
                bsFiles: {
                    src: ['dist/**']
                },
                options: {
                    server: 'dist',
                    watchTask: true
                }
            }
        },

        // deploy via sftp *duh
        // https://github.com/thrashr888/grunt-sftp-deploy
        'sftp-deploy': {
            default: {
                auth: {
                    host: '<%= conf.remote_host %>',
                    port: 22,
                    authKey: env
                },
                src: 'dist',
                dest: '<%= conf.remote_dir %>',
                concurrency: 4,
                progress: true
            }
        }
    });

    // register tasks.
    // some of these tasks has optional arguments to customize the target and/or output

    // $ grunt
    grunt.registerTask('default', ['build', 'browserSync', 'watch']);
    // $ grunt build --env=yourenv
    grunt.registerTask('build', [
        'clean',
        'sass',
        'autoprefixer',
        'babel',
        'uglify',
        'copy',
        'imagemin'
    ]);
    // $ grunt deploy --env=yourenv
    grunt.registerTask('deploy', ['build', 'sftp-deploy']);
};
