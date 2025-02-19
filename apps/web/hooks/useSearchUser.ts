import { UserApi } from "@/services/api/users";
import { User } from "@/types";
import { useEffect, useState } from "react";

export const useSearchUser = (query: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await UserApi.searchUsers(query);
        setUsers(response.data.results);
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
