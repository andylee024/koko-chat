"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useChat } from 'ai/react';
import { LightbulbIcon, ImageIcon, UserIcon, BotIcon } from 'lucide-react';
import StoryPrompts from './StoryPrompts';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define the Message interface
interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'data'; // Define the allowed roles
  content: string;
}

interface ChatProps {
  userId: string;
}

export async function fetchUserInfo(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user info:', error);
    return null;
  }

  return data;
}

export default function Chat({ userId }: ChatProps) {

  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const data = await fetchUserInfo(userId);
      setUserInfo(data);
    };

    getUserInfo();
  }, [userId]);

  const assistantPrompt: Message[] = [
    {
      role: 'system',
      content: `
      I am creating a children's story for my unborn niece (Koko) so that she can get to know her parents (Angel and Frank) better. 
      For this project, I am collecting stories, anecdotes, and images of Angel and Frank from their friends and family. 
      This will serve as the inspiration for the children's story that I'm giving to Koko.
      You are an empathetic interviewer that will be talking to the friends and family of Angel and Frank. 
      Your job is to help guide these friends and family in sharing stories and pictures that showcase who Angel and Frank are.

      Notes
      1. Be encouraging and empathetic
      2. Aim to ask 1 question (at most 2 at a time)
      3. If the user is not able to answer, ask a follow-up question to help them answer
      4. Good questions make it easy for the user to think of good stories or qualities of Angel and Frank
      5. Once you've gotten a great story, thank the user for their contribution and give them 2 options, share another story or exit anytime by closing link  
      `,
      id: 'system-1'
    },
    {
      role: 'system',
      content: `
      USER_DATA
      - User name : ${userInfo?.name}
      - User relationship to parents : ${userInfo?.relationship}

      INSTRUCTIONS
      - Say hello to the user by name
      - Introduce yourself as storybot, an AI assistant helping Andy build the childrens story
      - Tell the user about the project, who its for, what its about, and how they can help
      - Tell the user that whenever they feel like they've shared enough stories and images, they can exit anytime by closing link  
      - use newlines to break up the text
      `,
      id: 'system-2'
    }
  ];

  const { messages, input, handleInputChange, handleSubmit, setMessages, reload } = useChat({
    initialMessages: assistantPrompt
  });

    // Use useEffect to trigger the first bot response
    useEffect(() => {
      reload(); // Trigger the assistant to generate a response to the last system message
    }, [reload]);

  const [showPrompts, setShowPrompts] = useState(true);

  const handleQuestionSelect = async (question: string) => {
    // Construct the system message
    const userMessage = `I'd like to explore the question: "${question}"`;
    const systemMessage = `As an empathetic interviewer, help the user explore their question with 1-2 follow-up thoughts to help draw out a good story or anecdote.`;

    // Update the messages array with the new system message
    setMessages([...messages, {
      role: 'user',
      content: userMessage,
      id: 'user-message'
    }, {
      role: 'system',
      content: systemMessage,
      id: 'system-message'
    }]);

    // Trigger the assistant to respond to the new context
    reload();
  };
  
  /* 
  * React component to return 
  */

  return (
    <Card className="flex h-[700px] overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-purple-50">
          <h2 className="text-xl font-semibold text-purple-700">Share your stories of Angel & Frank</h2>
          <p className="text-sm text-purple-600">
            Andy's AI interviewer who will help collect, organize our anecdotes into a children's book for Koko.
          </p>
        </div>
        <div>

  {userInfo ? (
    <div>
      <h1>Welcome, {userInfo.name}!</h1>
      <p>Your relationship to Angel and Frank: {userInfo.relationship}</p>
    </div>
  ) : (
    <p>Loading user information...</p>
  )}
</div>

        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>Welcome! Choose a theme to get started, or just start chatting.</p>
            </div>
          )}
          <div className="space-y-4">
            {messages.filter(message => message.role !== 'system').map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-gray-200 text-black'
                      : 'bg-gray-100 text-black'
                  } shadow-md`}
                >
                  <div>
                    {message.role === 'user' && (
                      <div className="text-xs text-gray-500 mb-1">You</div>
                    )}
                    {message.role === 'assistant' && (
                      <div className="text-xs text-gray-500 mb-1">AI Assistant</div>
                    )}
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your story here..."
              className="flex-grow text-lg"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                Add Photo
              </Button>
            </div>
          </form>

        </div>
      </div>

      {/* Story Prompts Sidebar */}
      {showPrompts && <StoryPrompts onQuestionSelect={handleQuestionSelect} />}
    </Card>
  );
}
