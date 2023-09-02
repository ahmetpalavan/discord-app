import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";
  
  return origin;
};
