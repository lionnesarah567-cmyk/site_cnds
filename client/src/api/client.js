const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Public News API
  async getNews(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/news${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  },

  async getNewsBySlug(slug) {
    const res = await fetch(`${API_BASE_URL}/news/${slug}`);
    if (!res.ok) throw new Error('Failed to fetch news item');
    return res.json();
  },

  // Board Members
  async getBoardMembers() {
    const res = await fetch(`${API_BASE_URL}/board-members`);
    if (!res.ok) throw new Error('Failed to fetch board members');
    return res.json();
  },

  // Legal Texts
  async getLegalTexts() {
    const res = await fetch(`${API_BASE_URL}/legal-texts`);
    if (!res.ok) throw new Error('Failed to fetch legal texts');
    return res.json();
  },

  // Multimedia & Reports
  async getMultimedia(type) {
    const query = type ? `?type=${type}` : '';
    const res = await fetch(`${API_BASE_URL}/multimedia${query}`);
    if (!res.ok) throw new Error('Failed to fetch multimedia');
    return res.json();
  },

  // Gallery
  async getGallery() {
    const res = await fetch(`${API_BASE_URL}/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  // Partners
  async getPartners() {
    const res = await fetch(`${API_BASE_URL}/partners`);
    if (!res.ok) throw new Error('Failed to fetch partners');
    return res.json();
  },

  // Contact with honeypot
  async sendContact(formData) {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error submitting contact form');
    return data;
  },

  // Newsletter subscription
  async subscribeNewsletter(email, lang = 'fr') {
    const res = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, lang }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Newsletter subscription failed');
    return data;
  },

  // Auth
  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Admin News operations
  async createNews(newsData, token) {
    const res = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newsData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create news');
    return data;
  },

  async updateNews(id, newsData, token) {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newsData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update news');
    return data;
  },

  async deleteNews(id, token) {
    const res = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete news');
    return data;
  },
};
