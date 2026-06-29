const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return {
    'Content-Type': 'application/json',
    ...(user?.token && { Authorization: `Bearer ${user.token}` }),
  }
}

const handleResponse = async (response) => {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }
  return data
}

export const authAPI = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    return handleResponse(response)
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse(response)
  },
}

export const chatAPI = {
  sendMessage: async (message, conversationId = null) => {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, conversationId }),
    })
    return handleResponse(response)
  },

  getConversations: async () => {
    const response = await fetch(`${API_URL}/conversations`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  getConversation: async (id) => {
    const response = await fetch(`${API_URL}/conversations/${id}`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  createConversation: async () => {
    const response = await fetch(`${API_URL}/conversations`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  deleteConversation: async (id) => {
    const response = await fetch(`${API_URL}/conversations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },
}
