import { GitHubIssueResponse, GitHubUserResponse } from "./github-api";

export type SCOPE_CHANGE = {
  id: number;
  title: string;
  author: string;
  html_url: string;
};

export type SCOPES = {
  name: string;
  changes: SCOPE_CHANGE[];
};

export type Changelog = Partial<{
  releaseTitle: string;
  releaseDate: string;
  contributors: GitHubUserResponse[];
  contributorCount: number;
  labels: {
    name?: string;
    scopes?: SCOPES[];
  }[];
}>;

export interface CommitInfo {
  commitSHA: string;
  message: string;
  tags?: string[];
  date: string;
  issueNumber: string | null;
  githubIssue?: GitHubIssueResponse;
  categories?: string[];
  packages?: string[];
}

export interface Release {
  name: string;
  date: string;
  commits: CommitInfo[];
  contributors?: GitHubUserResponse[];
}
