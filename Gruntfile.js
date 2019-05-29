module.exports = function(grunt) {
    var frontendDir = './web';
    var bowerDir = frontendDir + '/bower_components';
    var staticDir = './output';

    // Получение кастомных js-файлов
    var customJsFiles = [];
    grunt.file.recurse(frontendDir + '/js/app/', function(abspath, rootdir, subdir, filename) {
        customJsFiles.push(abspath);
    });

    var jsBaseFiles = [
        // Bowers
        bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
        //bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
        //bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/button.js',
        //bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
        //bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
        bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
        bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
        //bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
        //bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
        //bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
        bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
        //bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap/affix.js',

        bowerDir + '/swiper/dist/js/swiper.js',

        // Custom
        frontendDir + '/js/logger.js',
        frontendDir + '/js/screen-helper.js',
        frontendDir + '/js/bootstrap-modal.js',
        frontendDir + '/js/utils.js'
    ];

    // Добавление кастомных js-файлов в конец базовых js-файлов
    for (var i = 0; i < customJsFiles.length; i++) {
        jsBaseFiles.push(customJsFiles[i]);
    }

    var jsFiles = function(){
        var result = [bowerDir + '/jquery/dist/jquery.js'];
        for (var i = 0; i < jsBaseFiles.length; i++) {
            result.push(jsBaseFiles[i]);
        }
        return result;
    }();

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            all: [staticDir + '/*'],
            prod: [staticDir + '/tmpl_*.html',
                   staticDir + '/sandbox_*.html'],
        },

        uglify: {
            options: {
                mangle: true
            },
            dev: {
                options: {
                    mangle: false,
                    beautify: true,
                    compress: false
                },
                files: [{
                    src: jsFiles,
                    dest: staticDir + '/js/app.js'
                }, {
                    src: [bowerDir + '/respond/dest/respond.src.js'],
                    dest: staticDir + '/js/respond.js'
                }]
            },
            prod: {
                files: [{
                    src: jsFiles,
                    dest: staticDir + '/js/app.min.js'
                }, {
                    src: [bowerDir + '/respond/dest/respond.src.js'],
                    dest: staticDir + '/js/respond.min.js'
                }]
            }
        },

        sass: {
            dev: {
                options: {
                    outputStyle: 'expanded'
                },
                files: [{
                    src: frontendDir + '/scss/main.scss',
                    dest: staticDir + '/css/main.css'
                },{
                    src: frontendDir + '/css/sys.css',
                    dest: staticDir + '/css/sys.css'
                }]
            },
            prod: {
                options: {
                    outputStyle: 'compressed'
                },
                files: [{
                    src: frontendDir + '/scss/main.scss',
                    dest: staticDir + '/css/main.min.css'
                },{
                    src: frontendDir + '/css/sys.css',
                    dest: staticDir + '/css/sys.min.css'
                }]
            }
        },

        autoprefixer: {
            options: {
              browsers: ['last 2 versions', 'ie 9', 'ie 10']
            },
            dist: {
                src: staticDir + '/css/*.css'
            },
        },

        nunjucks: {
            options: {
                data: grunt.file.readJSON(frontendDir + '/tmpl/data.json'),
                paths: frontendDir + '/tmpl'
            },
            live: {
                options: {
                    configureEnvironment: function(env, nunjucks) {
                        env.addGlobal('NODE_ENV', 'development');
                        env.addGlobal('LIVERELOAD', true);
                    }
                },
                files: [{
                    expand: true,
                    cwd: frontendDir + '/tmpl/pages/',
                    src: ['*.html'],
                    dest: staticDir + '/',
                    ext: '.html'
                }]
            },
            dev: {
                options: {
                    configureEnvironment: function(env, nunjucks) {
                        env.addGlobal('NODE_ENV', 'development');
                        env.addGlobal('LIVERELOAD', false);
                    }
                },
                files: [{
                    expand: true,
                    cwd: frontendDir + '/tmpl/pages/',
                    src: ['*.html'],
                    dest: staticDir + '/',
                    ext: '.html'
                }]
            },
            prod: {
                options: {
                    configureEnvironment: function(env, nunjucks) {
                        env.addGlobal('NODE_ENV', 'production');
                        env.addGlobal('LIVERELOAD', false);
                    }
                },
                files: [{
                    expand: true,
                    cwd: frontendDir + '/tmpl/pages/',
                    src: ['*.html'],
                    dest: staticDir + '/',
                    ext: '.html'
                }]
            },
        },

        'string-replace': {
            prod: {
                files: [{
                    src: staticDir + '/css/main.min.css',
                    dest: staticDir + '/css/main.min.css'
                }],
                options: {
                    replacements: [{
                        pattern: /\.\.\/bower_components\/bootstrap\/fonts/ig,
                        replacement: '../fonts/glyphicons-halflings-regular'
                    }, {
                        pattern: /\.\.\/\.\.\/web\/bower_components\/font-awesome\/fonts/ig,
                        replacement: '../fonts/font-awesome'
                    }, {
                        pattern: /\.\.\/\.\.\/web\/fonts\/custom\-font/ig,
                        replacement: '../fonts/custom-font'
                    }]
                }
            }
        },

        copy: {
            prod: {
                files: [{
                    expand: true,
                    cwd: bowerDir + '/font-awesome/fonts/',
                    src: ['**'],
                    dest: staticDir + '/fonts/font-awesome/'
                }, {
                    expand: true,
                    cwd: frontendDir + '/fonts/',
                    src: ['**'],
                    dest: staticDir + '/fonts/'
                }, {
                    expand: true,
                    cwd: frontendDir + '/img/',
                    src: ['**'],
                    dest: staticDir + '/img/'
                },{
                    expand: true,
                    cwd: frontendDir + '/video/',
                    src: ['**'],
                    dest: staticDir + '/video/'
                }]
            }
        },

        remove_blank_lines: {
            options: {},
            files: {
                expand: true,
                cwd: staticDir + '/',
                src: ['*.html'],
                dest: staticDir + '/'
            }
        },

        watch: {
            options: {
                livereload: true,
                nospawn: true,
                interrupt: false,
                debounceDelay: 250
            },
            scss: {
                files: [
                    frontendDir + '/scss/*.scss',
                    frontendDir + '/scss/*/*.scss',
                    frontendDir + '/css/*.css',
                    frontendDir + '/css/*/*.css'
                ],
                tasks: ['sass:dev', 'autoprefixer'],
            },
            js: {
                files: [
                    frontendDir + '/js/*.js',
                    frontendDir + '/js/*/*.js'
                ],
                tasks: ['uglify:dev']
            },
            html: {
                files: [
                    frontendDir + '/tmpl/*.html',
                    frontendDir + '/tmpl/*/*.html',
                    frontendDir + '/tmpl/*.json'
                ],
                tasks: ['nunjucks:live']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nunjucks-2-html');
    grunt.loadNpmTasks('grunt-remove-blank-lines');

    grunt.registerTask('build', function(target) {
        if (target == 'live') {
            grunt.task.run.apply(grunt.task, [
                'clean:all',
                'uglify:dev',
                'sass:dev',
                'autoprefixer',
                'nunjucks:live',
                'copy'
            ]);
        } else if (target == 'dev') {
            grunt.task.run.apply(grunt.task, [
                'clean:all',
                'uglify:dev',
                'sass:dev',
                'autoprefixer',
                'nunjucks:dev',
                'copy'
            ]);
        } else {
            grunt.task.run.apply(grunt.task, [
                'clean:all',
                'uglify:prod',
                'sass:prod',
                'autoprefixer',
                'nunjucks:prod',
                'string-replace',
                'copy',
                'clean:prod',
                'remove_blank_lines'
            ]);
        }
    });

    grunt.registerTask('default', ['build:live', 'watch']);
};
