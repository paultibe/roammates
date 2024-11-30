'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';

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
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl">Create User Profile</h1>
      </div>

      <form onSubmit={createProfile} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Enter your email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
} 