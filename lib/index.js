"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const chalk = require("chalk");
const cli_highlight_1 = require("cli-highlight");
const handlebars_1 = require("handlebars");
const changelog_1 = require("./changelog");
const configuration_1 = require("./configuration");
const configuration_error_1 = require("./configuration-error");
const defaultTemplate_1 = require("./defaultTemplate");
const core_1 = require("@actions/core");
const NEXT_VERSION_DEFAULT = "Unreleased";
const getInput = (key, options) => {
    return (0, core_1.getInput)(key, options);
};
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const from = getInput("from", { required: true });
        const to = getInput("to", { required: true });
        const userTemplate = (0, core_1.getMultilineInput)("template", { required: false, trimWhitespace: true });
        const nextVersion = getInput("version_name", { required: false });
        const repo = getInput("repo", { required: false });
        let options = {
            tagFrom: from,
            tagTo: to,
        };
        try {
            let config = (0, configuration_1.load)({
                nextVersionFromMetadata: false,
                repo,
            });
            if (nextVersion !== NEXT_VERSION_DEFAULT) {
                config.nextVersion = nextVersion;
            }
            let template = (0, handlebars_1.compile)(userTemplate || defaultTemplate_1.defaultTemplate);
            let result = yield new changelog_1.default(config).createMarkdown(options);
            let highlighted = (0, cli_highlight_1.highlight)(template(result), {
                language: "Markdown",
                theme: {
                    section: chalk.bold,
                    string: chalk.hex("#0366d6"),
                    link: chalk.dim,
                },
            });
            console.log(highlighted);
            (0, core_1.setOutput)("changelog", highlighted);
        }
        catch (e) {
            if (e instanceof configuration_error_1.default) {
                (0, core_1.setFailed)(chalk.red(e.message));
            }
            else {
                (0, core_1.setFailed)(chalk.red(e.stack));
            }
            process.exitCode = 1;
        }
    });
}
exports.run = run;
