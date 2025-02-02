import { DirectModal } from "../modal/DirectModal";
import { GroupModal } from "../modal/GroupModal";
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
