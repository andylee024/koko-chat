'use client';

import Chat from "../../components/Chat";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import StoryImageUpload from "../../components/ImageDrop";
import SubmissionPanel from "@/components/SubmissionPanel";

export default function StoryGatheringPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState({
    hasStory: false,
    hasPhotos: false
  });

  useEffect(() => {
    const user_id = searchParams.get('user_id');
    if (user_id) {
      setUserId(user_id);
      console.log('search_params user_id', user_id);
      console.log('userId set by search params', userId);
    }
  }, [searchParams]);

  const handleFinalSubmit = () => {
    // You might want to do any final data saving here
    router.push('/thank-you');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <main className="flex-1 p-8 overflow-auto max-w-5xl mx-auto relative">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Story Gathering for Baby Koko</h1>
          <p className="text-gray-600">Help create a special book of memories about Angel and Frank.</p>
        </div>

        {/* Story Chat Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-4 border-b bg-purple-50">
            <h2 className="text-xl font-semibold mb-1 text-purple-700">1. Share your stories of Angel & Frank</h2>
            <p className="text-sm text-purple-600">
              Andy's AI interviewer will help collect your memories into a children's book for Koko.
            </p>
          </div>
          <Chat 
            userId={userId} 
            onStorySubmitted={() => setSubmissionStatus(prev => ({ ...prev, hasStory: true }))} 
          />
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-xl shadow-sm mb-20">
          <div className="p-4 border-b bg-purple-50">
            <h2 className="text-xl font-semibold mb-1 text-purple-700">2. Share Photos of Angel and Frank</h2>
            <p className="text-sm text-purple-600">
              Help us collect memorable photos for Koko's storybook.
            </p>
          </div>
          <div className="p-6">
            <StoryImageUpload 
              userId={userId} 
              onImagesUploaded={() => setSubmissionStatus(prev => ({ ...prev, hasPhotos: true }))} 
            />
          </div>
        </div>

        {/* Submission Panel */}
        <SubmissionPanel 
          status={submissionStatus} 
          onSubmit={handleFinalSubmit} 
        />
      </main>
    </div>
  );
} 