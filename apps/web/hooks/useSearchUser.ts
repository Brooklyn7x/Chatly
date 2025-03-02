import useSWR from "swr";
import { userApi } from "@/services/api/users";
import { useDebounce } from "./useDebounce";

export function useSearchUsers(query: string) {
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading, error } = useSWR(`/search${debouncedQuery}`, () =>
    userApi.searchUsers(debouncedQuery)
  );
  return {
    users: data?.data?.results || [],
    isLoading,
    error,
  };
}
