"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTemplate = void 0;
exports.defaultTemplate = `
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
