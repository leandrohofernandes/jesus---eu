import React, { useEffect, useState } from 'react';
import { UserProfile, DevotionalContent } from '../types';
import { ShieldAlert, Book, Brain, Activity, CheckCircle2, RefreshCw, CalendarCheck, Settings, LogOut, X } from 'lucide-react';
import { generateDailyDevotional } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  onEmergency: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onUpdateProfile, onEmergency, onLogout }) => {
  const [content, setContent] = useState<DevotionalContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Calculate Streak
  const daysClean = Math.floor((new Date().getTime() - new Date(profile.cleanDate).getTime()) / (1000 * 3600 * 24));
  
  // Check completion
  const todayStr = new Date().toISOString().split('T')[0];
  const isCompletedToday = profile.completedDevotionals?.includes(todayStr);

  useEffect(() => {
    const loadContent = async () => {
      const today = new Date().toISOString().split('T')[0];
      const savedContent = localStorage.getItem('daily_devotional');
      
      if (savedContent) {
        const parsed: DevotionalContent = JSON.parse(savedContent);
        if (parsed.date === today) {
          setContent(parsed);
          return;
        }
      }

      setLoading(true);
      const newContent = await generateDailyDevotional(profile);
      if (newContent) {
        setContent(newContent);
        localStorage.setItem('daily_devotional', JSON.stringify(newContent));
      }
      setLoading(false);
    };

    loadContent();
  }, [profile]);

  const handleRelapse = () => {
    if (confirm("Registrar uma recaída zerará seu contador atual, mas não apagará sua história. Deseja continuar?")) {
      const updatedProfile = {
        ...profile,
        cleanDate: new Date().toISOString(),
        relapseHistory: [...profile.relapseHistory, new Date().toISOString()],
        bestStreak: Math.max(profile.bestStreak, daysClean)
      };
      onUpdateProfile(updatedProfile);
    }
  };

  const handleCompleteDevotional = () => {
    const currentCompleted = profile.completedDevotionals || [];
    if (!currentCompleted.includes(todayStr)) {
      const updatedProfile = {
        ...profile,
        completedDevotionals: [...currentCompleted, todayStr]
      };
      onUpdateProfile(updatedProfile);
    }
  };

  const dummyData = [
    { name: 'S1', days: Math.max(0, daysClean - 6) },
    { name: 'S2', days: Math.max(0, daysClean - 4) },
    { name: 'S3', days: Math.max(0, daysClean - 2) },
    { name: 'S4', days: daysClean },
  ];

  return (
    <div className="pb-24 max-w-2xl mx-auto relative">
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute top-16 right-6 z-50 bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-48 animate-fade-in">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Conta
          </div>
          <p className="px-3 py-1 text-sm text-slate-800 font-medium truncate mb-2">{profile.name}</p>
          <button 
            onClick={onLogout}
            className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Sair
          </button>
          <button 
             onClick={() => setShowSettings(false)}
             className="w-full mt-1 text-center text-xs text-slate-400 hover:text-slate-600 py-1"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header Stats */}
      <div className="bg-slate-900 text-white p-8 rounded-b-3xl shadow-xl relative overflow-hidden">
        
        {/* Settings Icon */}
        <div className="absolute top-6 right-6 z-50">
           <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
           >
             {showSettings ? <X size={20} /> : <Settings size={20} />}
           </button>
        </div>

        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Activity size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="mb-2">
            <h2 className="text-xl font-medium text-slate-200">Olá, <span className="font-bold text-white">{profile.name}</span></h2>
          </div>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Dias em liberdade</p>
          <h1 className="text-6xl font-bold mb-4">{daysClean}</h1>
          
          <div className="flex gap-4 text-sm flex-wrap">
            <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              Melhor: {Math.max(profile.bestStreak, daysClean)}d
            </div>
             <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm border border-blue-500/30">
                <Book size={14} /> {(profile.completedDevotionals || []).length}
              </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-20">
        <button 
          onClick={onEmergency}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl shadow-lg shadow-red-200 flex items-center justify-center gap-2 font-bold transition-transform active:scale-95"
        >
          <ShieldAlert size={20} />
          ESTOU COM IMPULSO AGORA
        </button>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Daily Devotional Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Book className="text-blue-600" size={20} />
              <h2 className="font-bold text-slate-800">Devocional de Hoje</h2>
            </div>
             {isCompletedToday && <CheckCircle2 className="text-green-500" size={20} />}
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            ) : content ? (
              <div className="space-y-6">
                <div>
                  <blockquote className="text-xl font-serif text-slate-800 italic border-l-4 border-blue-500 pl-4 mb-2">
                    "{content.verse.text}"
                  </blockquote>
                  <p className="text-right text-slate-500 text-sm font-medium">— {content.verse.reference}</p>
                </div>

                <div className="prose prose-slate prose-sm">
                  <h3 className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <RefreshCw size={16} /> Espiritual
                  </h3>
                  <p>{content.spiritualExplanation}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h3 className="text-purple-600 font-semibold text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Brain size={16} /> Ciência: O Cérebro
                  </h3>
                  <p className="text-slate-600 text-sm">{content.scientificBasis}</p>
                </div>

                <div>
                   <h3 className="font-bold text-slate-800 mb-2">Reflexão Prática</h3>
                   <p className="text-slate-600 italic">"{content.reflectionQuestion}"</p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                   <h3 className="font-bold text-green-800 mb-1">Desafio de Hoje</h3>
                   <p className="text-green-700">{content.concreteAction}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 text-center pb-2">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Lei da Inevitabilidade</p>
                  <p className="font-semibold text-slate-700">{content.inevitabilityQuote}</p>
                </div>

                {/* Completion Button */}
                <div className="pt-2">
                  {isCompletedToday ? (
                     <div className="w-full bg-green-50 border border-green-200 text-green-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold animate-fade-in">
                      <CalendarCheck size={20} />
                      DEVOCIONAL CONCLUÍDO
                    </div>
                  ) : (
                    <button
                      onClick={handleCompleteDevotional}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl shadow-lg shadow-slate-200 flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
                    >
                      <CheckCircle2 size={20} />
                      MARCAR LEITURA COMO CONCLUÍDA
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                Não foi possível carregar o devocional. Tente novamente mais tarde.
              </div>
            )}
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Seu Progresso</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData}>
                <defs>
                  <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="days" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDays)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
             <button 
              onClick={handleRelapse}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors underline"
             >
               Registrar recaída (sem julgamentos)
             </button>
          </div>
        </div>

        <div className="text-xs text-center text-slate-400 px-4">
          <p>Este aplicativo é uma ferramenta de apoio espiritual e educacional. Não substitui acompanhamento psicológico ou médico profissional.</p>
        </div>

      </div>
    </div>
  );
};