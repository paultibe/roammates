'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function TripDashboard() {
  const router = useRouter();
  const { user: auth0User } = useUser();
  const [imageHeight, setImageHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
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
    img.src = '/assets/trip-dashboard.png';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/ready-to-vote');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

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
          backgroundImage: 'url(/assets/trip-dashboard.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          height: `${imageHeight}px`,
          width: '100%',
          zIndex: 0
        }}
      >
        <button
          className="absolute z-10 cursor-pointer"
          style={{ top: '200px', left: '45px' }}
        >
          <Image
            src="/assets/waiting-on-friends.png"
            alt="Waiting on Friends"
            width={280}
            height={60}
          />
        </button>

        <div 
          className="absolute text-black text-2xl font-bold"
          style={{
            top: '365px',
            left: '243px',
            transform: 'translateX(-50%)',
            width: '400px',
            textAlign: 'center'
          }}
        >
          {tripDates.startDate && tripDates.endDate && 
            `${tripDates.startDate} - ${tripDates.endDate}`
          }
        </div>

        {mates.mate1.name && (
          <div className="absolute" style={{ top: '650px', right: '1000px' }}>
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
          <div className="absolute" style={{ top: '700px', right: '1030px' }}>
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
          <div className="absolute" style={{ top: '650px', right: '840px' }}>
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
          <div className="absolute" style={{ top: '711px', right: '800px' }}>
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
    </div>
  );
}
