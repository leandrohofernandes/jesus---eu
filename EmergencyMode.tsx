import React, { useState, useEffect } from 'react';
import { X, Wind, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';
import { getQuickEmergencyContent } from '../services/geminiService';

interface EmergencyModeProps {
  onClose: () => void;
  profile: UserProfile;
}

export const EmergencyMode: React.FC<EmergencyModeProps> = ({ onClose, profile }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(4);
  const [verse, setVerse] = useState<{text: string, reference: string} | null>(null);

  useEffect(() => {
    let interval: any;
    
    const runCycle = () => {
      if (phase === 'inhale') {
        if (timer > 1) {
          setTimer(t => t - 1);
        } else {
          setPhase('hold');
          setTimer(4);
        }
      } else if (phase === 'hold') {
        if (timer > 1) {
          setTimer(t => t - 1);
        } else {
          setPhase('exhale');
          setTimer(6); // Longer exhale for relaxation
        }
      } else if (phase === 'exhale') {
        if (timer > 1) {
          setTimer(t => t - 1);
        } else {
          setPhase('inhale');
          setTimer(4);
        }
      }
    };

    interval = setInterval(runCycle, 1000);
    return () => clearInterval(interval);
  }, [phase, timer]);

  useEffect(() => {
    getQuickEmergencyContent(profile).then(setVerse);
  }, [profile]);

  const getCircleSize = () => {
    if (phase === 'inhale') return 'scale-110';
    if (phase === 'hold') return 'scale-110';
    return 'scale-90';
  };

  const getPhaseText = () => {
    switch(phase) {
      case 'inhale': return 'Inspire...';
      case 'hold': return 'Segure...';
      case 'exhale': return 'Expire...';
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col p-6 animate-fade-in">
      <div className="flex justify-end">
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-blue-400">PARE. RESPIRE.</h2>
          <p className="text-slate-400">Não tome nenhuma decisão agora.</p>
        </div>

        {/* Breathing Circle */}
        <div className="relative flex items-center justify-center">
          <div className={`w-64 h-64 rounded-full bg-blue-500/20 absolute blur-2xl transition-all duration-1000 ${getCircleSize()}`} />
          <div className={`w-48 h-48 rounded-full border-4 border-blue-500 flex items-center justify-center transition-all duration-1000 ${getCircleSize()}`}>
             <div className="text-center">
               <Wind className="mx-auto mb-2 text-blue-400" size={32} />
               <span className="text-2xl font-bold">{getPhaseText()}</span>
               <div className="text-4xl mt-1 font-mono">{timer}</div>
             </div>
          </div>
        </div>

        {/* Dynamic Verse */}
        <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-700">
          {verse ? (
             <>
               <BookOpen className="text-blue-400 mb-3" size={20} />
               <p className="text-lg font-medium leading-relaxed mb-3">"{verse.text}"</p>
               <p className="text-sm text-slate-400 text-right">— {verse.reference}</p>
             </>
          ) : (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-700 rounded w-full"></div>
            </div>
          )}
        </div>

      </div>

      <div className="mt-auto text-center pb-6">
        <p className="text-sm text-slate-500">A vontade passa. As consequências ficam.</p>
      </div>
    </div>
  );
};