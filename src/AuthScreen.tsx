import React, { useState } from 'react';
import { Mail, Lock, User, Play } from 'lucide-react';
import { auth } from './lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';

interface AuthScreenProps {
  onMockLogin?: (name: string) => void;
}

export default function AuthScreen({ onMockLogin }: AuthScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured && onMockLogin) {
      onMockLogin("Google Guest");
      return;
    }
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e: any) {
      setError(e.message || "Failed to sign in with Google.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured && onMockLogin) {
      onMockLogin(fullName || email.split('@')[0] || "Guest Form User");
      return;
    }
    setError('');
    try {
      if (isRegister) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName });
        // After this, AuthProvider's onAuthStateChanged will pick it up and trigger sync to Convex.
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e: any) {
      setError(e.message || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#050505] flex items-center justify-center overflow-hidden font-sans">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <img src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1600&q=80" alt="Background" className="w-full h-full object-cover opacity-10" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent" />
         
         <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-[#1e1b4b] rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse" />
         <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-[#312e81] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '2s'}} />
      </div>

      <div className="relative z-10 w-full max-w-[340px] px-4 py-8 flex flex-col w-full items-center">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 w-full">
           <div className="relative w-28 h-28 mb-8 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff2a5f] via-[#dd2476] to-[#ff512f] rounded-[2.5rem] rotate-[15deg] blur-xl opacity-60 group-hover:rotate-[25deg] transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff2a5f] via-[#dd2476] to-[#ff512f] rounded-[2.5rem] shadow-[0_0_40px_rgba(255,42,95,0.4)] flex items-center justify-center transform transition-transform group-hover:scale-105 duration-500 border border-white/20 backdrop-blur-md">
                <Play className="w-12 h-12 text-white fill-white ml-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </div>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-400 tracking-tighter mb-2 drop-shadow-sm">
             ViralScene
           </h1>
           <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase">
             The Future of Content
           </p>
        </div>

        {error && (
          <div className="mb-6 w-full p-4 bg-red-500/10 border border-red-500/30 rounded-full text-red-200 text-sm font-medium text-center shadow-lg backdrop-blur-md">
            {error}
          </div>
        )}

        <div className="w-full">
          <form onSubmit={handleEmailAuth} className="space-y-4 w-full">
            {isRegister && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center justify-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 text-white rounded-full py-3.5 pl-14 pr-6 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all font-medium placeholder-gray-600 shadow-inner"
                  required={isRegister}
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center justify-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
              </div>
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 text-white rounded-full py-3.5 pl-14 pr-6 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all font-medium placeholder-gray-600 shadow-inner"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center justify-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-500 group-focus-within:text-white transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 text-white rounded-full py-3.5 pl-14 pr-6 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all font-medium placeholder-gray-600 shadow-inner"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#ff2a5f] to-[#dd2476] hover:from-[#e02654] hover:to-[#c31e67] text-white font-bold py-4 rounded-full transition-all shadow-[0_0_20px_rgba(255,42,95,0.3)] active:scale-[0.98] mt-4 uppercase tracking-widest text-xs"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest w-full">
             <div className="h-px bg-white/5 flex-1" />
             <span className="px-5">Or continue with</span>
             <div className="h-px bg-white/5 flex-1" />
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full mt-6 bg-white/[0.03] border border-white/5 text-white hover:bg-white/[0.08] hover:border-white/10 font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-5 h-5" />
            <span className="text-sm">Sign in with Google</span>
          </button>

          <div className="mt-8 text-center w-full">
            <p className="text-sm font-medium text-gray-500">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <button 
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="ml-2 text-white border-b border-white/30 hover:border-white font-bold transition-colors focus:outline-none pb-0.5"
              >
                {isRegister ? 'Sign In' : 'Register Here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
