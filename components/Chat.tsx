"use client";

import { useState, useCallback } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    api: '/api/chat',
  })

  // Log messages and errors
  console.log("Messages:", messages)
  if (error) {
    console.error("Error fetching messages:", error)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Chat with StoryBot</h2>
          <div className="flex flex-col h-[500px]">
            <ScrollArea className="flex-1 p-4 border border-neutral-200 rounded-md mb-4 dark:border-neutral-800">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`mb-4 ${
                    message.role === "user" ? "text-blue-600" : "text-green-600"
                  }`}
                >
                  <strong>{message.role === "user" ? "You: " : "StoryBot: "}</strong>
                  {message.content}
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

