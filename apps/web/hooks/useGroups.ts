import { useChatStore } from "@/store/useChatStore";

export const useGroups = () => {
  const { addChats, isLoading, error } = useChatStore();

  const createGroup = async (data: {
    participants: string[];
    title: string;
  }) => {
    try {
      // const newGroup = await
    } catch (error) {}
  };
};
