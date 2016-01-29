var chalk         = require("chalk");
var bower         = require("bower");
var bowerRenderer = require("bower/lib/renderers/StandardRenderer");
module.exports = function (grunt) {
    var _ = grunt.util._,
        async = grunt.util.async,
        nuget = require("../libs/nuget")(grunt),
        path = require('path'),
        helper = require('../libs/tip-cli-helper.js')(grunt),
        nugetConfPath = path.join(__dirname, '../', "NuGet.Config"),
        rootPath = path.resolve(), self = this,
        defaultOutputDirectory='packages',
        defaultNugetInstallOptions = {
            ConfigFile: nugetConfPath,
            OutputDirectory: defaultOutputDirectory,
            ExcludeVersion: true,
            Verbosity: 'detailed',
            NoCache: true
        },
        configDefaultFile='packages.config',
        tmpDir = 'nuget-tmp',
        distDir = 'dist',//read from options
        defaultPackageFile = 'tip.pckg.json',
        processesPackages=[];

    this.processNugetPackage = function(packageInfo,bowerConfig,params,done){
        var packageName = packageInfo['name'];
        var nugetDeps = packageInfo['nuget-dependencies'];
        var nugetConfig = {packages:[]},nugetPckgFile;
        Object.keys(nugetDeps).forEach(function(key){
            //place every nuget package that would be installed into bower config
            bowerConfig.dependencies[key] =  path.join(rootPath,'packages/',key);
            nugetConfig.packages.push({
                package: {},
                attributes: {id: key, version: nugetDeps[key]}
            });
        });
        nugetPckgFile=tmpDir+'/'+packageName+'/'+configDefaultFile;
        grunt.file.mkdir(tmpDir+'/'+packageName+'/');
        grunt.file.write(nugetPckgFile,helper.toXML(nugetConfig,{header:true,attrkey:'attributes'}));
        self.installNugetPackages(nugetPckgFile,params,function(err){
            if(err){
                grunt.log.writeln("InstallNugetPackages for:"+packageName+" failed" + err);
                done('Failed to install nuget packages');
            }else{
                //final cb of nuget installation
                processesPackages.push('packages/'+packageName);
                var nestedDependencies=[];
                grunt.file.expand({ filter: 'isDirectory'},['packages/tip.*']).forEach(function(path) {
                    //Add semver check there
                    if(grunt.file.exists(path+"/"+defaultPackageFile) && processesPackages.indexOf(path)==-1){
                        nestedDependencies.push(path+"/"+defaultPackageFile);
                        //create bower json for nuget package for futher installation
                        var dependencyPackageInfo = grunt.file.readJSON(path+"/"+defaultPackageFile);
                        delete dependencyPackageInfo['nuget-dependencies'];

                        grunt.file.write(path+"/"+'bower.json',JSON.stringify(dependencyPackageInfo,null,4));
                    }
                    // Remove file or folder in path
                });
                if(nestedDependencies.length){
                    async.forEach(nestedDependencies,
                        // 2nd param is the function that each item is passed to
                        function(dependencyPackageFile, callback){
                            var tipPackage = grunt.file.readJSON(dependencyPackageFile);
                            self.processNugetPackage(tipPackage,bowerConfig,params,callback)
                        },
                        // 3rd param is the function to call when everything's done
                        function(err){
                            // All tasks are done now
                            done(err);
                        }
                    );
                }else{
                    done();
                }
            }

        })
    };
    this.postInstallNugetPackages = function(){

    };
    this.installNugetPackages = function(nugetPckgFile,params,done){
        nuget.install(nugetPckgFile, _.extend(params, defaultNugetInstallOptions), function(err,data){
            if(err){
                done("Error trying to install"+err.toString());
            }else{
                done();
            }
        });
    };

    grunt.registerTask('tip-update-package-version', "update version of tip.pckg.json", function () {
        if(grunt.option('tfschangeset')) {
            var tipRootPackage = grunt.file.readJSON(distDir + '/' + defaultPackageFile);

            tipRootPackage.version = tipRootPackage.version.replace(/\.0$/, '.' + grunt.option('tfschangeset'));

            grunt.file.write(distDir + '/' + defaultPackageFile,JSON.stringify(tipRootPackage,null,4));
        }
    });

    grunt.registerTask('tip-install', "Install Bower & Nuget ", function () {
        var taskParams = this.options(),
            taskDoneCb = this.async(),
            bowerConfig;
        //Clear and recreate nuget-tmp directory
        if(grunt.file.exists(tmpDir)){
            grunt.file.delete(tmpDir);
        }
        if(grunt.file.exists(defaultOutputDirectory)){
            grunt.file.delete(defaultOutputDirectory);
        }
        grunt.file.mkdir(tmpDir);

        //load root tip.pckg.json and install root nuget dependencies
        var tmp = grunt.file.exists(distDir + '/' + defaultPackageFile) ? distDir + '/' + defaultPackageFile : defaultPackageFile;
        var tipRootPackage = grunt.file.readJSON(tmp);
        //init root bower file
        bowerConfig = _.clone(tipRootPackage);
        delete bowerConfig['nuget-dependencies'];
        //process root nuget packaging
        self.processNugetPackage(tipRootPackage,bowerConfig,taskParams,function(err){
            grunt.file.delete(tmpDir);
            if(!err){
                grunt.file.write('bower.json',JSON.stringify(bowerConfig,null,4));
                taskDoneCb();
            }else{
                grunt.fail.fatal(err);
            }

        });
    });

    grunt.registerTask('tip-nuspec', "Produce nuspec file", function () {
        var taskParams = this.options(),
            taskDoneCb = this.async(),
            nuspecConfig={
                attributes:{
                    xmlns:"http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd"
                },
                package:{
                    metadata:{

                    }
                }
            };
        //Clear and recreate nuget-tmp directory
        if(!grunt.file.exists(distDir)){//read from options
            grunt.file.mkdir(distDir);
        }
        //load root tip.pckg.json and install root nuget dependencies
        var tipRootPackageInfo = grunt.file.readJSON(distDir + '/' + defaultPackageFile);
        //init root bower file
        nuspecConfig.package.metadata.id=tipRootPackageInfo.name;
        nuspecConfig.package.metadata.version=tipRootPackageInfo.version;
        nuspecConfig.package.metadata.authors=tipRootPackageInfo.authors;
        nuspecConfig.package.metadata.description=tipRootPackageInfo.description;
        //process root nuget packaging
        grunt.file.write(distDir+'/'+tipRootPackageInfo.name+'.nuspec',helper.toXML(nuspecConfig,{header:true,attrkey:'attributes'}));
        taskDoneCb();
    });

    grunt.registerMultiTask('tip-bower', "Install or Update Bower Dependencies", function () {
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
};
