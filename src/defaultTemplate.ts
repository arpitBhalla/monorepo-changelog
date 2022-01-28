export const defaultTemplate = `
{{#each .}}

## {{releaseTitle}}

__{{releaseDate}}__

{{#each labels}}

###  {{ name }}

{{#each scopes }}

#### \`{{name}}\`

{{#each changes}}
- [#{{id}}]({{html_url}}) {{title}} by @{{author}}
{{/each}}
{{/each}}
---
{{/each}}

Thanks to {{contributorCount}} contributors namely {{#each contributors}}[@{{login}}]({{url}}){{#unless @last}},{{/unless}} {{/each}}

{{/each }}
`;
