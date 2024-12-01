'use client';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useUser } from '@auth0/nextjs-auth0/client';

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
        };
      };
    };
  }
}

interface GooglePlacesInputProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

function GooglePlacesInput({ onPlaceSelect }: GooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const { user } = useUser();

  const savePlace = async (place: google.maps.places.PlaceResult) => {
    if (place.geometry && user?.sub) {
      try {
        await setDoc(doc(db, 'trips', user.sub), {
          destination: place.formatted_address,
          placeId: place.place_id,
          coordinates: {
            lat: place.geometry.location?.lat(),
            lng: place.geometry.location?.lng()
          },
          timestamp: new Date()
        }, { merge: true });
        onPlaceSelect(place);
      } catch (error) {
        console.error('Error saving to Firebase:', error);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && inputRef.current && !autocomplete) {
      const autoComplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)']
      });

      autoComplete.addListener('place_changed', () => {
        const place = autoComplete.getPlace();
        if (place.geometry) {
          savePlace(place);
        }
      });

      setAutocomplete(autoComplete);
    }
  }, [user]);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
        strategy="lazyOnload"
      />
      <input
        ref={inputRef}
        type="text"
        className="w-[400px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter a destination"
      />
    </>
  );
}

export default GooglePlacesInput;