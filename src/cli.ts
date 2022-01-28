import chalk = require("chalk");

import { highlight } from "cli-highlight";
import { compile } from "handlebars";

import Changelog from "./changelog";
import { load as loadConfig } from "./configuration";
import ConfigurationError from "./configuration-error";
import { defaultTemplate } from "./defaultTemplate";

import { getInput, setOutput, setFailed } from "@actions/core";

const NEXT_VERSION_DEFAULT = "Unreleased";

export async function run() {
  const from = getInput("from", { required: true });
  const to = getInput("to", { required: true });
  const tagFrom = getInput("tagFrom", { required: false });
  const tagTo = getInput("tagTo", { required: false });
  const changelog = getInput("changelog", { required: true });
  const template = getInput("template", { required: false });
  const nextVersion = getInput("nextVersion", { required: false });
  const tagPrefix = getInput("tagPrefix", { required: false });
  const tagSuffix = getInput("tagSuffix", { required: false });
  const repo = getInput("repo", { required: false });

  let options = {
    tagFrom: from || tagFrom,
    tagTo: to || tagTo,
  };

  try {
    let config = loadConfig({
      nextVersionFromMetadata: false,
      repo,
    });

    if (nextVersion !== NEXT_VERSION_DEFAULT) {
      config.nextVersion = nextVersion;
    }

    let template = compile(defaultTemplate);
    let result = await new Changelog(config).createMarkdown(options);

    let highlighted = highlight(template(result), {
      language: "Markdown",
      theme: {
        section: chalk.bold,
        string: chalk.hex("#0366d6"),
        link: chalk.dim,
      },
    });

    console.log(highlighted);
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
