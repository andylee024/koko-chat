import ChatAndUpload from "../components/ChatAndUpload"
import Sidebar from "../components/Sidebar"

export default function StoryGatheringPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Story Gathering for Baby Niece</h1>
        <ChatAndUpload />
      </main>
      <Sidebar />
    </div>
  )
}

