'use client';
import { useState } from 'react';
import TextBox from '@/components/TextBox';

export default function Mate() {
  const [mate1, setMate1] = useState({ name: '', email: '' });
  const [mate2, setMate2] = useState({ name: '', email: '' });
  const [mate3, setMate3] = useState({ name: '', email: '' });
  const [mate4, setMate4] = useState({ name: '', email: '' });

  return (
    <div className="h-[300px] overflow-y-auto space-y-8 p-4">
      <div className="space-y-4">
        <div className="text-black underline">mate 1</div>
        <div className="text-black">name:</div>
        <TextBox
          placeholder="Name"
          style={{ width: '250px' }}
          value={mate1.name}
          onChange={(e) => setMate1({ ...mate1, name: e.target.value })}
        />
        <div className="text-black">email address:</div>
        <TextBox
          placeholder="Email"
          type="email"
          style={{ width: '250px' }}
          value={mate1.email}
          onChange={(e) => setMate1({ ...mate1, email: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="text-black underline">mate 2</div>
        <div className="text-black">name:</div>
        <TextBox
          placeholder="Name"
          style={{ width: '250px' }}
          value={mate2.name}
          onChange={(e) => setMate2({ ...mate2, name: e.target.value })}
        />
        <div className="text-black">email address:</div>
        <TextBox
          placeholder="Email"
          type="email"
          style={{ width: '250px' }}
          value={mate2.email}
          onChange={(e) => setMate2({ ...mate2, email: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="text-black underline">mate 3</div>
        <div className="text-black">name:</div>
        <TextBox
          placeholder="Name"
          style={{ width: '250px' }}
          value={mate3.name}
          onChange={(e) => setMate3({ ...mate3, name: e.target.value })}
        />
        <div className="text-black">email address:</div>
        <TextBox
          placeholder="Email"
          type="email"
          style={{ width: '250px' }}
          value={mate3.email}
          onChange={(e) => setMate3({ ...mate3, email: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <div className="text-black underline">mate 4</div>
        <div className="text-black">name:</div>
        <TextBox
          placeholder="Name"
          style={{ width: '250px' }}
          value={mate4.name}
          onChange={(e) => setMate4({ ...mate4, name: e.target.value })}
        />
        <div className="text-black">email address:</div>
        <TextBox
          placeholder="Email"
          type="email"
          style={{ width: '250px' }}
          value={mate4.email}
          onChange={(e) => setMate4({ ...mate4, email: e.target.value })}
        />
      </div>
    </div>
  );
}
