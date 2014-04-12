'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};
module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'src/js/option.js',
                    'src/js/util.js',
                    'src/js/pig.js',
                    'src/js/pillar.js',
                    'src/js/position.js',
                    'src/js/controller.js',
                    'src/js/game.js'
                ],
                dest: 'dist/js/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
                beautify: {
                    ascii_only: true
                },
                compress: {
                    global_defs: {
                        'DEBUG': false
                    },
                    dead_code: true
                }
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            files: ['src/**/*.js'],
            options: {
                // read jshint options from jshintrc file
                "jshintrc": ".jshintrc"
            }
        },
        cssmin: {
            build: {
                files: {
                    'dist/css/style.min.css': [ 'src/css/*.css' ]
                }
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: ['src/js/*.*']
            }
        },
        clean: {
            spm: {
                src: [ '**/.gitignore', '**/.npmignore']
            }
        },
        connect: {
            options: {
                port: 8092,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, 'src')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'dist')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>/index.html'
            }
        },
        copy: {
            data: {expand: true, cwd: 'src/img/', src: '**', dest: 'dist/img/'}
        }
    });

    grunt.registerTask('build', ['test', 'concat', 'uglify', 'cssmin', 'copy' ]);

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['build', 'watch']);

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'connect:livereload',
            'open',
            'watch'
        ]);
    });
};