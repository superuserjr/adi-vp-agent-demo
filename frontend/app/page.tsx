'use client';

import { useState } from 'react';
import { Wizard } from './components/wizard';
import { Step1JD } from './components/steps/step1-jd';
import { Step2Resume } from './components/steps/step2-resume';
import { Step3Samples } from './components/steps/step3-samples';
import { Step4Review } from './components/steps/step4-review';
import { Step5Submit } from './components/steps/step5-submit';

interface WritingSample {
  id: string;
  title: string;
  content: string;
  wordCount: number;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [resume, setResume] = useState('');
  const [writingSamples, setWritingSamples] = useState<WritingSample[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [emailDraft, setEmailDraft] = useState<any>(null);
  const [githubResult, setGithubResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Step 1: Analyze JD
  const handleAnalyzeJD = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze job description');
      }

      const data = await response.json();
      setSummary(data);
      setCompanyName(data.company_name || '');
      setCurrentStep(2);
    } catch (err) {
      setError('Error analyzing job description. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Generate Email
  const handleGenerateEmail = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobDescription,
          companyName,
          resume,
          jdSummary: summary,
          writingSamples: writingSamples.map(s => ({
            title: s.title,
            content: s.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email');
      }

      const data = await response.json();
      setEmailDraft(data);
      setCurrentStep(4);
    } catch (err) {
      setError('Error generating email. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 5: Publish to GitHub
  const handlePublish = async () => {
    setIsPublishing(true);
    setError('');

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          jdSummary: summary,
          emailDraft,
          resume
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish');
      }

      const result = await response.json();
      setGithubResult(result);
    } catch (err: any) {
      setError(err.message || 'Error publishing to GitHub');
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  // Writing sample management
  const addWritingSample = (title: string, content: string) => {
    const wordCount = content.trim().split(/\s+/).length;
    const newSample: WritingSample = {
      id: Date.now().toString(),
      title: title.trim() || `Sample ${writingSamples.length + 1}`,
      content,
      wordCount
    };
    setWritingSamples([...writingSamples, newSample]);
  };

  const removeSample = (id: string) => {
    setWritingSamples(writingSamples.filter(sample => sample.id !== id));
  };

  return (
    <Wizard currentStep={currentStep}>
      {currentStep === 1 && (
        <Step1JD
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onNext={handleAnalyzeJD}
          isLoading={isLoading}
        />
      )}

      {currentStep === 2 && (
        <Step2Resume
          resume={resume}
          setResume={setResume}
          companyName={companyName}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && (
        <Step3Samples
          writingSamples={writingSamples}
          onAddSample={addWritingSample}
          onRemoveSample={removeSample}
          onNext={handleGenerateEmail}
        />
      )}

      {currentStep === 4 && (
        <Step4Review
          summary={summary}
          emailDraft={emailDraft}
          onNext={() => setCurrentStep(5)}
          isLoading={isLoading}
        />
      )}

      {currentStep === 5 && (
        <Step5Submit
          githubResult={githubResult}
          onPublish={handlePublish}
          isPublishing={isPublishing}
          error={error}
        />
      )}
    </Wizard>
  );
} 