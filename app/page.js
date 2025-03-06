export const metadata = {
  title: "EchoChat - AI Assistant",
  description: "A custom chat interface powered by EchoGPT",
}

import ChatInterface from "@/components/chat-interface"

export default function Home() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <ChatInterface />
    </div>
  )
}

