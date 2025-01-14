"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useChat } from 'ai/react';
import { Heart, Star, Coffee, LineChart, ChevronRight, LightbulbIcon, ImageIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

type Theme = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: string[];
};

const themes: Theme[] = [
  {
    id: 'friendship',
    name: 'Friendship Moments',
    icon: Heart,
    questions: [
      "What's something they do that always makes people smile?",
      "Tell me about a time they showed incredible kindness",
      "What's a quirky habit or trait that makes them uniquely them?",
      "Share a story that shows their sense of humor"
    ]
  },
  {
    id: 'character',
    name: 'Character & Personality',
    icon: Star,
    questions: [
      "What values or principles do they live by?",
      "How do they handle challenging situations?",
      "What makes them a great friend/family member?",
      "Share a moment that shows their true character"
    ]
  },
  {
    id: 'passions',
    name: 'Passions & Interests',
    icon: Coffee,
    questions: [
      "What activities make them lose track of time?",
      "What topics can they talk about endlessly?",
      "How do they inspire others with their interests?",
      "Share a story about their favorite hobby or passion"
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    icon: LineChart,
    questions: [
      "How have they grown or changed over time?",
      "What challenges have they overcome?",
      "What are their hopes and dreams?",
      "Share a story about a time they learned something new"
    ]
  }
];

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [showPrompts, setShowPrompts] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>('friendship');

  const handleQuestionSelect = (question: string) => {
    const form = new FormData();
    form.append('message', question);
    handleSubmit(new Event('submit', { cancelable: true }) as any, form);
    setShowPrompts(false);
  };

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
      <div className={cn(
        "w-80 border-l bg-gray-50 transition-all duration-300 ease-in-out",
        showPrompts ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 border-b">
          <h3 className="font-semibold text-purple-700">Story Prompts</h3>
          <p className="text-sm text-gray-600">Choose a theme to explore</p>
        </div>

        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {/* Theme Selection */}
            <div className="flex flex-col gap-2">
              {themes.map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                      selectedTheme === theme.id
                        ? "bg-purple-100 text-purple-700"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{theme.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Questions for Selected Theme */}
            <div className="space-y-2">
              {themes.find(t => t.id === selectedTheme)?.questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionSelect(question)}
                  className="group w-full text-left p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span>{question}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-purple-600 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
