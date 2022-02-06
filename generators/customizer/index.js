'use strict';
const Generator = require('yeoman-generator'),
    //fileaccess = require('../../helpers/fileaccess'),
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

    end() {
        this.spawnCommandSync('git', ['add', '.'], {
            cwd: this.destinationPath(),
        });
        this.spawnCommandSync(
            'git',
            ['commit', '--quiet', '--allow-empty', '-m', 'Customize easy-ui5 project template'],
            {
                cwd: this.destinationPath(),
            }
        );
    }
};
