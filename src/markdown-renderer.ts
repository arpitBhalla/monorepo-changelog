import { CommitInfo, Release, Changelog, TChange, GroupedChanges, TCommit } from "./interfaces";

const UNRELEASED_TAG = "___unreleased___";
const COMMIT_FIX_REGEX = /(fix|close|resolve)(e?s|e?d)? [T#](\d+)/i;

interface CategoryInfo {
  name: string | undefined;
  commits: CommitInfo[];
}

interface Options {
  categories: string[];
  baseIssueUrl: string;
  unreleasedName: string;
  scopes: { [key: string]: string };
  groupBy: "labels" | "scopes";
}

export default class MarkdownRenderer {
  private options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  public renderMarkdown(releases: Release[]) {
    return releases.map(release => this.renderRelease(release));
  }

  public renderRelease(release: Release): Changelog {
    // Group commits in release by category
    const categories = this.groupByCategory(release.commits);
    const categoriesWithCommits = categories.filter(category => category.commits.length > 0);

    // Skip this iteration if there are no commits available for the release
    if (categoriesWithCommits.length === 0) return {};

    const releaseTitle = release.name === UNRELEASED_TAG ? this.options.unreleasedName : release.name;
    const changelog: Changelog = { contribution: [], contributors: [] };

    changelog.releaseTitle = releaseTitle;
    changelog.releaseDate = release.date;

    changelog.contribution = this.renderContributionByKey(release.commits, this.options.groupBy);

    if (release.contributors?.length) {
      changelog.contributors = release.contributors;
      changelog.contributorCount = release.contributors.length;
    }

    return changelog;
  }

  public renderContributionByKey(
    commits: CommitInfo[],
    groupByKey: "labels" | "scopes",
    restGroupByKey: "labels" | "scopes" = groupByKey !== "labels" ? "labels" : "scopes"
  ): GroupedChanges[] {
    const groupedChangeLog: Record<string, GroupedChanges> = {};

    for (const commit of commits) {
      const issue = commit.githubIssue;
      if (issue && issue.number && commit.categories?.length && issue.pull_request && issue.pull_request.html_url) {
        // if (issue.title && issue.title.match(COMMIT_FIX_REGEX)) {
        //   issue.title = issue.title.replace(COMMIT_FIX_REGEX, `Closes [#$3](${this.options.baseIssueUrl}$3)`);
        // }

        const change: TChange = {
          labels: commit.categories || [],
          scopes: this.renderPackageNames(commit.packages || []) || [],
          id: issue.number,
          html_url: issue.pull_request.html_url || "",
          title: issue.title,
          author: issue.user.login,
        };

        const key1 = change[groupByKey]?.join(", ") || "Unlabeled";
        const key2 = change[restGroupByKey]?.join(", ") || "";

        if (!groupedChangeLog[key1]) {
          groupedChangeLog[key1] = {
            name: key1,
            changes: [],
          };
        }
        const index = groupedChangeLog[key1].changes.findIndex(c => c.name === key2);
        const ChangeCommit = {
          id: change.id,
          title: change.title,
          author: change.author,
          html_url: change.html_url,
        };

        if (index === -1) {
          groupedChangeLog[key1].changes.push({
            name: change?.[restGroupByKey]?.join(", ") || "Other",
            commits: [ChangeCommit],
          });
        } else {
          groupedChangeLog[key1].changes[index].commits.push(ChangeCommit);
        }
      }
    }
    return Object.values(groupedChangeLog);
  }

  // public renderContributionsByPackage(commits: CommitInfo[]): any[] {
  //   // Group commits in category by package
  //   const commitsByPackage: { [id: string]: CommitInfo[] } = {};
  //   for (const commit of commits) {
  //     // Array of unique packages.
  //     const changedPackages = commit.packages || [];

  //     const packageName = this.renderPackageNames(changedPackages);

  //     commitsByPackage[packageName] = commitsByPackage[packageName] || [];
  //     commitsByPackage[packageName].push(commit);
  //   }

  //   const packageNames = Object.keys(commitsByPackage);

  //   return packageNames.map(packageName => {
  //     const pkgCommits = commitsByPackage[packageName];
  //     return {
  //       name: packageName,
  //       changes: this.renderContributionList(pkgCommits, " "),
  //     };
  //   });
  // }

  public renderPackageNames(packageNames: string[]) {
    return packageNames?.length > 0 ? packageNames.map(pkg => this.options.scopes[pkg]).filter(Boolean) : ["Other"];
  }

  public renderContributionList(commits: CommitInfo[], prefix: string = ""): any[] {
    const isCommit = (commit: any | undefined): commit is any => commit !== undefined;

    return commits.map(commit => this.renderContribution(commit)).filter(isCommit);
  }

  public renderContribution(commit: CommitInfo): any | undefined {
    const issue = commit.githubIssue;
    if (issue && issue.number && issue.pull_request && issue.pull_request.html_url) {
      // if (issue.title && issue.title.match(COMMIT_FIX_REGEX)) {
      //   issue.title = issue.title.replace(COMMIT_FIX_REGEX, `Closes [#$3](${this.options.baseIssueUrl}$3)`);
      // }

      return {
        id: issue.number,
        html_url: issue.pull_request.html_url,
        title: issue.title,
        author: issue.user.login,
      };
    }
  }

  private hasPackages(commits: CommitInfo[]) {
    return commits.some(commit => commit.packages !== undefined && commit.packages.length > 0);
  }

  private groupByCategory(allCommits: CommitInfo[]): CategoryInfo[] {
    return this.options.categories.map(name => {
      // Keep only the commits that have a matching label with the one
      // provided in the lerna.json config.
      let commits = allCommits.filter(commit => commit.categories && commit.categories.indexOf(name) !== -1);

      return { name, commits };
    });
  }
}
