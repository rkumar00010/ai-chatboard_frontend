export default function MessageBubble({ role, content }) {
  const isUser = role === 'user'

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && <div className="bubble-avatar">AI</div>}
      <div className="bubble-content">
        <p>{content}</p>
      </div>
      {isUser && <div className="bubble-avatar user-avatar">You</div>}
    </div>
  )
}
