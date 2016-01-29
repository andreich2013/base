// Generated on 2015-08-13 using generator-angular 0.11.1
'use strict';

module.exports = function (grunt) {
    var chalk         = require("chalk");
    var bower         = require("bower");
    var bowerRenderer = require("bower/lib/renderers/StandardRenderer");

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
            name: "reeldeal",
            root: 'project',
            app: './project/app',
            bower: './project/bower_components',
            assets: './project/assets',
            dist: './dist',
            config: './config'
        },
        modRewrite = require('connect-modrewrite');

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        rdmodule: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            //jsTest: {
            //    files: ['<%= rdmodule.app %>/**/*.spec.js'],
            //    tasks: ['ngtemplates:test', 'karma']
            //},
            //compass: {
            //    files: ['<%= rdmodule.assets %>/**/*.{scss,sass}'],
            //    tasks: ['compass:server', 'autoprefixer:server']
            //},
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.livereload.options.livereload %>'
                },
                files: [
                    '<%= rdmodule.app %>/**/*.{js,html}',
                    '<%= rdmodule.assets %>/{,*/}*.{css,json}',
                    '<%= rdmodule.assets %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            //constants: {
            //    files: ['<%= rdmodule.root %>/layout.demo.config.json'],
            //    tasks: ['ngconstant:demo-dev'],
            //    options: {
            //        livereload: '<%= connect.livereload.options.livereload %>'
            //    }
            //}
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                middleware: function (connect, options) {
                    var optBase = (typeof options.base === 'string') ? [options.base] : options.base;

                    return [modRewrite(['!(\\..+)$ /index.html [L]'])]
                        .concat(optBase.map(function (path) {
                            if (path.indexOf('rewrite|') === -1) {
                                return connect.static(path);
                            } else {
                                path = path.replace(/\\/g, '/').split('|');
                                return connect().use(path[1], connect.static(path[2]));
                            }
                        }));
                }
            },
            livereload: {
                options: {
                    //open: true,
                    livereload: 35729,
                    middleware: function (connect) {
                        return [
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            connect.static(appConfig.app),
                            connect.static('.tmp'),
                            connect().use(
                                '/assets',
                                connect.static(appConfig.assets)
                            ),
                            connect().use(
                                '/bower_components',
                                connect.static(appConfig.bower)
                            ),
                            connect().use(
                                '/app',
                                connect.static(appConfig.app)
                            )
                        ];
                    }
                }
            },
            dist: {
                options: {
                    //open: true,
                    base: '<%= rdmodule.dist %>'
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= rdmodule.dist %>/{,*/}*',
                        '!<%= rdmodule.dist %>/.git{,*/}*'
                    ]
                }]
            },
            //nuget: ["<%= rdmodule.packages %>", 'packages.config'],
            install: ['<%= rdmodule.bower %>'],
            "after-package": ['<%= rdmodule.dist %>/**/*{demo,vendor}*.{js,css}']
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            server: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= rdmodule.assets %>/css/',
                    src: '{,*/}*.css',
                    dest: '<%= rdmodule.assets %>/css/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= rdmodule.assets %>/css/',
                    src: '{,*/}*.css',
                    dest: '<%= rdmodule.assets %>/css/'
                }]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        //compass: {
        //    options: {
        //        sassDir: '<%= rdmodule.assets %>/scss/',
        //        cssDir: '<%= rdmodule.assets %>/scss/',
        //        generatedImagesDir: '.tmp/img/generated',
        //        imagesDir: '<%= rdmodule.assets %>/img/',
        //        javascriptsDir: '<%= rdmodule.app %>',
        //        fontsDir: '<%= rdmodule.assets %>/fonts',
        //        importPath: '<%= rdmodule.bower %>',
        //        httpImagesPath: '/assets/img/',
        //        httpGeneratedImagesPath: '/assets/img/generated',
        //        httpFontsPath: '/assets/fonts',
        //        relativeAssets: false,
        //        assetCacheBuster: false,
        //        raw: 'Sass::Script::Number.precision = 10\n'
        //    },
        //    dist: {
        //        options: {
        //            generatedImagesDir: '<%= rdmodule.dist %>/assets/img/generated'
        //        }
        //    },
        //    server: {
        //        options: {
        //            sourcemap: true
        //        }
        //    }
        //},

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= rdmodule.dist %>/scripts/{,*/}*.js',
                    '<%= rdmodule.dist %>/assets/styles/{,*/}*.css',
                    '<%= rdmodule.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= rdmodule.app %>/index.html',
            options: {
                dest: '<%= rdmodule.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= rdmodule.dist %>/*.html'],
            css: ['<%= rdmodule.dist %>/assets/styles/{,*/}*.css'],
            js: ['<%= rdmodule.dist %>/scripts/**/*.js'],
            options: {
                assetsDirs: [
                    '<%= rdmodule.dist %>',
                    '<%= rdmodule.dist %>/assets',
                    '<%= rdmodule.dist %>/assets/styles',
                    '<%= rdmodule.dist %>/assets/images',
                    '<%= rdmodule.dist %>/assets/fonts'
                ]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= rdmodule.dist %>/',
                    src: ['*.html'],
                    dest: '<%= rdmodule.dist %>'
                }]
            }
        },

        uglify: {
            options: {
                mangle: false
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        //only project files
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: ['*.js', '!vendor.js'],
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                //{
                //    expand: true,
                //    dot: true,
                //    cwd: '<%= rdmodule.bower %>/TipUI/tipui/styles/fonts',
                //    dest: '<%= rdmodule.dist %>/assets/fonts',
                //    src: ['{,*/}*.*']
                //}, {
                //    expand: true,
                //    dot: true,
                //    cwd: '<%= rdmodule.bower %>/TipUI/tipui/styles/images',
                //    dest: '<%= rdmodule.dist %>/assets/images',
                //    src: ['{,*/}*.*']
                //},
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= rdmodule.app %>/',
                    dest: '<%= rdmodule.dist %>',
                    src: ['*.html']
                },
                {
                    expand: true,
                    cwd: '<%= rdmodule.assets %>/img/',
                    src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
                    dest: '<%= rdmodule.dist %>/assets/images'
                },
                //{
                //    expand: true,
                //    dot: true,
                //    cwd: '<%= rdmodule.bower %>/Deloitte.TIP.AA.Client.UI/',
                //    dest: '<%= rdmodule.dist %>/assets/Deloitte.TIP.AA.Client.UI',
                //    src: ['**/*.{html,js}', '!angular-*.js']
                //},
                //{
                //    expand: true,
                //    dot: true,
                //    cwd: '<%= rdmodule.root %>/',
                //    src: ['Web.config', 'website.publishproj', 'App_Data/PublishProfiles/*.pubxml'],
                //    dest: '<%= rdmodule.dist %>'
                //}
                ]
            },
            package: {
                files: [
                    //{
                    //    expand: true,
                    //    cwd: '.',
                    //    dest: '<%= rdmodule.dist %>',
                    //    src: ['tip.pckg.json']
                    //},
                {
                    expand: true,
                    cwd: '<%= rdmodule.assets %>/img/',
                    src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
                    dest: '<%= rdmodule.dist %>/assets/images'
                },
                //{
                //    expand: true,
                //    dot: true,
                //    cwd: '<%= rdmodule.app %>/',
                //    dest: '<%= rdmodule.dist %>',
                //    src: ['*.md']
                //}
                ]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            //server: [
            //    'compass:server'
            //],
            //dist: [
            //    'compass:dist'
            //]
        },

        // Test settings
        karma: {
            //unit: {
            //    configFile: 'karma.conf.js',
            //    singleRun: true
            //}
        },

        // compile angular templates & append to app.js
        ngtemplates: {
            options: {
                module: '<%= rdmodule.name %>',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                usemin: 'scripts/<%= rdmodule.name %>.js'
            },
            dist: {
                cwd: '<%= rdmodule.app %>',
                src: [
                    '**/*.html',
                    '!layout.demo*/**/*.html',
                    '!index.html'
                ],
                dest: '.tmp/templateCache.js'
            },
            test: {
                options: {
                    usemin: undefined
                },
                cwd: '<%= rdmodule.app %>',
                src: [
                    '**/*.html',
                    '!layout.demo*/**/*.html',
                    '!index.html'
                ],
                dest: '.tmp/templateCache.js'
            }
        },

        ngconstant: {
            options: {
                deps: null,
                wrap: true,
                dest: '<%= rdmodule.app %>/rd.env.js',
                name: '<%= rdmodule.name %>'
            },
            "dev": {
                constants: {
                    "rdENV": grunt.file.readJSON(appConfig.config + '/dev.json')
                }
            },
            "qa": {
                constants: {
                    "rdENV": grunt.file.readJSON(appConfig.config + '/qa.json')
                }
            },
            "prod": {
                constants: {
                    "rdENV": grunt.file.readJSON(appConfig.config + '/prod.json')
                }
            },
            "proto": {
                constants: {
                    "rdENV": grunt.file.readJSON(appConfig.config + '/proto.json')
                }
            },
            "mvp": {
                constants: {
                    "rdENV": grunt.file.readJSON(appConfig.config + '/mvp.json')
                }
            },
            "alpha": {
                constants: {
                    "rdENV": grunt.file.readJSON(appConfig.config + '/alpha.json')
                }
            },
            "beta": {
                constants: {
                    "rdENV": grunt.file.readJSON(appConfig.config + '/beta.json')
                }
            }
        },

        //'rd-install': {},
        //'rd-nuspec': {},
        'rd-bower-install': {
            dev: {
                options: {
                    directory: '<%= rdmodule.bower %>',
                    production: false,
                    forceLatest: true
                }
            },
            prod: {
                options: {
                    directory: '<%= rdmodule.bower %>',
                    production: true,
                    forceLatest: true
                }
            }
        }

    });

    grunt.registerMultiTask('rd-bower-install', "Install or Update Bower Dependencies", function () {
        grunt.log.writeln(JSON.stringify(this.options()));
        /*  prepare options  */
        var options = this.options({
            /*  bower configuration options (renderer specific)  */
            color:        undefined,          /*  bower --config.color=<val>           */
            cwd:          undefined,          /*  bower --config.cwd=<dir>             */

            /*  bower command selection options  */
            command:      "install",          /*  bower <command>                      */

            /*  bower command argument options  */
            forceLatest:  false,              /*  bower <command> --force-latest       */
            production:   false,              /*  bower <command> --production         */

            /*  bower configuration options (general)  */
            interactive:  undefined,          /*  bower --config.interactive=<val>     */
            directory:    undefined           /*  bower --config.directory=<dir>       */
        });
        grunt.verbose.writeflags(options, "Options");

        /*  sanity check option values  */
        if (typeof options.color !== "undefined" && typeof options.color !== "boolean")
            throw new Error("invalid type of value for option \"color\" (expected boolean)");
        if (typeof options.cwd !== "undefined" && typeof options.cwd !== "string")
            throw new Error("invalid type of value for option \"cwd\" (expected string)");
        if (typeof options.command !== "undefined" && typeof options.command !== "string")
            throw new Error("invalid type of value for option \"command\" (expected string)");
        if (typeof bower.commands[options.command] !== "function")
            throw new Error("invalid Bower command \"" + options.command + "\"");
        if (typeof options.forceLatest !== "undefined" && typeof options.forceLatest !== "boolean")
            throw new Error("invalid type of value for option \"forceLatest\" (expected boolean)");
        if (typeof options.production !== "undefined" && typeof options.production !== "boolean")
            throw new Error("invalid type of value for option \"production\" (expected boolean)");
        if (typeof options.interactive !== "undefined" && typeof options.interactive !== "boolean")
            throw new Error("invalid type of value for option \"interactive\" (expected boolean)");
        if (typeof options.directory !== "undefined" && typeof options.directory !== "string")
            throw new Error("invalid type of value for option \"directory\" (expected string)");

        /*  determine renderer options
         (notice: provide only the real overrides to allow .bowerrc usage)
         (notice: "cwd" has to be present to let Bower not fail)  */
        var rendererOpts = {};
        if (typeof options.color !== "undefined")
            rendererOpts.color = options.color;
        if (typeof options.cwd !== "undefined")
            rendererOpts.cwd = options.cwd;
        else
            rendererOpts.cwd = process.cwd();

        /*  determine task, task arguments and task options
         (notice: provide only the real overrides to allow .bowerrc usage)  */
        var task = bower.commands[options.command];
        var taskArgs = {};
        if (options.command.match(/^(?:install|update)$/)) {
            taskArgs["force-latest"] = options.forceLatest;
            taskArgs['forceLatest'] = options.forceLatest;
            taskArgs.production = options.production;
        }
        var taskOpts = {};
        if (typeof options.interactive !== "undefined")
            taskOpts.interactive = options.interactive;
        if (typeof options.directory !== "undefined")
            taskOpts.directory = options.directory;
        if (typeof options.cwd !== "undefined")
            taskOpts.cwd = options.cwd;

        /*  programatically run the Bower functionality  */
        var done = this.async();
        var renderer = new bowerRenderer(options.command, rendererOpts);
        task([], taskArgs, taskOpts)
            .on("log", function (log) {
                renderer.log(log);
            })
            .on("prompt", function (prompt, callback) {
                renderer.prompt(prompt).then(function(answer) {
                    callback(answer);
                });
            })
            .on("error", function (err) {
                renderer.error(err);
                done(false);
            })
            .on("end", function (data) {
                renderer.end(data);
                done();
            });
    });

    grunt.registerTask('serve', 'Compile then start a "connect" web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'package',
                'connect:dist:keepalive'
            ]);
        }

        grunt.task.run([
            //'concurrent:server',
            'autoprefixer:server',
            'ngconstant:dev',
            'connect:livereload',
            'watch'
        ]);
    });

    //grunt.registerTask('test', [
    //    'ngtemplates:test',
    //    'karma'
    //]);

    grunt.registerTask('package', 'Prepare module to be published to production', function () {
        grunt.task.run([
            'clean:dist',
            'useminPrepare',
            'ngtemplates:dist',
            //'concurrent:dist',
            'autoprefixer:dist',
            'concat',
            'ngAnnotate',
            'copy:package',
            'cssmin',
            'uglify',
            'usemin',
            'clean:after-package',
            'rd-update-package-version',
            'rd-nuspec'
        ]);
    });



    grunt.registerTask('install', 'Installs dependencies', (function() {

        var configs = ['alpha', 'beta', 'mvp', 'proto', 'qa', 'prod', 'dev'];

        return function () {
            grunt.task.run([
                //'clean:nuget',
                'clean:install'
            ]);

            var tmp = configs.indexOf((grunt.option('environment'))),
                env = tmp !== -1 ? configs[tmp] : 'dev';

            grunt.task.run([
                'rd-bower-install:dev',
                'ngconstant:' + env
                //'clean:nuget'
            ]);
        }

    }()));

    grunt.registerTask('default', [
        //'test'
    ]);
};
