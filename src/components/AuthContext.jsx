import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Loading from './Loading';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? true : false;
  });
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('tokenExpirationTime');
    if (token && expirationTime) {
      if (Date.now() > expirationTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpirationTime');
        setIsAuthenticated(false);
        setCurrentUser(null);
      } else {
        try {
          const userToken = jwtDecode(token);
          const user = userToken.user;
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Invalid token:', error);
        }
      }
    }
    setLoading(false);
  }, []);

  const authTimer = 1000 * 60 * 60 * 4;

  const signin = () => {
    localStorage.removeItem('activeId');
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userToken = jwtDecode(token);
        const user = userToken.user;
        setCurrentUser(user);
        setIsAuthenticated(true);

        const expirationTime = Date.now() + authTimer;
        localStorage.setItem('tokenExpirationTime', expirationTime);
      } catch (error) {
        console.error('Invalid token during signin:', error);
      }
    }
  };

  const signout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('activeId');
    localStorage.removeItem('token');
    navigate('/signin');
    queryClient.clear();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signin,
        signout,
        apiUrl,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
