import { CommitInfo, Release, Changelog, SCOPES, SCOPE_CHANGE } from "./interfaces";

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
    const ee: Changelog = { labels: [], contributors: [] };

    ee.releaseTitle = releaseTitle;
    ee.releaseDate = release.date;

    for (const category of categoriesWithCommits) {
      let f;
      if (this.hasPackages(category.commits)) {
        f = this.renderContributionsByPackage(category.commits);
      }
      ee.labels?.push({
        name: category.name,
        scopes: f,
      });
    }

    if (release.contributors?.length) {
      ee.contributors = release.contributors;
      ee.contributorCount = release.contributors.length;
    }

    return ee;
  }

  public renderContributionsByPackage(commits: CommitInfo[]): SCOPES[] {
    // Group commits in category by package
    const commitsByPackage: { [id: string]: CommitInfo[] } = {};
    for (const commit of commits) {
      // Array of unique packages.
      const changedPackages = commit.packages || [];

      const packageName = this.renderPackageNames(changedPackages);

      commitsByPackage[packageName] = commitsByPackage[packageName] || [];
      commitsByPackage[packageName].push(commit);
    }

    const packageNames = Object.keys(commitsByPackage);

    return packageNames.map(packageName => {
      const pkgCommits = commitsByPackage[packageName];
      return {
        name: packageName,
        changes: this.renderContributionList(pkgCommits, " "),
      };
    });
  }

  public renderPackageNames(packageNames: string[]) {
    return packageNames.length > 0 ? packageNames.map(pkg => this.options.scopes[pkg]).join(", ") : "Other";
  }

  public renderContributionList(commits: CommitInfo[], prefix: string = ""): SCOPE_CHANGE[] {
    const isCommit = (commit: SCOPE_CHANGE | undefined): commit is SCOPE_CHANGE => commit !== undefined;

    return commits.map(commit => this.renderContribution(commit)).filter(isCommit);
  }

  public renderContribution(commit: CommitInfo): SCOPE_CHANGE | undefined {
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
