import { Compiler } from "webpack";
export = VersionCheckerPlugin;

declare class VersionCheckerPlugin {
    constructor(options?: VersionCheckerPlugin.Options);

    apply(compiler: Compiler): void;

    private messages: string[];
    private depNames: VersionCheckerPlugin.Options['depNames'];
    private options: VersionCheckerPlugin.Options['options'];

    static checkVersion(
        name: string
    ): Promise<void>;

    static showToast(): void;
    static showConsole(): void;
}

declare namespace VersionCheckerPlugin {
    interface Options {
        depNames: string[];
        options?: {
            showToast?: boolean;
            showConsole?: boolean;
            devServerOnly?: boolean;
            disableCertValid?: boolean;
        };
    }
}
