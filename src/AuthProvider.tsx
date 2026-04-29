import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { auth, isFirebaseEnabled } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import AuthScreen from './AuthScreen';

export const AuthContext = React.createContext<{
  user: any | null;
  convexUserId: string | null;
  loading: boolean;
}>({ user: null, convexUserId: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [convexUserId, setConvexUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const syncUser = useMutation(api.users.syncUser);
  const getUser = useQuery(api.users.getUserByUid, user?.uid ? { uid: user.uid } : "skip");

  useEffect(() => {
    console.log("AuthProvider Initializing. FirebaseEnabled:", isFirebaseEnabled);
    if (!isFirebaseEnabled) {
      console.warn("Firebase not configured. Using local mock auth.");
      const localUid = localStorage.getItem('mock_uid');
      if (localUid) {
        console.log("Found local UID:", localUid);
        setUser({ uid: localUid, displayName: "Guest User" });
      } else {
        console.log("No local UID found. Setting loading to false.");
        setLoading(false);
      }
      return;
    }
    
    console.log("Setting up onAuthStateChanged");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("onAuthStateChanged triggered. User:", firebaseUser?.uid);
      setUser(firebaseUser);
      setLoading(false); // Set loading to false *before* syncing
      
      if (firebaseUser) {
        try {
          console.log("Syncing user (async) for:", firebaseUser.uid);
          const cId = await syncUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || undefined,
            avatarUrl: firebaseUser.photoURL || undefined,
          });
          console.log("User synced. ConvexID:", cId);
          setConvexUserId(cId as string);
        } catch (e) {
          console.error("Error syncing user to convex:", e);
        }
      } else {
        console.log("No firebase user.");
        setConvexUserId(null);
      }
    });

    return () => unsubscribe();
  }, [syncUser]);

  // For local mock auth, we need to sync user as well after setUser is called
  useEffect(() => {
    if (!isFirebaseEnabled && user && !convexUserId) {
      syncUser({
        uid: user.uid,
        displayName: user.displayName,
      }).then(cId => {
        setConvexUserId(cId as string);
        setLoading(false);
      }).catch(e => {
        console.error(e);
        setLoading(false);
      });
    }
  }, [user, convexUserId, syncUser]);

  return (
    <AuthContext.Provider value={{ user, convexUserId, loading }}>
      {loading ? (
        <div className="w-full h-screen bg-black flex items-center justify-center text-white">Loading...</div>
      ) : user ? (
        children
      ) : (
        <AuthScreen 
          onMockLogin={(name) => {
             const uid = "local_" + Date.now();
             localStorage.setItem('mock_uid', uid);
             setUser({ uid, displayName: name });
          }}
        />
      )}
    </AuthContext.Provider>
  );
}
