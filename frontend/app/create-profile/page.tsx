'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';

export default function CreateProfile() {
  const router = useRouter();
  const { user } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !user?.sub) return;

    try {
      setIsSubmitting(true);
      
      await setDoc(doc(db, 'Users', user.sub), {
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-center bg-no-repeat relative"
      style={{ 
        backgroundImage: 'url(/assets/welcome.png)',
        backgroundSize: '100% 100%'
      }}
    >
      <form onSubmit={createProfile} className="absolute top-1/2 -translate-y-1/2">
        <div className="relative" style={{ left: '40px', top: '20px' }}>
          <Image
            src="/assets/text-box.png"
            alt="Name Input Background"
            width={300}
            height={45}
            className="w-full"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="absolute inset-0 bg-transparent text-black px-4 outline-none"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="relative mt-10" style={{ left: '40px', top: '30px' }}>
          <Image
            src="/assets/text-box.png"
            alt="Email Input Background"
            width={300}
            height={45}
            className="w-full"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="absolute inset-0 bg-transparent text-black px-4 outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-[300px] px-4 py-2 rounded text-white disabled:opacity-50 mt-10"
          style={{ backgroundColor: '#024021', left: '45px', position: 'relative', top: '15px' }}
        >
          {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
} 