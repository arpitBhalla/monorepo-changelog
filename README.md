## Generate template based changelog or release-notes for multi-scope projects

Use `lerna-changelog` in GitHub action.

## Usage

```yml
- uses: arpitBhalla/lerna-changelog-action@master
  with:
    GITHUB_AUTH: "${{ secrets.GITHUB_TOKEN }}"
    from: "1.2.0"
```

See [example](#example)

## Configuration

You can configure by adding a changelog key to the package.json file of your project:

```jsonc
// ./package.json
{
  // ...
  "changelog": {
    "labels": {
      "PR: Breaking Change": "Breaking Change",
      "PR: Feature": "Feature",
      "PR: Bug": "Bug fix",
      "PR: Maintenance": "Maintenance",
      "PR: Docs": "Docs",
      "PR: Refactoring": "Refactoring"
    },
    "scopes": {
      "native-app": "Native App",
      "website/docs": "Docs"
    }
  }
}
```

<!--input-start--->

### Input

| Action                       | Description                                                                   | Default           |
| ---------------------------- | ----------------------------------------------------------------------------- | ----------------- |
| `GITHUB_AUTH` **(required)** | Personal Access Token with read permission                                    |                   |
| `from`                       | The current version of the project (SHA or Tag)                               |                   |
| `to`                         | The next version of the project (SHA or Tag)                                  |                   |
| `template`                   | Handlebar template for Changelog                                              | `DefaultTemplate` |
| `version_name`               | Title for unreleased commits (e.g. Unreleased)                                | `Unreleased`      |
| `repo`                       | Your `org/repo` on GitHub (automatically inferred from the package.json file) |                   |
| `language`                   | Language of the changelog                                                     | `Markdown`        |

### Output

| Action      | Description         |
| ----------- | ------------------- |
| `changelog` | Generated changelog |

<!--input-end--->

## Example

### Github Action

```yml
# .github/workflows/changelog.yml
name: "generate changelog"
on:
  push:
    branches:
      - main
jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      # To reference old commits, fetch-depth: 0 is required.
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: arpitBhalla/lerna-changelog-action@master
        id: changelog
        with:
          GITHUB_AUTH: "${{ secrets.GITHUB_TOKEN }}"
          from: "1.2.0"
          to: "origin/main"
          template: |
            {{#each .}}
            ## {{releaseTitle}} (__{{releaseDate}}__)

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
      - run: echo "${{steps.changelog.outputs.markdown}}"
```

### Output

```md
## Unreleased (2021-05-27)

### Feature

#### \`Native App\`

- [#18](https://github.com/{{owner}}/{{repo}}/pull/18) chore(yarn): add lerna-changelog ([@{{owner}}](https://github.com/{{owner}}))

### Maintenance

#### \`Native App\`

- [#1](https://github.com/{{owner}}/{{repo}}/pull/1) Bump @types/node from 14.14.9 to 15.3.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#2](https://github.com/{{owner}}/{{repo}}/pull/2) Bump @actions/core from 1.2.6 to 1.2.7 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### \`Docs\`

- [#3](https://github.com/{{owner}}/{{repo}}/pull/3) Bump eslint-plugin-jest from 24.1.3 to 24.3.6 ([@dependabot[bot]](https://github.com/apps/dependabot))

Thanks to 1 contributors namely [@arpitBhalla](https://github.com/arpitBhalla)
```

## Template for Changelog

### Template configuration

| Key      | Description           |
| -------- | --------------------- |
| `labels` | Map of label to scope |
| `scopes` | Map of scope to label |

### Default Template

```handlebars
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

{{/each}}

Thanks to {{contributorCount}} contributors namely {{#each contributors}}[@{{login}}]({{url}}){{#unless @last}},{{/unless}} {{/each}}

{{/each }}
```

### Output for this template

## Acknowledgements

- [lerna/lerna-changelog](https://github.com/lerna/lerna-changelog)
