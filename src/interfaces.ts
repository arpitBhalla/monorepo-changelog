import { GitHubIssueResponse, GitHubUserResponse } from "./github-api";

export type GroupedChanges = {
  name: string;
  changes: {
    name: string;
    commits: TCommit[];
  }[];
};

export type Changelog = Partial<{
  releaseTitle: string;
  releaseDate: string;
  contributors: GitHubUserResponse[];
  contributorCount: number;
  contribution: GroupedChanges[];
}>;

export type TChange = {
  labels?: string[];
  scopes?: string[];
} & TCommit;

export type TCommit = {
  id: number;
  title: string;
  author: string;
  html_url: string;
};

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
