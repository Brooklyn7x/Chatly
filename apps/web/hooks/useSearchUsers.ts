import axios from "axios";
import { useState } from "react";

export const useSearchUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState<any>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const searchUsers = async (query?: string, limit = 10, offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:8000/users/search", {
        params: {
          query,
          limit,
          offset,
        },
      });
      if (response.data.success && response.data.data) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Failed to fetch users");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while searching users";
      setError(errorMessage);
      setUsers([]);
      return { users: [], pagination: { total: 0, limit, offset } };
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setUsers([]);
    setPagination({ page: 1, limit: 10, total: 0 });
  };
  return { isLoading, users, error, pagination, searchUsers, clearSearch };
};
