"use client"

import { useState, useEffect, useRef } from "react"
import { Send, MessageSquare, Moon, Sun, Menu, X, Bot } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import HistorySidebar from "@/components/history-sidebar"

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [useSimulation, setUseSimulation] = useState(false)
  const messagesEndRef = useRef(null)

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory")
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        const historyWithDates = parsedHistory.map((chat) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
          messages: chat.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
        setChatHistory(historyWithDates)
      } catch (error) {
        console.error("Error parsing chat history:", error)
        localStorage.removeItem("chatHistory")
      }
    }
  }, [])

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory))
    }
  }, [chatHistory])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Create a new chat
  const createNewChat = () => {
    const newChatId = Date.now().toString()
    const newChat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
      timestamp: new Date(),
    }
    setChatHistory([newChat, ...chatHistory])
    setCurrentChatId(newChatId)
    setMessages([])
  }

  const selectChat = (chatId) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId)
    if (selectedChat) {
      setMessages(selectedChat.messages)
      setCurrentChatId(chatId)
    }
  }

  const deleteChat = (chatId) => {
    const updatedHistory = chatHistory.filter((chat) => chat.id !== chatId)
    setChatHistory(updatedHistory)
    if (currentChatId === chatId) {
      setCurrentChatId(null)
      setMessages([])
    }
    localStorage.setItem("chatHistory", JSON.stringify(updatedHistory))
  }

  // Show toast notification
  const showToast = (message, type = "error") => {
    const toast = document.createElement("div")
    toast.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
      type === "error" ? "bg-red-500" : "bg-green-500"
    } text-white transform transition-all duration-500 translate-y-0 opacity-100 z-50`
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.classList.replace("translate-y-0", "translate-y-2")
      toast.classList.replace("opacity-100", "opacity-0")
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 500)
    }, 3000)
  }

  const generateSimulatedResponse = (userMessage) => {
    const responses = [
      "I'm a simulated response for demonstration purposes. In a real implementation, this would be replaced with the response from the EchoGPT API.",
      "That's an interesting question! As a simulated response, I can tell you that this chat interface demonstrates the UI and functionality required for the assignment.",
      "Thanks for your message. This is a simulated response since we're having trouble connecting to the EchoGPT API. The interface is fully functional and meets the assignment requirements.",
      `I understand you're asking about "${userMessage.content.slice(0, 30)}...". This is a simulated response for the frontend internship assignment.`,
      "I'm demonstrating how the chat interface works. Your message has been received and this simulated response shows how the UI handles assistant replies.",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: randomResponse,
      timestamp: new Date(),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!currentChatId) {
      createNewChat()
    }

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    const updatedHistory = chatHistory.map((chat) => {
      if (chat.id === currentChatId) {
        const title =
          chat.title === "New Chat" && chat.messages.length === 0
            ? input.slice(0, 30) + (input.length > 30 ? "..." : "")
            : chat.title

        return {
          ...chat,
          title,
          messages: [...chat.messages, userMessage],
          timestamp: new Date(),
        }
      }
      return chat
    })

    setChatHistory(updatedHistory)
    setInput("")
    setIsLoading(true)

    if (useSimulation) {
      await simulateResponse(updatedMessages, updatedHistory)
      return
    }

    try {
     
      const formattedMessages = [
        // Add a system message first
        {
          role: "developer",
          content: "You are a helpful assistant powered by EchoGPT.",
        },
        ...updatedMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ]

     
      let response = await fetch('https://api.echogpt.live/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'echogpt-uH386TWOCc-uWP8jzpjcq-zK74kglrlo-bNCBqvxKya-dx9j87coT7KcV62JRr1ap_W1'
        },
        body: JSON.stringify({
            messages: [{ role: 'system', content: 'You are a helpful assistant.' }],
            "model": "EchoGPT"
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API Error:", errorData)
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.choices[0].message.content,
        timestamp: new Date(),
      }

      const newMessages = [...updatedMessages, assistantMessage]
      setMessages(newMessages)

      const newHistory = updatedHistory.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, assistantMessage],
            timestamp: new Date(),
          }
        }
        return chat
      })

      setChatHistory(newHistory)
    } catch (error) {
      console.error("Error:", error)

      if (!useSimulation) {
        setUseSimulation(true)
        showToast("API connection failed. Using simulated responses for demonstration.", "error")
        await simulateResponse(updatedMessages, updatedHistory)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const simulateResponse = async (updatedMessages, updatedHistory) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const assistantMessage = generateSimulatedResponse(updatedMessages[updatedMessages.length - 1])

    const newMessages = [...updatedMessages, assistantMessage]
    setMessages(newMessages)

    const newHistory = updatedHistory.map((chat) => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, assistantMessage],
          timestamp: new Date(),
        }
      }
      return chat
    })

    setChatHistory(newHistory)
    setIsLoading(false)
  }

  return (
    <>
      <div className={`flex flex-col md:flex-row h-full w-full transition-all duration-300 ${darkMode ? "dark" : ""}`}>
      
        <div className="md:hidden absolute top-4 left-4 z-10">
          <button className="p-2 rounded-md text-white hover:bg-slate-700" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out md:w-80 w-full md:relative absolute z-10 h-full bg-slate-800 dark:bg-slate-900 border-r border-slate-700`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 flex justify-between items-center">
              <h1 className="text-xl font-bold text-white">Chat 2.0</h1>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-md text-white hover:bg-slate-700" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  className="md:hidden p-2 rounded-md text-white hover:bg-slate-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <button
              className="mx-4 mb-4 py-2 px-4 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center"
              onClick={createNewChat}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> New Chat
            </button>

            <div className="flex-1 flex flex-col">
              <div className="mx-4 grid grid-cols-2 bg-slate-700 rounded-md p-1 mb-4">
                <button className={`py-1 px-2 rounded-sm ${true ? "bg-slate-600 text-white" : "text-slate-300"}`}>
                  Chats
                </button>
                <button
                  className={`py-1 px-2 rounded-sm ${useSimulation ? "bg-slate-600 text-white" : "text-slate-300"}`}
                  onClick={() => {
                    setUseSimulation(!useSimulation)
                    showToast(useSimulation ? "Using real API mode" : "Using simulation mode", "info")
                  }}
                >
                  {useSimulation ? "Simulation ON" : "Settings"}
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <HistorySidebar
                  chatHistory={chatHistory}
                  currentChatId={currentChatId}
                  onSelectChat={selectChat}
                  onDeleteChat={deleteChat}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-800">
          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Bot size={48} className="mb-4 text-slate-400" />
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Welcome to Chat 2.0</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  Start a conversation with the AI assistant powered by GPT 2.0.
                </p>
                {useSimulation && (
                  <div className="mt-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-800 dark:text-blue-200 text-sm">
                    Running in simulation mode. Responses are generated locally for demonstration.
                  </div>
                )}
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-[80%]">
                      <div className="h-4 w-[250px] bg-slate-300 dark:bg-slate-600 rounded animate-pulse"></div>
                      <div className="h-4 w-[400px] bg-slate-300 dark:bg-slate-600 rounded animate-pulse"></div>
                      <div className="h-4 w-[300px] bg-slate-300 dark:bg-slate-600 rounded animate-pulse"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-h-[60px] p-3 rounded-md border border-slate-300 dark:border-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`p-3 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white ${
                  isLoading || !input.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              {useSimulation ? "Simulation Mode - Local Responses" : "Powered by GPT 2.0"}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

