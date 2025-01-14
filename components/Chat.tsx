"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useChat } from 'ai/react';
import { LightbulbIcon, ImageIcon } from 'lucide-react';
import StoryPrompts from './StoryPrompts';
import { cn } from "@/lib/utils";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setMessages, reload } = useChat();
  const [showPrompts, setShowPrompts] = useState(true);

  const handleQuestionSelect = async (question: string) => {
    // Construct the system message
    const userMessage = `I'd like to explore the question: "${question}"`;

    // Update the messages array with the new system message
    setMessages([...messages, {
      role: 'user',
      content: userMessage,
      id: 'user-message',
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
          <h2 className="text-xl font-semibold text-purple-700">Share Your Stories</h2>
          <p className="text-sm text-purple-600">
            Chat and share your memories, or get inspired by the story prompts
          </p>
        </div>

        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>Welcome! Choose a theme to get started, or just start chatting.</p>
            </div>
          )}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-pink-100'
                  }`}
                >
                  {message.content}
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
                onClick={() => setShowPrompts(!showPrompts)}
                className="flex items-center gap-2"
              >
                <LightbulbIcon className="w-4 h-4" />
                Need Ideas?
              </Button>
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
