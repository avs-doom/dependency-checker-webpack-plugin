const notifier = require('node-notifier');
const { validate } = require('schema-utils');

const validSchema = require('./options.json');

const pluginName = 'Version Checker Plugin';

class VersionCheckerPlugin {
    constructor(options = {}) {
        validate(validSchema, options, {
            name: pluginName,
        });

        this.package = require(process.cwd() + '/package.json');

        this.messages = [];

        this.depNames = options.depNames || [];

        this.options = options.options || {};
    }

    checkVersion = async (name) =>
        Promise.all([
            import('latest-version'),
            import('semver-diff'),
        ]).then(async ([{ default: latestVersion }, { default: semverDiff }]) => {
            const currentVersion = (
                this.package.dependencies[name] ||
                this.package.devDependencies[name] ||
                ''
            ).trim();

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
        });

    showToast = () => {
        const notifyMessage = this.messages.map(
                ({ name, currentVersion, version }) => `${name} (${currentVersion} → ${version})`,
        );

        notifyMessage.unshift('Update available!');
        
        notifier.notify({
            appID: 'Version Checker',
            title: 'Update',
            message: notifyMessage.join('\n'),
        });
    };

    showConsole = () => {
        Promise.all([
            import('boxen'),
            import('chalk'),
        ]).then(async ([{ default: boxen }, { default: chalk }]) => {
            const consoleMessage = this.messages.map(
                    ({ name, currentVersion, version }) => `${name} ${chalk.dim(currentVersion)} → ${chalk.green(version)}`,
            );

            console.log(boxen(consoleMessage.join('\n'), {
                margin: 1,
                padding: 1,
                align: 'left',
                title: chalk.cyan('Update available!'),
                titleAlignment: 'center',
            }));
        });
    };

    apply(compiler) {
        compiler.hooks.done.tapAsync(
                pluginName,
                (_compilation, callback) => {
                    const isWebpackServer = process.env.WEBPACK_SERVE === 'true';
                    const { devServerOnly = true, disableCertValid = false } = this.options;

                    if (disableCertValid) {
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; // Disable valid certificate
                    }

                    if (!isWebpackServer && devServerOnly) {
                        return;
                    }

                    Promise.all(
                            this.depNames.map((name) => this.checkVersion(name)),
                    ).then(() => {
                        if (this.messages.length > 1) {
                            const { showConsole = true, showToast = true } = this.options;

                            showToast && this.showToast();
                            showConsole && this.showConsole();
                        }
                    }).finally(() => {
                        if (disableCertValid) {
                            process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
                        }
                        callback();
                    });
                },
        );
    }
}

module.exports = VersionCheckerPlugin;
