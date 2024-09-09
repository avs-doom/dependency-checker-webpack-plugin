const notifier = require('node-notifier');
const { validate } = require('schema-utils');
const { Worker } = require('node:worker_threads');

const validSchema = require('./options.json');

const pluginName = 'Dependency Checker Plugin';

class DependencyCheckerPlugin {
    constructor(options = {}) {
        validate(validSchema, options, {
            name: pluginName,
        });

        this.package = require(process.cwd() + '/package.json');
        this.messages = [];
        this.isSend = false;
        this.depNames = options.depNames || [];
        this.options = options.options || {};
    }

    checkVersion = async (name) =>
        Promise.all([
            import('latest-version'),
            import('semver-diff'),
        ]).then(([{ default: latestVersion }, { default: semverDiff }]) => {
            const { dependencies, devDependencies } = this.package;
            const currentVersion = (dependencies[name] || devDependencies[name] || '').trim();

            if (!currentVersion) {
                return;
            }

            return latestVersion(name).then((version) => {
                if (semverDiff(currentVersion, version)) {
                    this.messages.push({
                        name,
                        currentVersion,
                        version,
                    });
                }
            });
        });

    showToast = async () => {
        const notifyMessage = this.messages.map(
                ({ name, currentVersion, version }) => `${name} (${currentVersion} → ${version})`,
        );

        notifyMessage.unshift('Update available!');
        
        return notifier.notify({
            appID: 'Version Checker',
            title: 'Dependency Update',
            icon: process.cwd() + '/toastIcon.png',
            message: notifyMessage.join('\n'),
        });
    };

    showConsole = async () => {
        return Promise.all([
            import('boxen'),
            import('chalk')
        ]).then(([{ default: boxen }, { default: chalk }]) => {
            const consoleMessage = this.messages.map(
                    ({ name, currentVersion, version }) => `${name} ${chalk.dim(currentVersion)} → ${chalk.green(version)}`,
            );

            const workerData = boxen(consoleMessage.join('\n'), {
                margin: 1,
                padding: 1,
                align: 'left',
                title: chalk.cyan('Update available!'),
                titleAlignment: 'center',
            });

            const worker = new Worker(__dirname + '/worker.js', { workerData });

            process.on('exit', worker.terminate);
        });
    };

    apply(compiler) {
        compiler.hooks.done.tapAsync(
                pluginName,
                (_, callback) => {
                    const isWebpackServer = process.env.WEBPACK_SERVE === 'true';
                    const { devServerOnly = true, disableCertValid = false } = this.options;

                    if (disableCertValid) {
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // Disable valid certificate
                    }

                    if ((!isWebpackServer && devServerOnly) || this.isSend) {
                        callback();
                    }

                    Promise.all(
                            this.depNames.map((name) => this.checkVersion(name)),
                    ).then(async () => {
                        if (this.messages.length > 0) {
                            const { showConsole = true, showToast = true } = this.options;

                            showConsole && await this.showConsole();
                            showToast && await this.showToast();
                        }
                    }).finally(() => {
                        if (disableCertValid) {
                            process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
                        }
                        this.isSend = true;

                        callback();
                    });
                },
        );
    }
}

module.exports = DependencyCheckerPlugin;
