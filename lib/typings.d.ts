import { Compiler } from "webpack";
export = DependencyCheckerWebpackPlugin;

declare class DependencyChecker {
    constructor(options?: DependencyCheckerWebpackPlugin.Options);

    apply(compiler: Compiler): void;

    private messages: string[];
    private depNames: DependencyCheckerWebpackPlugin.Options['depNames'];
    private options: DependencyCheckerWebpackPlugin.Options['options'];

    static checkVersion(
        name: string
    ): Promise<void>;

    static showToast(): void;
    static showConsole(): void;
}

declare namespace DependencyCheckerWebpackPlugin {
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
