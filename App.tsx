
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { Spinner } from './components/Spinner';
import { generateView } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { ViewType, GeneratedViews } from './types';
import { GithubIcon } from './components/icons';

function App() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedViews, setGeneratedViews] = useState<GeneratedViews>({ front: null, side: null, top: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setGeneratedViews({ front: null, side: null, top: null });
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!uploadedImage) return;

    setIsLoading(true);
    setError(null);
    setGeneratedViews({ front: null, side: null, top: null });

    try {
      const { base64Data, mimeType } = await fileToBase64(uploadedImage);

      const viewsToGenerate: ViewType[] = ['front', 'side', 'top'];
      
      const results = await Promise.all(
        viewsToGenerate.map(viewType => 
          generateView(base64Data, mimeType, viewType)
        )
      );

      setGeneratedViews({
        front: results[0],
        side: results[1],
        top: results[2],
      });

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);

  const hasGeneratedContent = Object.values(generatedViews).some(v => v !== null);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <header className="w-full p-4 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-100">3-View AI Generator</h1>
          <a href="https://github.com/google/generative-ai-docs/tree/main/site/en/gemini-api/docs/applications" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <GithubIcon className="w-6 h-6" />
          </a>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col">
        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
          Upload a clear image of an object. The AI will generate its front, side, and top orthographic views, creating a basic technical drawing.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          {/* Left Panel */}
          <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center space-y-6 border border-gray-700">
            <ImageUploader onImageUpload={handleImageUpload} previewUrl={previewUrl} />
            <button
              onClick={handleGenerateClick}
              disabled={!uploadedImage || isLoading}
              className="w-full max-w-xs py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
              {isLoading ? 'Generating...' : 'Generate 3-Views'}
            </button>
          </div>

          {/* Right Panel */}
          <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center border border-gray-700 min-h-[300px] lg:min-h-0">
            {isLoading && <Spinner />}
            {error && <p className="text-red-400 text-center">{error}</p>}
            {!isLoading && !error && !hasGeneratedContent && (
              <div className="text-center text-gray-500">
                <p>Generated views will appear here.</p>
                <p className="text-sm">Upload an image and click "Generate".</p>
              </div>
            )}
            {!isLoading && !error && hasGeneratedContent && (
              <ResultViewer views={generatedViews} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
