'use client';

import { useState } from 'react';

interface WritingSample {
  id: string;
  title: string;
  content: string;
  wordCount: number;
}

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [writingSamples, setWritingSamples] = useState<WritingSample[]>([]);
  const [newSampleTitle, setNewSampleTitle] = useState('');
  const [newSampleContent, setNewSampleContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [emailDraft, setEmailDraft] = useState<any>(null);
  const [error, setError] = useState('');

  const addWritingSample = () => {
    if (!newSampleTitle.trim() || !newSampleContent.trim()) {
      setError('Please provide both title and content for the writing sample');
      return;
    }

    const wordCount = newSampleContent.trim().split(/\s+/).length;
    const newSample: WritingSample = {
      id: Date.now().toString(),
      title: newSampleTitle,
      content: newSampleContent,
      wordCount
    };

    setWritingSamples([...writingSamples, newSample]);
    setNewSampleTitle('');
    setNewSampleContent('');
    setError('');
  };

  const removeSample = (id: string) => {
    setWritingSamples(writingSamples.filter(sample => sample.id !== id));
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    if (!companyName.trim()) {
      setError('Please enter the company name');
      return;
    }

    if (writingSamples.length === 0) {
      setError('Please add at least one writing sample');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary(null);
    setEmailDraft(null);

    try {
      // First, get the JD summary
      const summaryResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to summarize');
      }

      const summaryData = await summaryResponse.json();
      setSummary(summaryData);

      // Then, draft the email
      const draftResponse = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jobDescription,
          companyName,
          jdSummary: summaryData,
          writingSamples: writingSamples.map(s => ({
            title: s.title,
            content: s.content
          }))
        }),
      });

      if (!draftResponse.ok) {
        throw new Error('Failed to draft email');
      }

      const draftData = await draftResponse.json();
      setEmailDraft(draftData);
    } catch (err) {
      setError('Error processing your request. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">VP Agent Demo</h1>
          <p className="text-gray-600">
            AI-powered job application assistant. Paste a job description and add writing samples to generate a personalized email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Analog Devices"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="jd" className="block text-sm font-medium mb-2">
                Job Description
              </label>
              <textarea
                id="jd"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Writing Samples */}
            <div>
              <h3 className="text-sm font-medium mb-2">Writing Samples</h3>
              
              {/* Existing Samples */}
              {writingSamples.length > 0 && (
                <div className="mb-4 space-y-2">
                  {writingSamples.map((sample) => (
                    <div key={sample.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{sample.title}</p>
                        <p className="text-sm text-gray-600">{sample.wordCount} words</p>
                      </div>
                      <button
                        onClick={() => removeSample(sample.id)}
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Sample */}
              <div className="space-y-3 p-4 border rounded-lg">
                <input
                  type="text"
                  value={newSampleTitle}
                  onChange={(e) => setNewSampleTitle(e.target.value)}
                  placeholder="Sample title (e.g., 'LinkedIn Article on AI')"
                  className="w-full p-2 border rounded"
                />
                <textarea
                  value={newSampleContent}
                  onChange={(e) => setNewSampleContent(e.target.value)}
                  placeholder="Paste your writing sample here..."
                  className="w-full h-32 p-2 border rounded"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {newSampleContent.trim() ? `${newSampleContent.trim().split(/\s+/).length} words` : '0 words'}
                  </span>
                  <button
                    onClick={addWritingSample}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Add Sample
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Generate Application'}
            </button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {summary && (
              <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold">JD Analysis</h2>
                
                <div>
                  <h3 className="font-medium mb-2">Summary</h3>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{summary.summary}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Key Requirements</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {summary.key_requirements?.map((req: string, idx: number) => (
                      <li key={idx} className="text-gray-700 text-sm">{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Company Context</h3>
                  <p className="text-gray-700 text-sm">{summary.company_context}</p>
                </div>
              </div>
            )}

            {emailDraft && (
              <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
                <h2 className="text-xl font-semibold">Email Draft</h2>
                
                <div>
                  <h3 className="font-medium mb-2">Subject</h3>
                  <p className="text-gray-700">{emailDraft.subject}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Email Body</h3>
                  <div className="bg-white p-4 rounded border">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{emailDraft.email_body}</pre>
                  </div>
                </div>

                {emailDraft.confidence_score && (
                  <div className="text-sm text-gray-600">
                    Confidence Score: {(emailDraft.confidence_score * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 