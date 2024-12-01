"use client";
import { useState } from 'react';

export default function Home() {
  const [places, setPlaces] = useState<any[]>([]);
  
  const fetchPlaces = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/places?city=paris`, {
        method: 'GET',
      });
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setPlaces(data.results);
      
      // Save to file
      const blob = new Blob([JSON.stringify(data.results, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'paris-places.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="p-8">
      <button 
        onClick={fetchPlaces}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Paris Places
      </button>
      
      <div className="mt-4">
        {places.map((place, index) => (
          <div key={index} className="border p-4 mb-2 rounded">
            <h2 className="font-bold">{place.name}</h2>
            <p>{place.formatted_address}</p>
            <p>Rating: {place.rating}</p>
            <a 
              href={`https://www.google.com/maps?q=${place.geometry.location.lat},${place.geometry.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              View on Maps
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}