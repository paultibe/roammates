'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Image from 'next/image';

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
      className="min-h-screen bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: 'url(/assets/landing-page.png)',
        backgroundSize: 'cover'
      }}
    >
      <div className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 flex gap-4">
        <a href="/api/auth/login" className="hover:opacity-80 transition-opacity">
          <Image
            src="/assets/sign-up.png"
            alt="Sign Up"
            width={120}
            height={100}
            priority
          />
        </a>
        <a href="/api/auth/login" className="hover:opacity-80 transition-opacity">
          <Image
            src="/assets/login.png"
            alt="Login"
            width={100}
            height={60}
            priority
          />
        </a>
      </div>
    </div>
  );
}
