import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="chat-window">
      {messages.length === 0 && !loading ? (
        <div className="chat-empty">
          <div className="chat-empty-icon">✦</div>
          <h2>How can I help you today?</h2>
          <p>Ask me anything — I'm here to help.</p>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((msg, index) => (
            <MessageBubble key={index} role={msg.role} content={msg.content} />
          ))}
          {loading && (
            <div className="message-bubble assistant">
              <div className="bubble-avatar">AI</div>
              <div className="bubble-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
