import { useEffect } from 'react';
import useAxios from './useAxios';
import useAuth from './useAuth';

const useUserActivity = () => {
  const { user } = useAuth();
  const axios = useAxios();

  useEffect(() => {
    if (!user?.email) return;

    // প্রতি 30 সেকেন্ডে active রাখো
    const interval = setInterval(() => {
      axios.post('/api/users/activity', { email: user?.email, isActive: true });
    }, 30000);

    // ব্রাউজার বন্ধ হলে offline করো
    const handleUnload = () => {
      navigator.sendBeacon(
        '/api/users/activity',
        JSON.stringify({ email: user.email, isActive: false })
      );
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [user?.email]);
};

export default useUserActivity;
