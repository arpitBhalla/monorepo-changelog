# lerna-changelog action

[![test.yml/badge](https://github.com/Slime-hatena/lerna-changelog-action/actions/workflows/test.yml/badge.svg)](https://github.com/slime-hatena/lerna-changelog-action/actions/workflows/test.yml)

Use lerna-changelog in GitHub action.

Useful for creating such an automatic release action.
[slime-hatena/pull-request-based-release-template](https://github.com/slime-hatena/pull-request-based-release-template)

## Configuration

### Input

| Name                       | Description                                                                                              | Default                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `GITHUB_AUTH`              | (Required) Specify a token that is authorized for the repository. Usually, specify secrets.GITHUB_TOKEN. |                                              |
| `label_settings_file_path` | Specify the file path of the json file for label settings.                                               | `'./.github/semantic_versioning_label.json'` |
| `tag_from`                 | Specify the start position to generate changelog. For example: origin/main, 4b825dc6, etc.               | `'4b825dc642cb6eb9a060e54bf8d69288fbee4904'` |
| `tag_to`                   | Specify the end position to generate changelog. For example: origin/main, 4b825dc6, etc.                 | `'origin/main'`                              |
| `release_title`            | Specify the name of the next version. If not specified, it will be "Unreleased (YYYY-MM-DD)".            | `''`                                         |
| `remove_title_line`        | Remove the title line from the changelog.                                                                | `'true'`                                     |

### Output

| Name       | Description          |
| ---------- | -------------------- |
| `markdown` | Generated changelog. |

## Example

### Action settings

```yml
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
      - uses: slime-hatena/lerna-changelog-action@main
        id: changelog
        with:
          GITHUB_AUTH: "${{ secrets.GITHUB_TOKEN }}"
          tag_from: "4b825dc642cb6eb9a060e54bf8d69288fbee4904" #empty tree
          tag_to: "origin/main"
      - run: echo "${{steps.changelog.outputs.markdown}}"
```

### LABEL_SETTING_FILE_PATH (./.github/semantic_versioning_label.json)

```jsonc
{
  // Label name : Heading text in changelog.
  "Type: Breaking Change": "Breaking Change",
  "Type: Feature": "Feature",
  "Type: Bug": "Bug fix",
  "Type: Maintenance": "Maintenance",
  "Type: Documentation": "Documentation",
  "Type: Refactoring": "Refactoring"
}
```

### Result

```md
#### Feature

- [#18](https://github.com/Slime-hatena/lerna-changelog-action/pull/18) chore(yarn): add lerna-changelog ([@Slime-hatena](https://github.com/Slime-hatena))

#### Maintenance

- [#1](https://github.com/Slime-hatena/lerna-changelog-action/pull/1) Bump @types/node from 14.14.9 to 15.3.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#2](https://github.com/Slime-hatena/lerna-changelog-action/pull/2) Bump @actions/core from 1.2.6 to 1.2.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#3](https://github.com/Slime-hatena/lerna-changelog-action/pull/3) Bump eslint-plugin-jest from 24.1.3 to 24.3.6 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 2

- Slime-hatena ([@Slime-hatena](https://github.com/Slime-hatena))
- [@dependabot[bot]](https://github.com/apps/dependabot)
```

### Result with title

```md
## Unreleased (2021-05-27)

#### Feature

- [#18](https://github.com/Slime-hatena/lerna-changelog-action/pull/18) chore(yarn): add lerna-changelog ([@Slime-hatena](https://github.com/Slime-hatena))

#### Maintenance

- [#1](https://github.com/Slime-hatena/lerna-changelog-action/pull/1) Bump @types/node from 14.14.9 to 15.3.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#2](https://github.com/Slime-hatena/lerna-changelog-action/pull/2) Bump @actions/core from 1.2.6 to 1.2.7 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#3](https://github.com/Slime-hatena/lerna-changelog-action/pull/3) Bump eslint-plugin-jest from 24.1.3 to 24.3.6 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 2

- Slime-hatena ([@Slime-hatena](https://github.com/Slime-hatena))
- [@dependabot[bot]](https://github.com/apps/dependabot)
```

## Acknowledgements

- [lerna/lerna-changelog](https://github.com/lerna/lerna-changelog)
- [actions/typescript-action](https://github.com/actions/typescript-action)
- [actions/javascript-action](https://github.com/actions/javascript-action)
