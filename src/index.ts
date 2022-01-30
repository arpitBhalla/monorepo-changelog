import chalk = require("chalk");

import { highlight } from "cli-highlight";
import { compile } from "handlebars";

import Changelog from "./changelog";
import { load as loadConfig } from "./configuration";
import ConfigurationError from "./configuration-error";
import { defaultTemplate } from "./defaultTemplate";

import { getInput as getInputCore, setOutput, setFailed, getMultilineInput, info, InputOptions } from "@actions/core";
import { ActionKeyT } from "./actions.yml";

const NEXT_VERSION_DEFAULT = "Unreleased";

const getInput = (key: ActionKeyT, options?: InputOptions | undefined) => {
  return getInputCore(key, options);
};

export async function run() {
  const GITHUB_AUTH = getInput("GITHUB_AUTH", { required: false });
  const groupBy = getInput("group-by", { required: false });
  const from = getInput("from", { required: false });
  const to = getInput("to", { required: false });
  const userTemplate = getMultilineInput("template", { required: false, trimWhitespace: true }).join("\n");
  const nextVersion = getInput("version_name", { required: false });
  const repo = getInput("repo", { required: false });

  let options = {
    tagFrom: from,
    tagTo: to,
  };

  try {
    let config = loadConfig({
      nextVersionFromMetadata: false,
      repo,
    });

    config.GITHUB_AUTH = GITHUB_AUTH;
    config.groupBy = (groupBy as "labels" | "scopes") || "labels";

    if (nextVersion !== NEXT_VERSION_DEFAULT) {
      config.nextVersion = nextVersion;
    }

    let template = compile(userTemplate || defaultTemplate);
    let result = await new Changelog(config).createMarkdown(options);

    let highlighted = highlight(template(result), {
      language: "Markdown",
      theme: {
        section: chalk.bold,
        string: chalk.hex("#0366d6"),
        link: chalk.dim,
      },
    });

    info(highlighted);
    setOutput("changelog", highlighted);
  } catch (e) {
    if (e instanceof ConfigurationError) {
      setFailed(chalk.red(e.message));
    } else {
      setFailed(chalk.red((e as any).stack));
    }

    process.exitCode = 1;
  }
}

run();
