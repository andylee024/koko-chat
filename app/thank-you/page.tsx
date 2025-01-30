import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <Heart className="mx-auto h-12 w-12 text-purple-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-purple-900 mb-4">
            Thank You for Your Contribution!
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            Your stories and photos will help create a beautiful and meaningful book for Koko 
            to learn about Angel and Frank. We appreciate you taking the time to share these 
            precious memories.
          </p>

          <div className="space-y-4">
            <p className="text-sm text-purple-600">
              Want to share more stories or photos?
            </p>
            <Link href="/story_gathering">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Share More Memories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 