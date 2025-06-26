'use client';

interface Step5Props {
  githubResult: any;
  onPublish: () => void;
  isPublishing: boolean;
  error?: string;
}

export function Step5Submit({ githubResult, onPublish, isPublishing, error }: Step5Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Final step: Submit to GitHub</h2>
        <p className="text-gray-600">
          We'll create a pull request with all your application materials
        </p>
      </div>

      {!githubResult && (
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-lg border text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h3 className="font-semibold mb-2">Ready to submit</h3>
            <p className="text-gray-600 mb-6">
              Click below to save your application to GitHub
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <button
              onClick={onPublish}
              disabled={isPublishing}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isPublishing ? 'Publishing to GitHub...' : 'Submit to GitHub'}
            </button>
          </div>
        </div>
      )}

      {githubResult && (
        <div className="max-w-md mx-auto">
          <div className="bg-green-50 p-8 rounded-lg border border-green-200 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className="font-semibold text-lg mb-2">Successfully submitted!</h3>
            
            <div className="space-y-3 text-sm">
              {githubResult.pr_url !== 'local-only' ? (
                <>
                  <p className="text-gray-700">
                    Your application has been saved to GitHub
                  </p>
                  <div className="bg-white p-4 rounded">
                    <a 
                      href={githubResult.pr_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Pull Request →
                    </a>
                  </div>
                  <p className="text-gray-600">
                    Commit: <span className="font-mono">{githubResult.commit_sha}</span>
                  </p>
                </>
              ) : (
                <p className="text-gray-700">
                  Files saved locally in the submissions folder
                </p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-gray-600 text-sm">
                ✨ Good luck with your application!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 