import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { ChevronRight, Check } from 'lucide-react';

interface OnboardingProps {
  initialProfile?: Partial<UserProfile>;
  onComplete: (profile: UserProfile) => void;
}

const ADDICTION_OPTIONS = [
  "Pornografia",
  "Masturbação compulsiva",
  "Jogos de azar",
  "Redes sociais excessivas",
  "Conteúdos sensuais",
  "Compulsão emocional"
];

const FREQUENCY_OPTIONS = [
  "Diariamente",
  "Várias vezes por semana",
  "Algumas vezes por mês",
  "Estou tentando parar agora"
];

const TRIGGER_OPTIONS = [
  "Solidão",
  "Ansiedade",
  "Estresse",
  "Tédio",
  "Redes sociais",
  "Noite / Madrugada",
  "Pensamentos recorrentes"
];

const DURATION_OPTIONS = [
  "Menos de 6 meses",
  "1 a 2 anos",
  "Mais de 2 anos"
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialProfile }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    addictions: [],
    triggers: [],
    ...initialProfile // Merge passed name/email
  });

  const handleNext = () => setStep(p => p + 1);

  const toggleSelection = (list: string[], item: string) => {
    if (list.includes(item)) return list.filter(i => i !== item);
    return [...list, item];
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Olá, {profile.name || 'Visitante'}. Qual desafio você deseja vencer?</h2>
        <p className="text-slate-500">Selecione quantos forem necessários. Este é um ambiente seguro.</p>
      </div>
      <div className="space-y-3">
        {ADDICTION_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => setProfile({ ...profile, addictions: toggleSelection(profile.addictions || [], opt) })}
            className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
              profile.addictions?.includes(opt) 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{opt}</span>
            {profile.addictions?.includes(opt) && <Check size={20} />}
          </button>
        ))}
      </div>
      <button 
        disabled={!profile.addictions || profile.addictions.length === 0}
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
      >
        Continuar
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Com que frequência você enfrenta isso?</h2>
      </div>
      <div className="space-y-3">
        {FREQUENCY_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => {
              setProfile({ ...profile, frequency: opt });
              handleNext();
            }}
            className="w-full p-4 rounded-xl border border-slate-200 text-left hover:bg-slate-50 hover:border-blue-300 transition-all flex justify-between"
          >
            {opt}
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
       <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Quais são seus maiores gatilhos?</h2>
        <p className="text-slate-500">Identificar a causa é o primeiro passo para a liberdade.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {TRIGGER_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => setProfile({ ...profile, triggers: toggleSelection(profile.triggers || [], opt) })}
            className={`p-4 rounded-xl border text-center text-sm font-medium transition-all ${
              profile.triggers?.includes(opt) 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button 
        disabled={!profile.triggers || profile.triggers.length === 0}
        onClick={handleNext}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
      >
        Continuar
      </button>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
       <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Há quanto tempo você luta contra isso?</h2>
      </div>
      <div className="space-y-3">
        {DURATION_OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => {
               setProfile({...profile, struggleDuration: opt});
               handleNext();
            }}
            className="w-full p-4 rounded-xl border border-slate-200 text-left hover:bg-slate-50 hover:border-blue-300 transition-all"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Você aceita o desafio?</h2>
        <p className="text-slate-600 mb-8">
          A liberdade é construída um dia de cada vez. Você deseja receber desafios práticos diários para fortalecer sua disciplina?
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => {
              const finalProfile = { ...profile, wantsChallenges: true, onboardingCompleted: true, cleanDate: new Date().toISOString() } as UserProfile;
              onComplete(finalProfile);
            }}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Sim, eu quero ser livre
          </button>
          
          <button
             onClick={() => {
              const finalProfile = { ...profile, wantsChallenges: false, onboardingCompleted: true, cleanDate: new Date().toISOString() } as UserProfile;
              onComplete(finalProfile);
            }}
            className="w-full bg-white text-slate-500 py-4 rounded-xl font-medium border border-slate-200 hover:bg-slate-50"
          >
            Prefiro ir devagar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 max-w-lg mx-auto">
      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>
      
      {step < 5 && (
        <div className="flex justify-center py-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};