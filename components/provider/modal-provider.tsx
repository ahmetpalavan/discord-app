"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../modal/CreateServerModal";

export function ModalProvider() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateServerModal />
    </>
  );
}
