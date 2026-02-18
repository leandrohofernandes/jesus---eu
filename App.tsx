import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { EmergencyMode } from './components/EmergencyMode';
import { Login } from './components/Login';
import { UserProfile, AppView, INITIAL_PROFILE } from './types';

function App() {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 1. Session Check (Local "Cookie" behavior)
  useEffect(() => {
    const sessionProfile = localStorage.getItem('user_profile_session');
    
    if (sessionProfile) {
      const parsed = JSON.parse(sessionProfile);
      // Migration safety
      if (!parsed.completedDevotionals) parsed.completedDevotionals = [];
      if (!parsed.name) parsed.name = '';

      setProfile(parsed);
      
      if (parsed.onboardingCompleted) {
        setView(AppView.DASHBOARD);
      } else {
        setView(AppView.ONBOARDING);
      }
    } else {
        setView(AppView.LOGIN);
    }
    setIsLoaded(true);
  }, []);

  // 2. Handle Login Logic (Simple Name Entry)
  const handleLoginSuccess = (name: string) => {
    // Determine initial state based on passed name
    const mergedProfile = { ...profile, name };
    setProfile(mergedProfile);

    // If we are at Login screen, we treat it as a fresh start or new user
    setView(AppView.ONBOARDING);
  };

  // 3. Handle Onboarding Completion (Local Save)
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    const finalProfileToSave = { ...profile, ...newProfile };

    // Save to Session (Local Storage)
    setProfile(finalProfileToSave);
    localStorage.setItem('user_profile_session', JSON.stringify(finalProfileToSave));
    
    setView(AppView.DASHBOARD);
  };

  // 4. Handle Profile Updates in Dashboard (Local Save)
  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('user_profile_session', JSON.stringify(updatedProfile));
  };

  // 5. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('user_profile_session');
    setProfile(INITIAL_PROFILE);
    setView(AppView.LOGIN);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {view === AppView.LOGIN && (
        <Login onLogin={handleLoginSuccess} />
      )}

      {view === AppView.ONBOARDING && (
        <Onboarding 
          onComplete={handleOnboardingComplete} 
          initialProfile={profile}
        />
      )}

      {view === AppView.DASHBOARD && (
        <Dashboard 
          profile={profile} 
          onUpdateProfile={handleProfileUpdate}
          onEmergency={() => setView(AppView.EMERGENCY)}
          onLogout={handleLogout}
        />
      )}

      {view === AppView.EMERGENCY && (
        <EmergencyMode 
          profile={profile}
          onClose={() => setView(AppView.DASHBOARD)} 
        />
      )}
    </div>
  );
}

export default App;