"use client";

import { useEffect, useState } from "react";
import CreateChannelModal from "../modal/CreateChannelModal";
import CreateServerModal from "../modal/CreateServerModal";
import EditServerModal from "../modal/EditServerModal";
import InviteModal from "../modal/InviteModal";
import MembersModal from "../modal/MembersModal";

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
    </>
  );
}
