'use strict';
const Generator = require('yeoman-generator'),
    { manipulateJSON, manipulateYAML } = require('generator-template-ui5-project/helpers/fileaccess'),
    path = require('path'),
    glob = require('glob');

module.exports = class extends Generator {
    async writing() {
        const config = this.config.getAll();

        this.sourceRoot(path.join(__dirname, 'templates'));
        glob.sync('**', {
            cwd: this.sourceRoot(),
            nodir: true,
        }).forEach((file) => {
            const origin = this.templatePath(file);
            const target = this.destinationPath(file.replace(/^_/, '').replace(/\/_/, '/'));

            this.fs.copyTpl(origin, target, config);
        });
    }

    async extendPackageJson() {
        const packageJsonExtension = {
            scripts: {
                cowsay: 'cowsay "UI5ers live <3"',
            },
            devDependencies: {
                'ui5-middleware-livetranspile': '^0.3.5',
                'ui5-task-transpile': '^0.3.4',
                cowsay: '^1.5.0',
            },
            ui5: {
                dependencies: ['ui5-task-transpile', 'ui5-middleware-livetranspile'],
            },
        };
        await manipulateJSON.call(this, '/package.json', packageJsonExtension);
    }

    /*
     * We have to overwrite the ui5.yaml in the install task since the community app generator
     * uses a subgenerator for scaffolding the webapp folder and the ui5.yaml.
     * This subgenerator is composed in the writing task and therefore runs
     * after the writing task of the customizer generator.
     */
    async install() {
        const ui5YamlExtension = {
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
        await manipulateYAML.call(this, '/uimodule/ui5.yaml', ui5YamlExtension);
    }

    end() {
        this.spawnCommandSync('npm', ['run', 'cowsay'], {
            cwd: this.destinationPath(),
        });
    }
};
