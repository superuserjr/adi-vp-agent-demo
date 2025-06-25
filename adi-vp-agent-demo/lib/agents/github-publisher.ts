import { exec } from 'child_process';
import { promisify } from 'util';
import type { GitHubResult } from '@/types';

const execAsync = promisify(exec);

export async function publishToGitHub(
  company: string,
  summary: string,
  email: string,
  resumePath: string
): Promise<GitHubResult> {
  // Detect environment
  const isVercel = process.env.VERCEL === '1';
  
  if (isVercel) {
    // TODO: Implement Octokit-based publishing for Vercel
    throw new Error('GitHub publishing on Vercel requires GITHUB_TOKEN and Octokit implementation');
  } else {
    // Local development: use GitHub CLI
    try {
      await execAsync('gh auth status');
    } catch (error) {
      throw new Error('GitHub CLI not authenticated. Run: gh auth login');
    }
    
    // TODO: Implement gh CLI-based publishing
    return {
      repo_url: 'https://github.com/user/repo',
      pr_url: 'https://github.com/user/repo/pull/1',
      commit_sha: 'abc123',
      files_created: [`submissions/${company}/role_summary.md`]
    };
  }
}
