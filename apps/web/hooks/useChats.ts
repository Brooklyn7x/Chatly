import { createChat, getAllChats } from "@/services/chatService";
import { useChatStore } from "@/store/useChatStore";
import { useState } from "react";
import useSWR from "swr";

// export const useChats = () => {
//   const { addChats, deleteChat, setActiveChat } = useChatStore();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const createChat = async (participantIds: any[], title?: string) => {
//     try {
//       setIsLoading(true);
//       const payload = {
//         type: participantIds.length > 1 ? "group" : "direct",
//         participantIds: participantIds,
//         metadata: {
//           title: participantIds.length > 1 ? title : null,
//           description:
//             participantIds.length > 1
//               ? "Group conversation"
//               : "Private conversation",
//           avatar: null,
//           isArchived: false,
//           isPinned: false,
//         },
//       };
//       const { data } = await chatApi.createChat(payload);
//       addChats(data);
//     } catch (error) {
//       setError(
//         error instanceof Error ? error.message : "Failed to create chat"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteCht = async (chatId: string) => {
//     try {
//       await chatApi.deleteChat(chatId);
//       deleteChat(chatId);
//       setActiveChat(null);
//     } catch (error) {
//       throw new Error("Failed to delete chat. Please try again.");
//     }
//   };

//   const updateChatInfo = async (
//     chatId: string,
//     updateData: ChatUpdatePayload
//   ) => {
//     try {
//       setIsLoading(true);
//       const { data } = await chatApi.updateChat(chatId, updateData);
//       // console.log(data)
//       // updateChat(chatId, data);
//     } catch (error) {
//       const message = error instanceof Error ? error.message : "Update failed";
//       toast.error(message);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     createChat,
//     deleteCht,
//     updateChatInfo,
//     isLoading,
//     error,
//   };
// };

export const useFetchChats = () => {
  const { setChats } = useChatStore();
  const { isLoading, error } = useSWR("chats", getAllChats, {
    onSuccess: (response) => {
      setChats(response.data);
    },
    refreshInterval: 10000,
    revalidateIfStale: true,
  });

  return {
    isLoading,
    error,
  };
};

export const useCreateChat = () => {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChatRoom = async (
    type: string,
    participants: any,
    name?: string,
    description?: string
  ) => {
    try {
      setIsMutating(true);
      const response = await createChat({
        type,
        name,
        description,
        participants,
      });
      return response.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Create chat failed";
      setError(message);
      throw error;
    } finally {
      setIsMutating(false);
    }
  };
  return {
    createChatRoom,
    isMutating,
    error,
  };
};

export const useDeleteChat = () => {};
export const useUpdateChat = () => {};
