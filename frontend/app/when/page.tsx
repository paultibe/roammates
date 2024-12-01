'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import TextBox from '@/components/TextBox';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function When() {
  const router = useRouter();
  const { user: auth0User } = useUser();
  const [imageHeight, setImageHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Load and measure the background image
    const img = document.createElement('img');
    img.src = '/assets/when.png';
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

  const handleNext = async () => {
    if (!auth0User?.sub) {
      console.error('No user ID found');
      return;
    }

    try {
      // Update user document with trip data
      const userRef = doc(db, 'Users', auth0User.sub);
      await updateDoc(userRef, {
        Trip: {
          startDate,
          endDate
        }
      });
      
      // Navigate to next page
      router.push('/who');
    } catch (error) {
      console.error('Error updating user with trip:', error);
    }
  };

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
          backgroundImage: 'url(/assets/when.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          height: `${imageHeight}px`,
          width: '100%',
          zIndex: 0
        }}
      >
        <div className="absolute space-y-11" style={{ top: '485px', left: '160px' }}>
          <TextBox
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            type="date"
            style={{ width: '250px' }}
          />
          <TextBox
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date" 
            type="date"
            style={{ width: '250px' }}
          />
        </div>

        <button 
          onClick={handleNext}
          className="absolute hover:opacity-80 transition-opacity"
          style={{ right: '105px', bottom: '20px', width: '120px' }}
        >
          <Image
            src="/assets/next.png"
            alt="Next"
            width={200}
            height={60}
            priority
          />
        </button>
      </div>
    </div>
  );
}
