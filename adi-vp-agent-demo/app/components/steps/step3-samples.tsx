'use client';

import { useState } from 'react';

interface WritingSample {
  id: string;
  title: string;
  content: string;
  wordCount: number;
}

interface Step3Props {
  writingSamples: WritingSample[];
  onAddSample: (title: string, content: string) => void;
  onRemoveSample: (id: string) => void;
  onNext: () => void;
}

export function Step3Samples({ writingSamples, onAddSample, onRemoveSample, onNext }: Step3Props) {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAdd = () => {
    if (newContent.trim()) {
      onAddSample(newTitle, newContent);
      setNewTitle('');
      setNewContent('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Add writing samples</h2>
        <p className="text-gray-600">
          Share examples of your professional writing to help us match your voice
        </p>
      </div>

      {/* Existing Samples */}
      {writingSamples.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Your samples ({writingSamples.length})</h3>
          {writingSamples.map((sample) => (
            <div key={sample.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <p className="font-medium">{sample.title}</p>
                <p className="text-sm text-gray-600">{sample.wordCount} words</p>
              </div>
              <button
                onClick={() => onRemoveSample(sample.id)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Sample */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-medium mb-4">Add a sample</h3>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Optional title"
          className="w-full p-3 border rounded-lg mb-3"
        />
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Paste your writing sample here..."
          className="w-full h-32 p-3 border rounded-lg mb-3"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {newContent.trim() ? `${newContent.trim().split(/\s+/).length} words` : '0 words'}
          </span>
          <button
            onClick={handleAdd}
            disabled={!newContent.trim()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
          >
            Add Sample
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={writingSamples.length === 0}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
        >
          Generate Email →
        </button>
      </div>
    </div>
  );
} 