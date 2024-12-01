'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function DashboardNew() {
  const [imageHeight, setImageHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user: auth0User } = useUser();
  const [tripDates, setTripDates] = useState({
    startDate: '',
    endDate: ''
  });
  const [mates, setMates] = useState({
    mate1: { name: '' },
    mate2: { name: '' },
    mate3: { name: '' },
    mate4: { name: '' }
  });

  useEffect(() => {
    // Load and measure the background image
    const img = document.createElement('img');
    img.src = '/assets/dashboard-new.png';
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
    const fetchTripData = async () => {
      if (!auth0User?.sub) return;
      
      try {
        const docRef = doc(db, 'Users', auth0User.sub);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().Trip) {
          const tripData = docSnap.data().Trip;
          setTripDates({
            startDate: tripData.startDate,
            endDate: tripData.endDate
          });
          setMates({
            mate1: tripData.mate1 || { name: '' },
            mate2: tripData.mate2 || { name: '' },
            mate3: tripData.mate3 || { name: '' },
            mate4: tripData.mate4 || { name: '' }
          });
        }
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    };

    fetchTripData();
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
          backgroundImage: 'url(/assets/dashboard-new.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          height: `${imageHeight}px`,
          width: '100%',
          zIndex: 0
        }}
      >
        {mates.mate1.name && (
          <div className="absolute" style={{ top: '420px', right: '430px' }}>
            <div className="flex items-center gap-4">
              <Image 
                src="/assets/foxalina.png" 
                alt="Foxalina" 
                width={50} 
                height={50}
              />
              <span className="text-black font-bold">{mates.mate1.name}</span>
            </div>
          </div>
        )}

        {mates.mate2.name && (
          <div className="absolute" style={{ top: '480px', right: '460px' }}>
            <div className="flex items-center gap-4">
              <Image 
                src="/assets/jiraffe.png" 
                alt="Jiraffe" 
                width={50} 
                height={50}
              />
              <span className="text-black font-bold">{mates.mate2.name}</span>
            </div>
          </div>
        )}

        {mates.mate3.name && (
          <div className="absolute" style={{ top: '420px', right: '280px' }}>
            <div className="flex items-center gap-4">
              <Image 
                src="/assets/ratty.png" 
                alt="Ratty" 
                width={50} 
                height={50}
              />
              <span className="text-black font-bold">{mates.mate3.name}</span>
            </div>
          </div>
        )}

        {mates.mate4.name && (
          <div className="absolute" style={{ top: '490px', right: '237px' }}>
            <div className="flex items-center gap-4">
              <Image 
                src="/assets/koala.png" 
                alt="Koala" 
                width={50} 
                height={50}
              />
              <span className="text-black font-bold">{mates.mate4.name}</span>
            </div>
          </div>
        )}
      </div>
      <button
        className="absolute z-10"
        style={{
          top: '507px',
          left: '270px',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#F3EEED',
          border: '3px solid #C82128',
          padding: '10px 20px',
          color: 'black',
          borderRadius: '8px',
          width: '300px',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}
        onClick={() => router.push('/trip-dashboard')}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#C82128';
          e.currentTarget.style.color = '#F3EEED';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#F3EEED';
          e.currentTarget.style.color = 'black';
        }}
      >
        waiting on friends
      </button>
    </div>
  );
}
