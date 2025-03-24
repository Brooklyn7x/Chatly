import { Server, Socket } from "socket.io";

export const messageSocket = (io: Server, socket: Socket) => {
  socket.on(
    "message:send",
    (data: { conversationId: string; content: string }) => {
      const { content, conversationId } = data;
      console.log(content, conversationId);
      socket
        .to(`chat:${data.conversationId}`)
        .emit("message:new", data.content);
    }
  );

  //   socket.on("message:send", async (data) => {
  //     try {
  //       const result = await MessageService.sendMessage(
  //         socket.data.userId,
  //         data
  //       );
  //       if (result.success) {
  //         socket.emit("message:sent", {
  //           tempId: data.tempId,
  //           messageId: result.data._id,
  //           status: MessageStatus.SENT,
  //           timestamp: new Date(),
  //         });

  //         const recipientSocketId = onlineUsers.get(data.recipientId);

  //         const messageStatus = recipientSocketId
  //           ? MessageStatus.DELIVERED
  //           : MessageStatus.SENT;
  //         const messageData = {
  //           ...result.data,
  //           messageId: result.data._id,
  //           status: messageStatus,
  //           timestamp: new Date(),
  //         };
  //         socket
  //           .to(`chat:${data.conversationId}`)
  //           .emit("message:new", messageData);
  //         if (recipientSocketId) {
  //           await messageService.updateMessageStatus(
  //             result.data._id,
  //             MessageStatus.DELIVERED
  //           );
  //           socket.emit("message:delivered", {
  //             messageId: result.data._id,
  //             timestamp: new Date(),
  //           });
  //         }
  //       }
  //     } catch (error) {
  //       handleError(socket, "message:error", error);
  //     }
  //   });
  //   socket.on(
  //     "message:read",
  //     async (data: { messageIds: string[]; conversationId: string }) => {
  //       try {
  //         const { userId } = socket.data;
  //         await Promise.all(
  //           data.messageIds.map((messageId) =>
  //             messageService.markMessageAsRead(messageId, userId)
  //           )
  //         );
  //         socket.to(`chat:${data.conversationId}`).emit("message:read:ack", {
  //           messageIds: data.messageIds,
  //           conversationId: data.conversationId,
  //           readBy: userId,
  //           timestamp: new Date(),
  //         });
  //       } catch (error) {
  //         handleError(socket, "message:error", error);
  //       }
  //     }
  //   );
  //   socket.on(
  //     "message:edit",
  //     async (data: { messageId: string; content: string }) => {
  //       try {
  //         const { userId } = socket.data;
  //         const { messageId, content } = data;
  //         const updateMessage = await messageService.editMessage(
  //           messageId,
  //           userId,
  //           content
  //         );
  //         if (updateMessage.success) {
  //           socket
  //             .to(`chat:${updateMessage.data.conversationId}`)
  //             .emit("message:edited", {
  //               ...updateMessage,
  //               editedBy: userId,
  //               editedAt: new Date(),
  //             });
  //         }
  //       } catch (error) {
  //         handleError(socket, "message:error", error);
  //       }
  //     }
  //   );
  //   socket.on("message:delete", async (data: { messageId: string }) => {
  //     try {
  //       const { userId } = socket.data;
  //       const { messageId } = data;
  //       const deleteMessage = await messageService.deleteMessage(
  //         messageId,
  //         userId
  //       );
  //       if (deleteMessage.success) {
  //         socket
  //           .to(`chat:${deleteMessage.data?.conversationId}`)
  //           .emit("message:deleted", {
  //             ...deleteMessage.data,
  //             messageId: messageId,
  //             deletedAt: new Date(),
  //           });
  //       }
  //     } catch (error) {
  //       handleError(socket, "message:error", error);
  //     }
  //   });
  //   socket.on(
  //     "message:edit",
  //     async (data: { messageId: string; content: string }) => {
  //       try {
  //         const result = await messageService.editMessage(
  //           data.messageId,
  //           userId,
  //           data.content
  //         );
  //         if (result.success) {
  //           io.to(`conversation:${result.data.conversationId}`).emit(
  //             "message:edited",
  //             {
  //               ...result.data,
  //               editedBy: userId,
  //               editedAt: new Date(),
  //             }
  //           );
  //         } else {
  //           socket.emit("message:error", { error: result.error });
  //         }
  //       } catch (error) {
  //         handleError(socket, "message:error", error);
  //       }
  //     }
  //   );
  //   socket.on("message:delete", async (data: { messageId: string }) => {
  //     try {
  //       const result = await messageService.deleteMessage(
  //         data.messageId,
  //         userId
  //       );
  //       if (result.success) {
  //         io.to(`conversation:${result.data?.conversationId}`).emit(
  //           "message:deleted",
  //           {
  //             messageId: data.messageId,
  //             deletedAt: new Date(),
  //           }
  //         );
  //       }
  //     } catch (error) {
  //       handleError(socket, "message:error", error);
  //     }
  //   });
};
