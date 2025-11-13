import React, { useState, useCallback } from 'react';
import { classifyWaste } from './services/geminiService';
import { WasteReport, WasteType } from './types';
import ReportCard from './components/ReportCard';
import Spinner from './components/Spinner';
import { UploadIcon } from './components/IconComponents';
import { translations, Language } from './translations';
import AboutModal from './components/AboutModal';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError(null);
      setNotification(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) {
      setError(translations[language].errorSelectImage);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setNotification(null);

    try {
      const base64Image = await fileToBase64(selectedFile);
      const wasteType = await classifyWaste(base64Image, selectedFile.type);

      const newReport: WasteReport = {
        id: new Date().toISOString(),
        imageUrl: imagePreview!,
        wasteType,
        timestamp: new Date(),
      };

      setReports(prevReports => [newReport, ...prevReports]);
      setNotification(translations[language].notifySuccess);
      
      setSelectedFile(null);
      setImagePreview(null);
      
    // Fix: Corrected the syntax of the catch block.
    } catch (err) {
      console.error("Submission failed:", err);
      setError(translations[language].errorClassify);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, imagePreview, language]);

  const t = translations[language];

  return (
    <div className="min-h-screen">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <img src="https://i.postimg.cc/s1ffxJYT/photo-2025-11-11-23-20-23.jpg" alt={t.title} className="h-12" />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                {t.aboutButton}
              </button>
              {(['en', 'ru', 'uz'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    language === lang
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  aria-pressed={language === lang}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-card shadow-lg rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t.reportNewWaste}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-text-secondary mb-2">
                  {t.uploadLabel}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Waste preview" className="mx-auto h-48 w-auto rounded-md object-contain" />
                    ) : (
                      <>
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-card rounded-md font-medium text-primary hover:text-primary-focus focus-within:outline-none">
                            <span>{t.uploadButton}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                          </label>
                          <p className="pl-1">{t.uploadOrDrag}</p>
                        </div>
                        <p className="text-xs text-gray-500">{t.uploadHint}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedFile || isProcessing}
                  className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Spinner />
                      <span className="ml-2">{t.submittingButton}</span>
                    </>
                  ) : (
                    t.submitButton
                  )}
                </button>
              </div>
            </div>

            {error && <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">{error}</div>}
            {notification && <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">{notification}</div>}
          </div>

          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-4">{t.recentReports}</h3>
            {reports.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map(report => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    reportedOnText={t.reportedOn}
                    locale={language}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-6 bg-card rounded-lg shadow-md">
                <p className="text-text-secondary">{t.noReports}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        t={t}
      />
    </div>
  );
};

export default App;