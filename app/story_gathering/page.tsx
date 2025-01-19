'use client';

import Chat from "../../components/Chat";
import Sidebar from "../../components/Sidebar";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function StoryGatheringPage() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user_id = searchParams.get('user_id');
    if (user_id) {
      setUserId(user_id);
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Story Gathering for Baby Koko</h1>
        <Chat userId={userId} />
      </main>
      <Sidebar />
    </div>
  );
} 