'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold text-white">
            Koko&apos;s Storybook
          </h1>
          <p className="text-xl text-white">
            Help create a magical collection of memories and stories for baby Koko
          </p>
          <div className="space-x-4">
            <Button asChild variant="secondary">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

