import { useQuery } from '@tanstack/react-query';
import useAxiosecure from './useAxiosecure';
import useAuth from './useAuth';

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosecure();

  const { data: role = null, isLoading: roleLoading, refetch } = useQuery({
    enabled: !loading && !!user?.email, // only run when user is loaded
    queryKey: ['user-role', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role/${user.email}`);
      return res.data?.role;
    }
  });

  return { role, roleLoading, refetch };
};

export default useRole;
