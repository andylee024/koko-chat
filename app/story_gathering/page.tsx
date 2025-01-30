'use client';

import Chat from "../../components/Chat";
import Sidebar from "../../components/Sidebar";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import StoryImageUpload from "../../components/ImageDrop";

export default function StoryGatheringPage() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user_id = searchParams.get('user_id');
    if (user_id) {
      setUserId(user_id);
      console.log('search_params user_id', user_id);
      console.log('userId set by search params', userId);
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <main className="flex-1 p-8 overflow-auto max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Baby Koko's Children Book</h1>
          <p className="text-gray-600">Help create a special book of memories about Angel and Frank.</p>
        </div>

        {/* Story Chat Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-4 border-b bg-purple-50">
            <h2 className="text-xl font-semibold mb-1 text-purple-700">Share your stories of Angel & Frank</h2>
            <p className="text-sm text-purple-600">
              Andy's AI interviewer who will help collect, organize our anecdotes into a children's book for Koko.
            </p>
          </div>
          <Chat userId={userId} />
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-4 border-b bg-purple-50">
            <h2 className="text-xl font-semibold mb-1 text-purple-700">Share Photos of Angel and Frank</h2>
            <p className="text-sm text-purple-600">
              Share memorable pictures of Angel and Frank to inspire the book illustrations.
            </p>
          </div>
          <div className="p-6">
            <StoryImageUpload userId={userId} />
          </div>
        </div>
      </main>
    </div>
  );
} 