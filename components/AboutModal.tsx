import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Record<string, string>;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className="bg-card rounded-lg shadow-xl p-6 md:p-8 m-4 max-w-lg w-full transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="about-modal-title" className="text-2xl font-bold text-text-primary">{t.aboutTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 mb-6 text-text-secondary">
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{t.aboutProjectTitle}</h3>
                <p className="whitespace-pre-line">{t.aboutProjectText}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{t.aboutMeTitle}</h3>
                <p>{t.aboutMeText}</p>
            </div>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {t.closeButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;