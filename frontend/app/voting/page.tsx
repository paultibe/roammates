'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Voting() {
  const router = useRouter();
  const { user: auth0User } = useUser();
  const [imageHeight, setImageHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rankingBlockRef = useRef<HTMLDivElement>(null);
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

  // Add state for draggable items and rankings
  const [activities, setActivities] = useState([
    { id: 'explore', src: '/assets/explore.png', position: { x: 85, y: 320 }, isRanked: false },
    { id: 'museum', src: '/assets/museum.png', position: { x: 85, y: 420 }, isRanked: false },
    { id: 'shop', src: '/assets/shop.png', position: { x: 85, y: 520 }, isRanked: false },
    { id: 'eat', src: '/assets/eat.png', position: { x: 85, y: 620 }, isRanked: false }
  ]);
  const [rankedActivities, setRankedActivities] = useState<Array<{id: string, offset: number}>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedRankedIndex, setDraggedRankedIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartY, setDragStartY] = useState(0);

  useEffect(() => {
    // Load and measure the background image
    const img = document.createElement('img');
    img.src = '/assets/voting.png';
    img.onload = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
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

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    setDraggedIndex(index);
  };

  const handleRankedMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setIsDragging(true);
    setDraggedRankedIndex(index);
    setDragStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    if (draggedIndex !== null) {
      const newActivities = [...activities];
      newActivities[draggedIndex] = {
        ...newActivities[draggedIndex],
        position: {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }
      };
      setActivities(newActivities);
    } else if (draggedRankedIndex !== null) {
      const deltaY = e.clientY - dragStartY;
      const newRankedActivities = [...rankedActivities];
      newRankedActivities[draggedRankedIndex] = {
        ...newRankedActivities[draggedRankedIndex],
        offset: deltaY
      };
      setRankedActivities(newRankedActivities);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggedIndex !== null) {
      const rankingBlock = rankingBlockRef.current?.getBoundingClientRect();
      if (rankingBlock) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        if (
          mouseX >= rankingBlock.left &&
          mouseX <= rankingBlock.right &&
          mouseY >= rankingBlock.top &&
          mouseY <= rankingBlock.bottom
        ) {
          const draggedActivity = activities[draggedIndex];
          if (!draggedActivity.isRanked) {
            setRankedActivities(prev => [...prev, { id: draggedActivity.id, offset: 0 }]);
            const newActivities = [...activities];
            newActivities[draggedIndex] = {
              ...newActivities[draggedIndex],
              isRanked: true
            };
            setActivities(newActivities);
          }
        }
      }
    } else if (draggedRankedIndex !== null) {
      const currentOffset = rankedActivities[draggedRankedIndex].offset;
      const itemHeight = 80; // Approximate height of each ranked item
      const positionChange = Math.round(currentOffset / itemHeight);
      
      if (positionChange !== 0) {
        const newRankedActivities = [...rankedActivities];
        const [movedItem] = newRankedActivities.splice(draggedRankedIndex, 1);
        const newIndex = Math.max(0, Math.min(draggedRankedIndex + positionChange, rankedActivities.length - 1));
        newRankedActivities.splice(newIndex, 0, { ...movedItem, offset: 0 });
        setRankedActivities(newRankedActivities.map(item => ({ ...item, offset: 0 })));
      } else {
        // Reset offset if no position change
        setRankedActivities(prev => prev.map(item => ({ ...item, offset: 0 })));
      }
    }

    setIsDragging(false);
    setDraggedIndex(null);
    setDraggedRankedIndex(null);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen overflow-y-auto relative"
      style={{ height: '100vh' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: 'url(/assets/voting.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          height: `${imageHeight}px`,
          width: '100%',
          zIndex: 0
        }}
      >
        {activities.map((activity, index) => (
          !activity.isRanked && (
            <div 
              key={activity.id}
              className="absolute cursor-move"
              style={{ 
                left: `${activity.position.x}px`, 
                top: `${activity.position.y}px`,
                zIndex: draggedIndex === index ? 10 : 1,
                userSelect: 'none'
              }}
              onMouseDown={(e) => handleMouseDown(e, index)}
            >
              <Image
                src={activity.src}
                alt={activity.id}
                width={450}
                height={60}
                draggable={false}
              />
            </div>
          )
        ))}

        <div 
          ref={rankingBlockRef}
          className="absolute" 
          style={{ top: '280px', right: '90px' }}
        >
          <Image
            src="/assets/ranking-block.png"
            alt="Ranking Block"
            width={520}
            height={360}
            draggable={false}
          />
          <div className="absolute inset-0 flex flex-col items-center pt-16 gap-4">
            {rankedActivities.map((rankedActivity, index) => {
              const activity = activities.find(a => a.id === rankedActivity.id);
              return (
                <div 
                  key={rankedActivity.id} 
                  className="w-[450px] cursor-move transition-transform"
                  onMouseDown={(e) => handleRankedMouseDown(e, index)}
                  style={{
                    transform: `translateY(${rankedActivity.offset}px)`,
                    opacity: draggedRankedIndex === index ? 0.5 : 1,
                    zIndex: draggedRankedIndex === index ? 20 : 1
                  }}
                >
                  <Image
                    src={activity?.src || ''}
                    alt={rankedActivity.id}
                    width={450}
                    height={60}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => router.push('/voting-in-progress')}
          className="absolute bottom-[20px] right-[90px] z-10 cursor-pointer"
        >
          <Image
            src="/assets/next.png"
            alt="next"
            width={140}
            height={60}
          />
        </button>
      </div>
    </div>
  );
}
