"use client";

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { ScrollArea } from "@/components/ui/scroll-area";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import StoryPrompts from './StoryPrompts';
import { createNewConversation, fetchUserByEmail, saveConversation } from '@/utils/supabase_utils';
import { useAuth } from '@/utils/supabase_auth';


// Interfaces
interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'data';
  content: string;
}

interface ChatProps {
  onStorySubmitted: () => void;
}

export default function Chat({ onStorySubmitted }: ChatProps) {
  // Add auth context
  const { user } = useAuth();
  
  // setup user state
  const [conversationId, setConversationId] = useState<string | null>(null);

  // setup chatbot state
  // const [showPrompts, setShowPrompts] = useState(true);
  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit, setMessages, reload } = useChat({
    initialMessages: []
  });

  // setup UI state
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // First useEffect - update chatbot when user changes
  useEffect(() => {
    const initializeWithUser = async () => {
      if (!user?.email) return;
      
      const userData = await fetchUserByEmail(user.email);

      console.log(userData);
      const { conversation_id } = await createNewConversation(user.id);
      const prompt = createAssistantPrompt(userData.name, userData.relationship);

      setMessages(prompt);
      setConversationId(conversation_id);
      reload();
    };
    initializeWithUser();
  }, [user]);

  // Second useEffect - scroll to bottom of chat
  useEffect(() => {
    const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Third useEffect - save conversation history to supabase
  useEffect(() => {
    if (conversationId) {
      const conversationHistory = messages.map(message => `${message.role}: ${message.content}`).join('\n');
      saveConversation(conversationId, conversationHistory);
    }
  }, [messages]);

  // Wrap the chat submit handler to check for first message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If this is the first user message, trigger the checkbox
    if (messages.filter(m => m.role === 'user').length === 0 && input.trim()) {
      onStorySubmitted();
    }
    
    handleChatSubmit(e);
  };

  // handle question selection
  const handleQuestionSelect = async (question: string) => {

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
  
  // React component to return 
  return (
    <Card className="flex h-[700px]">
      {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
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
                placeholder="Share your story here..."
                className="flex-grow text-lg"
              />
            </form>
        </div>
      </div>

      {/* Story Prompts Sidebar */}
      {<StoryPrompts onQuestionSelect={handleQuestionSelect} />}
    </Card>
  );
}

// Utility Functions
function createAssistantPrompt(name: string, relationship: string): Message[] {
  const prompt : Message[] = [
    {
      role: 'system',
      content: `
      I am creating a children's story for my niece (Koko) so she can know her parents (Angel and Frank) better. 
      For this project, I am collecting stories, anecdotes, and pictures of Angel and Frank from their friends and family. 
      I plan to create a children's story for Koko that will be a collection of these stories and pictures.
      You are an empathetic interviewer who will be talking to friends and family of Angel and Frank. 
      Your job is to help guide them in sharing stories and pictures that showcase who Angel and Frank are.

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
      - The user's name is ${name}
      - The user's relationship to parents is ${relationship}

      INSTRUCTIONS
      - Say hello to the user by name
      - Introduce yourself as storybot, an AI assistant helping Andy build the childrens story
      - Tell the user about the project, who its for, what its about, and how they can help
      - Tell the user that whenever they feel like they've shared enough stories and images, they can click submit to finish
      `,
      id: 'system-2'
    }
  ];
  return prompt;
}