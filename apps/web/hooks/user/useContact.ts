import { addContact, getContacts, searchUsers } from "@/services/userService";
import { useState } from "react";
import useSWR from "swr";
import { useDebounce } from "../useDebounce";

export const useFetchContacts = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/contacts",
    getContacts
  );
  return {
    contacts: data?.data.data || [],
    isLoading,
    error,
    refreshContacts: mutate,
  };
};

export function useSearchUser(query: string) {
  const debounceQuery = useDebounce(query, 300);
  const { data, isLoading, error } = useSWR(
    `/search${debounceQuery}`,
    () => searchUsers(debounceQuery),
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
    }
  );
  return {
    users: data?.data?.data || [],
    isLoading,
    error,
  };
}

export const useAddNewContact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshContacts } = useFetchContacts();
  const addNewContact = async (userId: string) => {
    setIsLoading(true);
    try {
      await addContact(userId);
      refreshContacts();
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to add contact";
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return { addNewContact, isLoading, error };
};
