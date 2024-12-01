'use client';
import { useState } from 'react';
import TextBox from '@/components/TextBox';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

export default function Mate() {
  const { user: auth0User } = useUser();
  const [mate1, setMate1] = useState({ name: '', email: '', submitted: false });
  const [mate2, setMate2] = useState({ name: '', email: '', submitted: false });
  const [mate3, setMate3] = useState({ name: '', email: '', submitted: false });
  const [mate4, setMate4] = useState({ name: '', email: '', submitted: false });

  const handleEmailSubmit = async (mateNumber: number, mateData: { name: string, email: string }) => {
    if (!auth0User?.sub) {
      console.error('No user ID found');
      return;
    }

    try {
      const userRef = doc(db, 'Users', auth0User.sub);
      await updateDoc(userRef, {
        [`Trip.mate${mateNumber}`]: {
          name: mateData.name,
          emailAddress: mateData.email
        }
      });
      if (mateNumber === 1) {
        setMate1(prev => ({ ...prev, submitted: true }));
      }
      if (mateNumber === 2) {
        setMate2(prev => ({ ...prev, submitted: true }));
      }
      if (mateNumber === 3) {
        setMate3(prev => ({ ...prev, submitted: true }));
      }
      if (mateNumber === 4) {
        setMate4(prev => ({ ...prev, submitted: true }));
      }
    } catch (error) {
      console.error(`Error updating mate${mateNumber}:`, error);
    }
  };

  return (
    <div className="relative">
      {mate1.submitted && mate1.name && (
        <div className="absolute" style={{ top: '100px', right: '-300px' }}>
          <div className="flex items-center gap-4">
            <Image 
              src="/assets/foxalina.png" 
              alt="Foxalina" 
              width={50} 
              height={50}
            />
            <span className="text-black font-bold">{mate1.name}</span>
          </div>
        </div>
      )}

      {mate2.submitted && mate2.name && (
        <div className="absolute" style={{ top: '160px', right: '-270px' }}>
          <div className="flex items-center gap-4">
            <Image 
              src="/assets/jiraffe.png" 
              alt="Jiraffe" 
              width={50} 
              height={50}
            />
            <span className="text-black font-bold">{mate2.name}</span>
          </div>
        </div>
      )}

      {mate3.submitted && mate3.name && (
        <div className="absolute" style={{ top: '100px', right: '-450px' }}>
          <div className="flex items-center gap-4">
            <Image 
              src="/assets/ratty.png" 
              alt="Ratty" 
              width={50} 
              height={50}
            />
            <span className="text-black font-bold">{mate3.name}</span>
          </div>
        </div>
      )}

      {mate4.submitted && mate4.name && (
        <div className="absolute" style={{ top: '170px', right: '-490px' }}>
          <div className="flex items-center gap-4">
            <Image 
              src="/assets/koala.png" 
              alt="Koala" 
              width={50} 
              height={50}
            />
            <span className="text-black font-bold">{mate4.name}</span>
          </div>
        </div>
      )}
      
      <div className="h-[300px] overflow-y-auto space-y-8 p-4">
        <div className="space-y-2">
          <div className="text-black underline font-bold text-lg">mate 1</div>
          <div className="text-black font-bold text-lg">name:</div>
          <TextBox
            placeholder="Name"
            style={{ width: '250px' }}
            value={mate1.name}
            onChange={(e) => setMate1({ ...mate1, name: e.target.value })}
          />
          <div className="text-black font-bold text-lg">email address:</div>
          <TextBox
            placeholder="Email"
            type="email"
            style={{ width: '250px' }}
            value={mate1.email}
            onChange={(e) => setMate1({ ...mate1, email: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mate1.name) {
                handleEmailSubmit(1, mate1);
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="text-black underline font-bold text-lg">mate 2</div>
          <div className="text-black font-bold text-lg">name:</div>
          <TextBox
            placeholder="Name"
            style={{ width: '250px' }}
            value={mate2.name}
            onChange={(e) => setMate2({ ...mate2, name: e.target.value })}
          />
          <div className="text-black font-bold text-lg">email address:</div>
          <TextBox
            placeholder="Email"
            type="email"
            style={{ width: '250px' }}
            value={mate2.email}
            onChange={(e) => setMate2({ ...mate2, email: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mate2.name) {
                handleEmailSubmit(2, mate2);
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="text-black underline font-bold text-lg">mate 3</div>
          <div className="text-black font-bold text-lg">name:</div>
          <TextBox
            placeholder="Name"
            style={{ width: '250px' }}
            value={mate3.name}
            onChange={(e) => setMate3({ ...mate3, name: e.target.value })}
          />
          <div className="text-black font-bold text-lg">email address:</div>
          <TextBox
            placeholder="Email"
            type="email"
            style={{ width: '250px' }}
            value={mate3.email}
            onChange={(e) => setMate3({ ...mate3, email: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mate3.name) {
                handleEmailSubmit(3, mate3);
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="text-black underline font-bold text-lg">mate 4</div>
          <div className="text-black font-bold text-lg">name:</div>
          <TextBox
            placeholder="Name"
            style={{ width: '250px' }}
            value={mate4.name}
            onChange={(e) => setMate4({ ...mate4, name: e.target.value })}
          />
          <div className="text-black font-bold text-lg">email address:</div>
          <TextBox
            placeholder="Email"
            type="email"
            style={{ width: '250px' }}
            value={mate4.email}
            onChange={(e) => setMate4({ ...mate4, email: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && mate4.name) {
                handleEmailSubmit(4, mate4);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
