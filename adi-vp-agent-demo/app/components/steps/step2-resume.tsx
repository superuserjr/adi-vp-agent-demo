'use client';

interface Step2Props {
  resume: string;
  setResume: (value: string) => void;
  companyName: string;
  onNext: () => void;
}

export function Step2Resume({ resume, setResume, companyName, onNext }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Add your resume</h2>
        <p className="text-gray-600">
          We'll use this to personalize your application for {companyName}
        </p>
      </div>

      <div>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume text here..."
          className="w-full h-96 p-6 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <p className="text-sm text-gray-500 mt-2">
          Tip: Include your full experience, skills, and achievements
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!resume.trim()}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
        >
          Continue →
        </button>
      </div>
    </div>
  );
} 