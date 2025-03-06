export const metadata = {
  title: "Chat2.0 - AI Assistant",
  description: "A custom chat interface powered by jafor",
}

import ChatInterface from "@/components/chat-interface"

export default function Home() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <ChatInterface />
    </div>
  )
}

