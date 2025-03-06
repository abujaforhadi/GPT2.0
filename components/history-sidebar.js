import { Trash2, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function HistorySidebar({ chatHistory, currentChatId, onSelectChat, onDeleteChat }) {
  if (chatHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <MessageSquare className="h-12 w-12 text-slate-400 mb-4" />
        <p className="text-slate-400">No chat history yet</p>
        <p className="text-slate-500 text-sm mt-2">Start a new chat to see your history here</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-180px)] overflow-y-auto">
      <div className="p-4 space-y-2">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className={`group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-slate-700 ${
              currentChatId === chat.id ? "bg-slate-700" : ""
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="flex-1 min-w-0">
              <p className="text-white truncate">{chat.title}</p>
              <p className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
                {" • "}
                {chat.messages.length} message{chat.messages.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-600"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteChat(chat.id)
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

