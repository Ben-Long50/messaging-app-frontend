import handleResponse from '../handleResponse';

const getGlobalChat = async (apiUrl) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiUrl}/chats/global`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(response);
    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
  }
};

export default getGlobalChat;