'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, relationship, phone });
    router.push('/story_gathering');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to Koko's Storybook</CardTitle>
          <CardDescription className="text-center">
            Help us create a magical storybook for an unborn niece
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">
            You're about to embark on a wonderful journey to create a unique storybook filled with love, memories, and wishes for a special little one. Your stories, anecdotes, and images will be woven together to create a cherished keepsake.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship to Parents</Label>
              <Input 
                id="relationship" 
                value={relationship} 
                onChange={(e) => setRelationship(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />
            </div>
            <Button type="submit" className="w-full">Start My Story</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-center text-gray-500 w-full">
            By submitting, you agree to share your stories and images for the creation of this special storybook.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 