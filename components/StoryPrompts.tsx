import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Star, Coffee, LineChart, ChevronRight, LightbulbIcon, ImageIcon } from 'lucide-react'
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

interface StoryPromptsProps {
  onQuestionSelect: (question: string) => void;
}

const StoryPrompts: React.FC<StoryPromptsProps> = ({ onQuestionSelect }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('friendship');

  return (
    <div className="w-80 border-l bg-gray-50 transition-all duration-300 ease-in-out">
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
                onClick={() => onQuestionSelect(question)}
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
  );
};

export default StoryPrompts; 