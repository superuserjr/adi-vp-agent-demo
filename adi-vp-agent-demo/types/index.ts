export interface JDSummary {
  company_name: string;
  summary: string;
  key_requirements: string[];
  company_context: string;
}

export interface EmailDraft {
  email_body: string;
  subject: string;
  confidence_score: number;
}

export interface GitHubResult {
  repo_url: string;
  pr_url: string;
  commit_sha: string;
  files_created: string[];
}

export interface TaskResult {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  agents: {
    jd_summarizer?: JDSummary;
    email_drafter?: EmailDraft;
    github_publisher?: GitHubResult;
  };
}
