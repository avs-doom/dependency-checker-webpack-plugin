const os = require('os');
const boxen = require('boxen');
const chalk = require('chalk');
const notifier = require('node-notifier');
const semverDiff = require('semver-diff');
const latestVersion = require('latest-version');
const { Worker } = require('node:worker_threads');
const { validate } = require('schema-utils');

const validSchema = require('./options.json');

const pluginName = 'Dependency Checker Plugin';

class DependencyCheckerPlugin {
    constructor(options = {}) {
        validate(validSchema, options, {
            name: pluginName,
        });

        this.package = require(`${process.cwd()}/package.json`);
        this.messages = [];
        this.isSend = false;
        this.depNames = options.depNames || [];
        this.options = options.options || {};
    }

    checkVersion = async (name) => {
        const { dependencies, devDependencies } = this.package;
        const currentVersion = (dependencies[name] || devDependencies[name] || '').trim();

        if (!currentVersion) {
            return;
        }

        const version = await latestVersion(name);

        if (semverDiff(currentVersion, version)) {
            this.messages.push({
                name,
                currentVersion,
                version,
            });
        }
    };

    showToast = () => {
        const notifyMessage = this.messages.map(
            ({ name, currentVersion, version }) => `${name} (${currentVersion} → ${version})`,
        );

        let separator = '\n';

        if (os.type() === 'Linux') {
            separator = '\r';
        }

        return notifier.notify({
            appID: 'Webpack',
            icon: `${__dirname}/assets/webpack.svg`,
            title: 'Update available!',
            message: notifyMessage.join(separator),
        });
    };

    showConsole = () => {
        const consoleMessage = this.messages.map(
            ({ name, currentVersion, version }) =>
                `${name} ${chalk.dim(currentVersion)} → ${chalk.green(version)}`,
        );

        const workerData = boxen(consoleMessage.join('\n'), {
            margin: 1,
            padding: 1,
            align: 'left',
            title: chalk.cyan('Update available!'),
            titleAlignment: 'center',
        });

        new Worker(`${__dirname}/worker.js`, { workerData });
    };

    apply(compiler) {
        compiler.hooks.done.tapAsync(pluginName, (_, callback) => {
            const isWebpackServer = process.env.WEBPACK_SERVE === 'true';
            const { devServerOnly = true, disableCertValid = false } = this.options;

            if (disableCertValid) {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // Disable valid certificate
            }

            if ((!isWebpackServer && devServerOnly) || this.isSend) {
                return callback();
            }

            Promise.all(this.depNames.map((name) => this.checkVersion(name)))
                .then(() => {
                    if (this.messages.length > 0) {
                        const { showConsole = true, showToast = true } = this.options;

                        showConsole && this.showConsole();
                        showToast && this.showToast();
                    }
                })
                .finally(() => {
                    if (disableCertValid) {
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
                    }

                    this.isSend = true;

                    callback();
                });
        });
    }
}

module.exports = DependencyCheckerPlugin;
