import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

const MainLayout = () => {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(chats[0]);
  const { apiUrl, userId } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/${userId}/chats`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const chats = await response.json();
        if (response.ok) {
          console.log(chats);
          setChats(chats);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="flex bg-white dark:bg-gray-700">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
      />
      <Outlet context={[activeChatId, setActiveChatId]} />
    </div>
  );
};

export default MainLayout;
