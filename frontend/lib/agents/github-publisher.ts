import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { GitHubResult, JDSummary, EmailDraft } from '@/types';

const execAsync = promisify(exec);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function publishToGitHub(
  companyName: string,
  jdSummary: JDSummary,
  emailDraft: EmailDraft,
  resume: string
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
    
    // Create folder structure at repository root
    const companySlug = slugify(companyName);
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5); // YYYY-MM-DDTHH-MM-SS
    
    // Get the repository root (parent directory)
    const repoRoot = join(process.cwd(), '..');
    const submissionDir = join(repoRoot, 'submissions', companySlug, timestamp);
    
    // Create directory
    await mkdir(submissionDir, { recursive: true });
    
    // Create files
    const files: string[] = [];
    
    // 1. Role Summary
    const summaryPath = join(submissionDir, 'role_summary.md');
    const summaryContent = `# ${companyName} - Role Summary

## Summary
${jdSummary.summary}

## Key Requirements
${jdSummary.key_requirements.map(req => `- ${req}`).join('\n')}

## Company Context
${jdSummary.company_context}

---
*Generated on ${new Date().toLocaleString()}*
`;
    await writeFile(summaryPath, summaryContent);
    files.push(`submissions/${companySlug}/${timestamp}/role_summary.md`);
    
    // 2. Email Draft
    const emailPath = join(submissionDir, 'intro_email.md');
    const emailContent = `# Introduction Email

**To:** ${companyName} Hiring Team  
**Subject:** ${emailDraft.subject}

---

${emailDraft.email_body}

---
*Confidence Score: ${(emailDraft.confidence_score * 100).toFixed(0)}%*  
*Generated on ${new Date().toLocaleString()}*
`;
    await writeFile(emailPath, emailContent);
    files.push(`submissions/${companySlug}/${timestamp}/intro_email.md`);
    
    // 3. Resume
    const resumePath = join(submissionDir, 'resume.txt');
    await writeFile(resumePath, resume);
    files.push(`submissions/${companySlug}/${timestamp}/resume.txt`);
    
    // 4. README for the folder
    const readmePath = join(submissionDir, 'README.md');
    const readmeContent = `# ${companyName} Application

This folder contains my application materials for ${companyName}.

## Contents
- **role_summary.md** - AI-analyzed summary of the job description
- **intro_email.md** - Personalized introduction email
- **resume.txt** - My resume

## Application Details
- **Company:** ${companyName}
- **Applied on:** ${new Date().toLocaleDateString()}
- **Applied at:** ${new Date().toLocaleTimeString()}
- **Status:** Pending

## Notes
This application was generated using the VP Agent Demo, an AI-powered job application assistant.
`;
    await writeFile(readmePath, readmeContent);
    files.push(`submissions/${companySlug}/${timestamp}/README.md`);
    
    // Git operations - run from repository root
    try {
      // Change to repository root for git operations
      process.chdir(repoRoot);
      
      // Get current repo info
      console.log('Getting repo info...');
      const { stdout: repoUrl } = await execAsync('gh repo view --json url -q .url');
      const cleanRepoUrl = repoUrl.trim();
      
      // Create a new branch
      const branchName = `submit/${companySlug}-${timestamp}`;
      console.log(`Creating branch: ${branchName}`);
      await execAsync(`git checkout -b ${branchName}`);
      
      // Add files
      console.log('Adding files to git...');
      await execAsync('git add -f submissions/');
      
      // Check if there are changes to commit
      const { stdout: gitStatus } = await execAsync('git status --porcelain submissions/');
      if (!gitStatus.trim()) {
        console.error('No changes to commit - files may already exist');
        throw new Error('No changes to commit');
      }
      
      // Commit
      const commitMessage = `Add application for ${companyName}

- Job description summary
- Personalized introduction email
- Resume
- Application folder README`;
      
      console.log('Committing changes...');
      await execAsync(`git commit -m "${commitMessage}"`);
      
      // Push branch
      console.log('Pushing branch to origin...');
      await execAsync(`git push origin ${branchName}`);
      
      // Create PR
      const prTitle = `Application: ${companyName}`;
      const prBody = `## 🎯 Job Application for ${companyName}

This PR contains my application materials for the position at ${companyName}.

### 📁 Files Included
${files.map(f => `- \`${f}\``).join('\n')}

### 🤖 Generated by VP Agent Demo
This application was automatically generated and organized using AI-powered analysis.

---
*Please review the materials and merge when ready to track this application.*`;
      
      console.log('Creating pull request...');
      const { stdout: prUrl } = await execAsync(
        `gh pr create --title "${prTitle}" --body "${prBody}" --base main`
      );
      
      // Get commit SHA
      const { stdout: commitSha } = await execAsync('git rev-parse HEAD');
      
      // Switch back to main branch
      await execAsync('git checkout main');
      
      // Change back to original directory
      process.chdir(join(repoRoot, 'frontend'));
      
      return {
        repo_url: cleanRepoUrl,
        pr_url: prUrl.trim(),
        commit_sha: commitSha.trim().substring(0, 7),
        files_created: files
      };
      
    } catch (error: any) {
      // If git operations fail, still return the local files created
      console.error('Git operations failed:', error);
      console.error('Error details:', error.message);
      console.error('Error command:', error.cmd);
      
      // Make sure to change back to original directory
      process.chdir(join(repoRoot, 'frontend'));
      
      return {
        repo_url: 'local',
        pr_url: 'local-only',
        commit_sha: 'local',
        files_created: files
      };
    }
  }
}
