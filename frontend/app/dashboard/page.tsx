'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';

interface UserProfile {
  name: string;
}

export default function Dashboard() {
  const { user: auth0User } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!auth0User?.sub) return;
      
      try {
        const docRef = doc(db, 'Users', auth0User.sub);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [auth0User]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        {userProfile && (
          <div className="text-white text-2xl">
            Hi {userProfile.name}!
          </div>
        )}
        <a
          href="/api/auth/logout"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </a>
      </div>
    </div>
  );
} 