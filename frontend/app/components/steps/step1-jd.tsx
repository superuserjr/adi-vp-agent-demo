'use client';

interface Step1Props {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onNext: () => void;
  isLoading: boolean;
}

export function Step1JD({ jobDescription, setJobDescription, onNext, isLoading }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Let's start with the job description</h2>
        <p className="text-gray-600">Paste the full job posting and we'll analyze it for you</p>
      </div>

      <div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-96 p-6 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          autoFocus
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!jobDescription.trim() || isLoading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Job Description →'}
        </button>
      </div>
    </div>
  );
} 