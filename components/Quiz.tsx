
import React, { useState } from 'react';
import { LoveLanguage } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import { Check } from 'lucide-react';

interface QuizProps {
  onComplete: (results: LoveLanguage[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scores, setScores] = useState<Record<LoveLanguage, number>>({
    [LoveLanguage.WORDS]: 0,
    [LoveLanguage.TIME]: 0,
    [LoveLanguage.GIFTS]: 0,
    [LoveLanguage.SERVICE]: 0,
    [LoveLanguage.TOUCH]: 0,
    [LoveLanguage.NONE]: 0,
  });

  const handleAnswer = (language: LoveLanguage, idx: number) => {
    if (selectedIdx !== null || isTransitioning) return;
    setSelectedIdx(idx);
    
    setTimeout(() => {
      setIsTransitioning(true);
      const newScores = { ...scores, [language]: scores[language] + 1 };
      setScores(newScores);

      setTimeout(() => {
        if (currentStep < QUIZ_QUESTIONS.length - 1) {
          setCurrentStep(currentStep + 1);
          setSelectedIdx(null);
          setIsTransitioning(false);
        } else {
          // Identifica as 2 linguagens principais
          const sortedLangs = Object.entries(newScores)
            .filter(([lang]) => lang !== LoveLanguage.NONE)
            .sort((a, b) => (b[1] as number) - (a[1] as number));
          
          const topTwo = [sortedLangs[0][0] as LoveLanguage, sortedLangs[1][0] as LoveLanguage];
          onComplete(topTwo);
        }
      }, 200);
    }, 250);
  };

  const question = QUIZ_QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-rose-100 overflow-hidden border border-rose-50">
      <div className="h-2.5 bg-rose-50">
        <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-500 rounded-r-full" style={{ width: `${progress}%` }} />
      </div>
      <div className={`p-10 md:p-14 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-200`}>
        <div className="flex justify-between items-center mb-10">
          <span className="px-4 py-1.5 bg-rose-50 text-rose-600 font-bold text-xs uppercase tracking-widest rounded-full">Semeando Autoconhecimento - {currentStep + 1}/{QUIZ_QUESTIONS.length}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-10 text-rose-900 leading-tight">{question.text}</h2>
        <div className="space-y-4">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={selectedIdx !== null}
              onClick={() => handleAnswer(opt.language, idx)}
              className={`w-full p-6 text-left rounded-3xl border-2 transition-all flex items-center justify-between ${
                selectedIdx === idx ? 'border-rose-500 bg-rose-500 text-white scale-[1.02]' : 'border-rose-100 bg-white hover:border-rose-300'
              }`}
            >
              <span className="text-xl font-semibold pr-8">{opt.text}</span>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${selectedIdx === idx ? 'bg-white border-white' : 'border-rose-200'}`}>
                {selectedIdx === idx && <Check className="w-5 h-5 text-rose-600" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
