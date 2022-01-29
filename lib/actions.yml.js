"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actions = void 0;
exports.actions = [
    {
        name: "GITHUB_AUTH",
        description: "Personal Access Token with read permission",
        type: "string",
        required: true,
        default: "",
    },
    {
        name: "from",
        description: "The current version of the project (SHA or Tag)",
        type: "string",
        required: false,
        default: "",
    },
    {
        name: "to",
        description: "The next version of the project (SHA or Tag)",
        type: "string",
        required: false,
        default: "",
    },
    {
        name: "template",
        description: "Handlebar template for Changelog",
        type: "string",
        required: false,
        default: "DefaultTemplate",
    },
    {
        name: "version_name",
        description: " Title for unreleased commits (e.g. Unreleased)",
        type: "string",
        required: false,
        default: "Unreleased",
    },
    {
        name: "repo",
        description: "Your `org/repo` on GitHub (automatically inferred from the package.json file)",
        type: "string",
        required: false,
        default: "",
    },
    {
        name: "language",
        description: "Language of the changelog",
        type: "string",
        required: false,
        default: "Markdown",
    },
];
