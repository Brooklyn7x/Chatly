import useSWR from "swr";
import { MessageApi } from "@/services/api/message";
import { useMessageStore } from "@/store/useMessageStore";

export const getMessages = (id: string) => {
  const { setMessages } = useMessageStore();
  const { data, isLoading, error } = useSWR(
    `/messages/${id}`,
    () => MessageApi.getMessages(id),
    {
      onSuccess: (response) => {
        setMessages(id, response?.data);
      },
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );
  return { messages: data?.data || [], isLoading, error };
};
