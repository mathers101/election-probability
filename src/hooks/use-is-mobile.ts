import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const mobileQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(mobileQuery).matches);

  useEffect(() => {
    const media = window.matchMedia(mobileQuery);
    const onChange = () => setIsMobile(media.matches);
    media.addEventListener("change", onChange);
    onChange();
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
