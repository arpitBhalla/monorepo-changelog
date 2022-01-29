const { actions } = require("./src/actions.yml");
const { writeFileSync, readFileSync } = require("fs");

const TAB = "  ";

/**
 * Action YML
 */
let YMLFormat = `name: "Changelog Action for monorepo"
description: "Lerna Monorepo Changelog Generator"
author: "arpitBhalla"
branding:
${TAB}icon: "file-text"
${TAB}color: "blue"
inputs:
`;

actions.forEach(action => {
  YMLFormat += `${TAB}${action.name}:
${TAB}${TAB}description: "${action.description}"
${TAB}${TAB}required: ${action.required}
${TAB}${TAB}default: "${action.default}"
`;
});

YMLFormat += `
outputs:
  changelog:
    description: "Generated changelog"
runs:
  using: "node16"
  main: "src/index.ts"`;

writeFileSync("action.yml", YMLFormat);
console.log("action.yml created");

/**
 * Markdown
 */

let Markdown_Table = `
### Input
| Action | Description | Default |
| ------ | ----------- | ------- |
`;

actions.forEach(action => {
  Markdown_Table += `| \`${action.name}\` ${action.required ? "**(required)**" : ""}| ${action.description} | ${
    action.default ? `\`${action.default}\`` : ""
  } |\n`;
});

Markdown_Table += `
### Output
| Action | Description |
| ------ | ----------- |
| \`changelog\` | Generated changelog |
`;

const ReadME = readFileSync("README.md").toString();
const startIndex = ReadME.indexOf("<!--input-start--->") + "<!--input-start--->".length;
const endIndex = ReadME.indexOf("<!--input-end--->");

const NewReadME = ReadME.slice(0, startIndex) + Markdown_Table + ReadME.slice(endIndex);

writeFileSync("README.md", NewReadME);
console.log("README.md updated");
