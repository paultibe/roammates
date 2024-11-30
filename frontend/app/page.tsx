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
          const querySnapshot = await getDoc(doc(db, 'Users', user.sub as string));
          
          if (querySnapshot.exists()) {
            router.push('/dashboard');
          } else {
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
    <div 
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/assets/landing-page.png)' }}
    >
      <a
        href="/api/auth/login"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
      >
        Login
      </a>
    </div>
  );
}
