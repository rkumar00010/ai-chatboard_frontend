import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="header-title">AI Chat</h1>
      </div>

      <div className="profile-menu">
        <button
          className="profile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Profile menu"
        >
          <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <span className="profile-name">{user?.name}</span>
        </button>

        {menuOpen && (
          <>
            <div className="profile-dropdown">
              <div className="profile-info">
                <p className="profile-info-name">{user?.name}</p>
                <p className="profile-info-email">{user?.email}</p>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Sign out
              </button>
            </div>
            <div className="dropdown-overlay" onClick={() => setMenuOpen(false)} />
          </>
        )}
      </div>
    </header>
  )
}
