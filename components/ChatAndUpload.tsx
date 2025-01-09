"use client";

import { useState, useCallback } from "react"
import { useChat } from "ai/react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

export default function ChatAndUpload() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "'/api/chat'",
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUpload = async () => {
    // Implement the upload logic here
    console.log("'Uploading files:'", uploadedFiles)
    // Reset the uploaded files after upload
    setUploadedFiles([])
  }

  const handleDeleteFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
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

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Upload Images</h2>
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                isDragActive ? "'border-blue-500 bg-blue-50'" : "'border-gray-300'"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              {isDragActive ? (
                <p className="mt-2">Drop the files here ...</p>
              ) : (
                <p className="mt-2">Drag &apos;n&apos; drop some files here, or click to select files</p>
              )}
            </div>
            {uploadedFiles.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Uploaded Files:</h3>
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button onClick={handleUpload} className="mt-4">
                  Upload Files
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

