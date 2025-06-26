'use client';

interface Step4Props {
  summary: any;
  emailDraft: any;
  onNext: () => void;
  isLoading: boolean;
}

export function Step4Review({ summary, emailDraft, onNext, isLoading }: Step4Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Review your application</h2>
        <p className="text-gray-600">Everything looks good? Let's get it submitted!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JD Analysis */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Job Analysis</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-1">Company</h4>
              <p>{summary?.company_name}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-1">Role Summary</h4>
              <p className="text-sm">{summary?.summary}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-1">Key Requirements</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {summary?.key_requirements?.slice(0, 5).map((req: string, idx: number) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Email Draft */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-semibold text-lg mb-4">Your Email</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-1">Subject</h4>
              <p>{emailDraft?.subject}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-gray-600 mb-1">Email Body</h4>
              <div className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {emailDraft?.email_body}
              </div>
            </div>

            {emailDraft?.confidence_score && (
              <div className="text-sm text-gray-600">
                Confidence: {(emailDraft.confidence_score * 100).toFixed(0)}%
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={isLoading}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
        >
          {isLoading ? 'Processing...' : 'Proceed to Submit →'}
        </button>
      </div>
    </div>
  );
} 