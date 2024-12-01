'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import TextBox from '@/components/TextBox';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';
import Mate from '@/components/Mate';

export default function Who() {
  const router = useRouter();
  const { user: auth0User } = useUser();
  const [imageHeight, setImageHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tripDates, setTripDates] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Load and measure the background image
    const img = document.createElement('img');
    img.src = '/assets/who.png';
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
    const fetchTripDates = async () => {
      if (!auth0User?.sub) return;
      
      try {
        const docRef = doc(db, 'Users', auth0User.sub);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().Trip) {
          const { startDate, endDate } = docSnap.data().Trip;
          setTripDates({ startDate, endDate });
        }
      } catch (error) {
        console.error('Error fetching trip dates:', error);
      }
    };

    fetchTripDates();
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
          backgroundImage: 'url(/assets/who.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          height: `${imageHeight}px`,
          width: '100%',
          zIndex: 0
        }}
      >
        <div 
          className="absolute text-black text-2xl font-bold"
          style={{
            top: '380px',
            left: '818px',
            transform: 'translateX(-50%)',
            width: '400px',
            textAlign: 'center'
          }}
        >
          {tripDates.startDate && tripDates.endDate && 
            `${tripDates.startDate} - ${tripDates.endDate}`
          }
        </div>

        <div
          className="absolute"
          style={{
            top: '450px',
            left: '160px',
            width: '400px'
          }}
        >
          <Mate />
        </div>
      </div>
    </div>
  );
}
