import { socketService } from "@/services/socket/socketService";
import { useEffect } from "react";

export function useGroupSocket(groupId: string) {
  useEffect(() => {
    if (!groupId) return;
    socketService.joinGroup({ groupId });
    return () => {
      socketService.leaveGroup(groupId);
    };
  }, []);

  useEffect(() => {
    const handleAddMember = () => {};
    const handleRemoveMember = () => {};
    const handleUpdate = () => {};
    const handleInviteSent = () => {};
    const handleInviteReceived = () => {};
    const handleGroupError = () => {};

    socketService.on("group:member_added", handleAddMember);
    socketService.on("group:member_removed", handleRemoveMember);
    socketService.on("group:updated", handleUpdate);
    socketService.on("group:invite_sent", handleInviteSent);
    socketService.on("group:invite_received", handleInviteReceived);
    socketService.on("group:error", handleGroupError);

    return () => {
      socketService.off("group:member_added", handleAddMember);
      socketService.off("group:member_removed", handleRemoveMember);
      socketService.off("group:updated", handleUpdate);
      socketService.off("group:invite_sent", handleInviteSent);
      socketService.off("group:invite_received", handleInviteReceived);
      socketService.off("group:error", handleGroupError);
    };
  }, []);
}
