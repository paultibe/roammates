'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      if (user.is_new_user) {
        router.push('/create-profile');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="p-4">
      {!user && (
        <a
          href="/api/auth/login"
          className="text-blue-500 hover:text-blue-700"
        >
          Login
        </a>
      )}
    </div>
  );
}
