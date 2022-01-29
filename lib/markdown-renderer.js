"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UNRELEASED_TAG = "___unreleased___";
const COMMIT_FIX_REGEX = /(fix|close|resolve)(e?s|e?d)? [T#](\d+)/i;
class MarkdownRenderer {
    constructor(options) {
        this.options = options;
    }
    renderMarkdown(releases) {
        return releases.map(release => this.renderRelease(release));
    }
    renderRelease(release) {
        var _a, _b;
        const categories = this.groupByCategory(release.commits);
        const categoriesWithCommits = categories.filter(category => category.commits.length > 0);
        if (categoriesWithCommits.length === 0)
            return {};
        const releaseTitle = release.name === UNRELEASED_TAG ? this.options.unreleasedName : release.name;
        const ee = { labels: [], contributors: [] };
        ee.releaseTitle = releaseTitle;
        ee.releaseDate = release.date;
        for (const category of categoriesWithCommits) {
            let f;
            if (this.hasPackages(category.commits)) {
                f = this.renderContributionsByPackage(category.commits);
            }
            (_a = ee.labels) === null || _a === void 0 ? void 0 : _a.push({
                name: category.name,
                scopes: f,
            });
        }
        if ((_b = release.contributors) === null || _b === void 0 ? void 0 : _b.length) {
            ee.contributors = release.contributors;
            ee.contributorCount = release.contributors.length;
        }
        return ee;
    }
    renderContributionsByPackage(commits) {
        const commitsByPackage = {};
        for (const commit of commits) {
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
    renderPackageNames(packageNames) {
        return packageNames.length > 0 ? packageNames.map(pkg => this.options.scopes[pkg]).join(", ") : "Other";
    }
    renderContributionList(commits, prefix = "") {
        const isCommit = (commit) => commit !== undefined;
        return commits.map(commit => this.renderContribution(commit)).filter(isCommit);
    }
    renderContribution(commit) {
        const issue = commit.githubIssue;
        if (issue && issue.number && issue.pull_request && issue.pull_request.html_url) {
            return {
                id: issue.number,
                html_url: issue.pull_request.html_url,
                title: issue.title,
                author: issue.user.login,
            };
        }
    }
    hasPackages(commits) {
        return commits.some(commit => commit.packages !== undefined && commit.packages.length > 0);
    }
    groupByCategory(allCommits) {
        return this.options.categories.map(name => {
            let commits = allCommits.filter(commit => commit.categories && commit.categories.indexOf(name) !== -1);
            return { name, commits };
        });
    }
}
exports.default = MarkdownRenderer;
