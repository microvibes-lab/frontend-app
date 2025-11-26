import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState('');

  const API_GATEWAY = 'http://localhost:8080';

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken) setToken(storedToken);
    if (storedUser) setUsername(storedUser);
  }, []);

  const login = async () => {
    try {
      setError('');
      const res = await axios.post(`${API_GATEWAY}/auth/login`, {
        username,
        password
      });
      setToken(res.data.token);
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('auth_user', username);
    } catch (err) {
      setError('Login failed');
    }
  };

  const logout = () => {
    setToken('');
    setUsername('');
    setDocs([]);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const fetchDocs = async () => {
    try {
      const res = await axios.get(`${API_GATEWAY}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetch response:', res.data);
      if (Array.isArray(res.data)) {
        setDocs(res.data);
      } else {
        setError('Unexpected response format');
        console.error('Expected array, got:', res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch docs');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Corporate Document System</h1>
      
      {!token ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', maxWidth: '300px' }}>
          <h2>Login</h2>
          <input 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            style={{ display: 'block', margin: '10px 0', width: '100%' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            style={{ display: 'block', margin: '10px 0', width: '100%' }}
          />
          <button onClick={login} style={{ width: '100%', padding: '5px' }}>Login</button>
        </div>
      ) : (
        <div>
          <p>Logged in as: <strong>{username}</strong></p>
          <button onClick={fetchDocs}>Fetch Documents</button>
          <button onClick={logout} style={{ marginLeft: '10px' }}>Logout</button>
          
          <ul style={{ marginTop: '20px' }}>
            {docs.map(d => (
              <li key={d.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <h3>{d.title} <span style={{ fontSize: '12px', color: '#666' }}>({d.access})</span></h3>
                <p>{d.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
