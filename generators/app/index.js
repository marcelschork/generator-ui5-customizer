'use strict';
const Generator = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay');

module.exports = class extends Generator {
    static displayName = 'Create and customize a new OpenUI5/SAPUI5 project';

    prompting() {
        if (!this.options.embedded) {
            this.log(yosay(`Welcome to the ${chalk.red('easy-ui5-project-customizer')} generator!`));
        }

        this.composeWith(require.resolve('generator-template-ui5-project/generators/app'), {
            embedded: true,
        });
        this.composeWith(require.resolve('../customizer'));
    }
};
