'use strict';

module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        mochaTest: {
            test: {
                src: 'test/**/*.test.js',
                options: {
                    timeout: 10000,
                    reporter: 'spec'
                }
            }
        },
        jshint: {
            options: {
                node: true, // node's globals
                force: true,        // don't stop when there is an error
                maxerr: 10000,      // keep running no matter how many errors were found
                globalstrict: true, // allows 'use strict' with single quotes
                newcap: false       // allows  functions to be capitalized without New
            },
            gruntfile: {
                options: {
                },
                files: {
                    src: [
                        'Gruntfile.js'
                    ]
                }
            },
            lib: {
                options: {
                    globals: {
                    }
                },
                files: {
                    src: [
                        'lib/**/*.js'
                    ]
                }
            },
            test: {
                options: {
                    expr: true,         // allow expressions like foo.ok;
                    globals: {
                        it: true,
                        xit: true,
                        expect: true,
                        runs: true,
                        waits: true,
                        waitsFor: true,
                        beforeEach: true,
                        afterEach: true,
                        describe: true,
                        xdescribe: true
                    }
                },
                files: {
                    src: 'test/**/*.js'
                }
            }
        },
        watch: {
            test: {
                options: {
                    spawn: false
                },
                files: [
                    'Gruntfile.js',
                    'lib/**/*',
                    'test/**/*'
                ],
                tasks: [
                    'test'
                ]
            }
        }
    });

    grunt.registerTask('test', [
        'jshint',
        'mochaTest'
    ]);

    grunt.registerTask('default', [
        'test'
    ]);

};
