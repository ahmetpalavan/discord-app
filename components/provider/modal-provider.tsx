"use client";

import { useEffect, useState } from "react";
import CreateChannelModal from "../modal/CreateChannelModal";
import CreateServerModal from "../modal/CreateServerModal";
import EditServerModal from "../modal/EditServerModal";
import InviteModal from "../modal/InviteModal";
import MembersModal from "../modal/MembersModal";
import LeaveServer from "../modal/LeaveServer";
import DeleteServer from "../modal/DeleteServer";
import DeleteChannel from "../modal/DeleteChannel";
import EditChannel from "../modal/EditChannel";

export function ModalProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServer />
      <DeleteServer />
      <DeleteChannel />
      <EditChannel />
    </>
  );
}
