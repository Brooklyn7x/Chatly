import { DirectModal } from "../sidebar/PrivateChat";
import { GroupModal } from "../sidebar/GroupChat";
import { useModals } from "@/contexts/ModalContext";

export function AppModals() {
  const { channelModal, groupModal, closeChannelModal, closeGroupModal } =
    useModalStore();

  return (
    <>
      <DirectModal isOpen={channelModal} onClose={closeChannelModal} />
      <GroupModal isOpen={groupModal} onClose={closeGroupModal} />
    </>
  );
}
