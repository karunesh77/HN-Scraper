import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchBookmarks();
    }
    setLoading(false);
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data } = await api.get('/stories/bookmarks');
      setBookmarks(data.map((s) => s._id));
    } catch {
      setBookmarks([]);
    }
  };

  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    setBookmarks([]);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    await fetchBookmarks();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setBookmarks([]);
  };

  const toggleBookmark = async (storyId) => {
    if (!user) return;
    try {
      const { data } = await api.post(`/stories/${storyId}/bookmark`);
      setBookmarks((prev) =>
        data.bookmarked ? [...prev, storyId] : prev.filter((id) => id !== storyId)
      );
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, bookmarks, loading, register, login, logout, toggleBookmark }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
