import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import ChatInput from '../components/ChatInput'
import { chatAPI } from '../services/api'

export default function Dashboard() {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversationsLoading, setConversationsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setConversationsLoading(true)
      const data = await chatAPI.getConversations()
      setConversations(data)
    } catch (err) {
      console.error('Failed to load conversations:', err.message)
    } finally {
      setConversationsLoading(false)
    }
  }

  const loadConversation = async (id) => {
    try {
      const data = await chatAPI.getConversation(id)
      setActiveConversationId(data.id)
      setMessages(data.messages || [])
      setSidebarOpen(false)
    } catch (err) {
      console.error('Failed to load conversation:', err.message)
    }
  }

  const handleNewChat = async () => {
    setActiveConversationId(null)
    setMessages([])
    setSidebarOpen(false)
  }

  const handleDeleteConversation = async (id) => {
    try {
      await chatAPI.deleteConversation(id)
      setConversations((prev) => prev.filter((c) => c.id !== id))
      if (activeConversationId === id) {
        setActiveConversationId(null)
        setMessages([])
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err.message)
    }
  }

  const handleSendMessage = async (message) => {
    const userMessage = { role: 'user', content: message }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const data = await chatAPI.sendMessage(message, activeConversationId)

      if (!activeConversationId) {
        setActiveConversationId(data.conversationId)
        setConversations((prev) => [
          {
            id: data.conversationId,
            title: data.title,
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ])
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === data.conversationId
              ? { ...c, title: data.title, updatedAt: new Date().toISOString() }
              : c
          )
        )
      }

      setMessages(data.messages)
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1))
      console.error('Failed to send message:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        loading={conversationsLoading}
      />

      <div className="main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <ChatWindow messages={messages} loading={loading} />

        <ChatInput onSend={handleSendMessage} disabled={loading} />
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
