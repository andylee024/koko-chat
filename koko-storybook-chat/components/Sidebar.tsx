import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

// This would typically come from a database or API
const sampleContributions = [
  { type: "anecdote", content: "When I was little, used to think the moon followed our car wherever we went.", author: "Emily", date: "2023-06-01" },
  { type: "story", content: "Once upon a time, in land far away, there was magical forest where the trees whispered secrets to those who listened carefully.", author: "Michael", date: "2023-05-28" },
  { type: "image", src: "/placeholder.svg", alt: "Family picnic", author: "Sarah", date: "2023-05-25" },
]

export default function Sidebar() {
  return (
    <aside className="w-96 bg-white shadow-lg overflow-hidden flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Previous Contributions</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {sampleContributions.map((contribution, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4 mb-2">
                  <Avatar>
                    <AvatarFallback>{contribution.author[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{contribution.author}</p>
                    <p className="text-sm text-gray-500">{contribution.date}</p>
                  </div>
                </div>
                {contribution.type === "anecdote" && (
                  <p className="text-gray-700">{contribution.content}</p>
                )}
                {contribution.type === "story" && contribution.content && (
                  <p className="text-gray-700">{contribution.content.substring(0, 100)}...</p>
                )}
                {contribution.type === "image" && contribution.src && (
                  <div className="relative w-full h-48 mt-2">
                    <Image
                      src={contribution.src}
                      alt={contribution.alt || ""}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}

