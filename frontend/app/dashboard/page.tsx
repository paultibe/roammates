'use client';
import { useEffect, useState, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user: auth0User } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [imageHeight, setImageHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load and measure the background image
    const img = document.createElement('img');
    img.src = '/assets/dashboard.png';
    img.onload = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Calculate height maintaining aspect ratio
        const aspectRatio = img.height / img.width;
        const calculatedHeight = containerWidth * aspectRatio;
        setImageHeight(calculatedHeight);
      }
    };
  }, []);

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
    <div 
      ref={containerRef}
      className="min-h-screen overflow-y-auto relative"
      style={{ 
        height: '100vh',
      }}
    >
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: 'url(/assets/dashboard.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          height: `${imageHeight}px`,
          width: '100%',
          zIndex: 0
        }}
      >
        <div className="absolute" style={{ left: '937px', top: '245px', zIndex: 1 }}>
          <Image
            src="/assets/plane.png"
            alt="Plane"
            width={30}
            height={30}
            priority
          />
        </div>
        <button 
          onClick={() => router.push('/when')}
          className="absolute hover:opacity-80 transition-opacity"
          style={{ left: '930px', top: '230px' }}
        >
          <Image
            src="/assets/new-roam.png"
            alt="New Roam"
            width={200}
            height={60}
            priority
          />
        </button>
      </div>
    </div>
  );
} 