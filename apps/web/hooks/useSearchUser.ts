import useSWR from "swr";
import { userApi } from "@/services/api/users";

export function useSearchUsers(query: string) {
  const { data, isLoading, error } = useSWR(
    `/search${query}`,
    () => userApi.searchUsers(query),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    users: data?.data?.results || [],
    isLoading,
    error,
  };
}
