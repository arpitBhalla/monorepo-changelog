const { actions } = require("./src/actions.yml");
const { writeFileSync, readFileSync } = require("fs");

const TAB = "  ";

/**
 * Action YML
 */
let YMLFormat = "";

actions.forEach(action => {
  YMLFormat += `
${TAB}${action.name}:
${TAB}${TAB}description: "${action.description}"
${TAB}${TAB}required: ${action.required}
${TAB}${TAB}default: "${action.default}"
`;
});

const YML = readFileSync("action.yml").toString();
const startYMLIndex = YML.indexOf("## actions-start") + "## actions-start".length;
const endYMLIndex = YML.indexOf("## actions-end");

const NewYML = YML.slice(0, startYMLIndex) + YMLFormat + YML.slice(endYMLIndex);

writeFileSync("action.yml", NewYML);
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
