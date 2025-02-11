'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Chat from "../../components/Chat";
import StoryImageUpload from "../../components/ImageDrop";
import SubmissionPanel from "@/components/SubmissionPanel";

import { uploadImageToStorage, saveImageToDatabase } from '@/utils/supabase_utils';
import { useAuth } from '@/utils/supabase_auth';

function StoryGatheringContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [collectedImages, setCollectedImages] = useState<File[]>([]);
  
  const [submissionStatus, setSubmissionStatus] = useState({
    hasStory: false,
    hasPhotos: false
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  const handleFinalSubmit = async () => {
    console.log('Starting final submit with images:', collectedImages.length);
    
    if (user && collectedImages.length > 0) {
      try {
        for (const image of collectedImages) {
          console.log('Processing image:', image.name);

          // Upload to storage and get URL
          const publicUrl = await uploadImageToStorage(image, user.id);
          console.log('Got public URL:', publicUrl);
          
          if (!publicUrl) throw new Error('Failed to get public URL');
          
          // Save URL to database
          const result = await saveImageToDatabase(user.id, publicUrl);
          console.log('Saved to database:', result);
        }
      } catch (error) {
        console.error('Error processing images:', error);
        return; // Don't redirect if there's an error
      }
    }
    
    router.push('/thank-you');
  };

  console.log('Current collected images:', collectedImages.length);

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
            <h2 className="text-xl font-semibold mb-1 text-purple-700">Share your stories of Angel & Frank</h2>
            <p className="text-sm text-purple-600">
              {"Andy's AI interviewer will help collect your memories into a children's book for Koko."}
            </p>
          </div>
          {user ? (
            <Chat 
              onStorySubmitted={() => setSubmissionStatus(prev => ({ ...prev, hasStory: true }))} 
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-xl shadow-sm mb-20">
          <div className="p-4 border-b bg-purple-50">
            <h2 className="text-xl font-semibold mb-1 text-purple-700">2. Share Photos of Angel and Frank</h2>
            <p className="text-sm text-purple-600">
              Help us collect memorable photos for Kokos storybook.
            </p>
          </div>
          <div className="p-6">
            {user ? (
              <StoryImageUpload 
                onImagesUploaded={() => {
                  console.log('Images uploaded callback triggered');
                  setSubmissionStatus(prev => ({ ...prev, hasPhotos: true }));
                }}
                onImagesCollected={(files) => {
                  console.log('Collecting images:', files.length);
                  setCollectedImages(files);
                }}
              />
            ) : (
              <div className="text-center py-4 text-gray-500">Loading image upload...</div>
            )}
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

// Loading fallback component defined in the same file
function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default function StoryGatheringPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <StoryGatheringContent />
    </Suspense>
  );
} 