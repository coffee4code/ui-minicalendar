module.exports = function(grunt) {

    grunt.initConfig({
        sass: {
            expanded: {
                options: {
                    outputStyle: 'expanded',
                    sourcemap: false
                },
                files: {
                    'css/ui.minicalendar.css': 'css/ui.minicalendar.scss'
                }
            },
            min: {
                options: {
                    outputStyle: 'compressed',
                    sourcemap: false
                },
                files: {
                    'css/ui.minicalendar.min.css': 'css/ui.minicalendar.scss'
                }
            },
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    "js/calendar.js"
                ],
                dest: 'dist/calendar.js'
            }
        },
        uglify: {
            options: {
                // Use these options when debugging
                // mangle: false,
                // compress: false,
                // beautify: true
            },
            dist: {
                files: {
                    'dist/calendar.min.js': ['dist/calendar.js']
                }
            }
        },

        watch: {
            js: {
                files: ['js/materialize/**/*'],
                tasks: ['js_compile'],
                options: {
                    interrupt: false,
                    spawn: false
                }
            },


            sass: {
                files: ['css/ui.minicalendar.scss'],
                tasks: ['sass_compile'],
                options: {
                    interrupt: false,
                    spawn: false
                }
            }

        },

        concurrent: {
            options: {
                logConcurrentOutput: true,
                limit: 10
            },
            monitor: {
                tasks: ['watch:js', 'watch:sass', 'notify:watching']
            }
        },

        notify: {
            sass_compile: {
                options: {
                    enabled: true,
                    message: 'Sass Compiled!',
                    title: "Materialize",
                    success: true,
                    duration: 1
                }
            },

            js_compile: {
                options: {
                    enabled: true,
                    message: 'JS Compiled!',
                    title: "Materialize",
                    success: true,
                    duration: 1
                }
            },

            watching: {
                options: {
                    enabled: true,
                    message: 'Watching Files!',
                    title: 'Materialize',
                    success: true,
                    duration: 1
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-rename');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-testem');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('sass_compile', ['sass:expanded', 'sass:min', 'notify:sass_compile']);
    grunt.registerTask('js_compile', ['concat:dist', 'uglify:dist', 'notify:js_compile']);
    grunt.registerTask('develop', ['concurrent:monitor']);
};