'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user && !isLoading) {
        try {
          // Check if user exists in Firebase
          const querySnapshot = await getDoc(doc(db, 'Users', user.sub as string));
          
          if (querySnapshot.exists()) {
            // User exists, go to dashboard
            router.push('/dashboard');
          } else {
            // New user, go to create profile
            router.push('/create-profile');
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        }
      }
    };

    checkUserProfile();
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 flex justify-center items-center min-h-screen">
      <a
        href="/api/auth/login"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
      >
        Login
      </a>
    </div>
  );
}
