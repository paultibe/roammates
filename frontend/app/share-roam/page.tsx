'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ShareRoam() {
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
    img.src = '/assets/share.png';
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

  const downloadAsPDF = async () => {
    if (!containerRef.current) return;

    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('roam-trip.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
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
      <button
        onClick={downloadAsPDF}
        className="absolute bottom-[20px] left-[670px] z-10 cursor-pointer"
      >
        <Image
          src="/assets/download-roam.png"
          alt="download-roam"
          width={217}
          height={60}
        />
      </button>

      <button
        onClick={() => router.push('/dashboard-new')}
        className="absolute bottom-[20px] right-[100px] z-10 cursor-pointer"
      >
        <Image
          src="/assets/return-to-dashboard.png"
          alt="return-to-dashboard"
          width={270}
          height={60}
        />
      </button>

      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: 'url(/assets/share.png)',
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

        {mates.mate1.name && (
          <div className="absolute" style={{ top: '500px', right: '430px' }}>
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
          <div className="absolute" style={{ top: '560px', right: '460px' }}>
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
          <div className="absolute" style={{ top: '500px', right: '280px' }}>
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
          <div className="absolute" style={{ top: '570px', right: '237px' }}>
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
