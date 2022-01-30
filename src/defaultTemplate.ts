export const defaultTemplate = `
{{#each .}}

## {{releaseTitle}}

__{{releaseDate}}__

{{#each contribution}}

###  {{ name }}

{{#each changes}}

#### \`{{name}}\`

{{#each commits}}
- [#{{id}}]({{html_url}}) {{title}} by @{{author}}
{{/each}}
{{/each}}
---
{{/each}}

Thanks to {{contributorCount}} contributors namely {{#each contributors}}@{{login}}{{#unless @last}},{{/unless}} {{/each}}

{{/each }}
`;
