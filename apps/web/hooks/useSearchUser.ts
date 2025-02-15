import { UserApi } from "@/services/api/users";
import { useEffect, useState } from "react";

export const useSearchUser = (query: string) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await UserApi.searchUsers(query);
        setUsers(data.data.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [query]);

  return {
    users,
    loading,
    error,
  };
};
