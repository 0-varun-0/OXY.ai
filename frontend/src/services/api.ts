const API_BASE_URL = 'http://localhost:8000/api/v1';

const getAuthToken = () => localStorage.getItem('token');

const api = {
  async login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Login failed');
    return data;
  },

  async register(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Registration failed');
    return data;
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Upload failed');
    return data;
  },

  async postVqa(image_filename: string, question: string, conversation_id: number | null) {
    const response = await fetch(`${API_BASE_URL}/vqa`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ image_filename, question, conversation_id }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'VQA request failed');
    return data;
  },

  async getConversationHistory(conversationId: number) {
    const response = await fetch(`${API_BASE_URL}/history/conversations/${conversationId}`, {
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch history');
    return data;
  }
};

export default api;
