'use strict';
const Generator = require('yeoman-generator'),
    { manipulateJSON, manipulateYAML } = require('generator-template-ui5-project/helpers/fileaccess'),
    path = require('path'),
    glob = require('glob');

module.exports = class extends Generator {
    async writing() {
        const oConfig = this.config.getAll();

        this.sourceRoot(path.join(__dirname, 'templates'));
        glob.sync('**', {
            cwd: this.sourceRoot(),
            nodir: true,
        }).forEach((file) => {
            const sOrigin = this.templatePath(file);
            const sTarget = this.destinationPath(file.replace(/^_/, '').replace(/\/_/, '/'));

            this.fs.copyTpl(sOrigin, sTarget, oConfig);
        });
    }

    async extendPackageJson() {
        const oPackageJsonExtension = {
            devDependencies: {
                'ui5-middleware-livetranspile': '^0.3.5',
                'ui5-task-transpile': '^0.3.4',
            },
            ui5: {
                dependencies: ['ui5-task-transpile', 'ui5-middleware-livetranspile'],
            },
        };
        await manipulateJSON.call(this, '/package.json', oPackageJsonExtension);
    }

    async install() {
        const oUi5YamlExtension = {
            server: {
                customMiddleware: [
                    {
                        name: 'ui5-middleware-livetranspile',
                        afterMiddleware: 'compression',
                        configuration: {
                            transpileAsync: true,
                        },
                    },
                ],
            },
            builder: {
                customTasks: [
                    {
                        name: 'ui5-task-transpile',
                        afterTask: 'replaceVersion',
                        configuration: {
                            transpileAsync: true,
                        },
                    },
                ],
            },
        };
        await manipulateYAML.call(this, '/uimodule/ui5.yaml', oUi5YamlExtension);
    }
};
