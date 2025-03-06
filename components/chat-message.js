import { Bot, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function ChatMessage({ message }) {
  const isStreaming = message.isStreaming === true

  return (
    <div className={`flex items-start gap-3 mb-4 ${message.role === "user" ? "justify-end" : ""}`}>
      {message.role === "assistant" && (
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={`p-3 rounded-lg max-w-[80%] ${
          message.role === "user"
            ? "bg-blue-600 text-white ml-auto"
            : "bg-white dark:bg-slate-700 dark:text-white shadow-sm"
        }`}
      >
        <div className="whitespace-pre-wrap">
          {message.content}
          {isStreaming && (
            <span className="inline-block ml-1 animate-pulse">
              <span className="inline-block w-1 h-1 bg-current rounded-full mx-0.5"></span>
              <span className="inline-block w-1 h-1 bg-current rounded-full mx-0.5 animation-delay-200"></span>
              <span className="inline-block w-1 h-1 bg-current rounded-full mx-0.5 animation-delay-400"></span>
            </span>
          )}
        </div>
        <div
          className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}
        >
          {isStreaming ? "Typing..." : formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>

      {message.role === "user" && (
        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  )
}

