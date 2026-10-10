import { useEffect, useRef, useState } from "react";

/**
 * Devuelve [ref, visible]. `visible` pasa a true una sola vez cuando el elemento
 * entra en pantalla. Sin IntersectionObserver (navegadores antiguos) queda visible.
 */
export const useInView = <T extends Element>(rootMargin = "0px 0px -10% 0px") => {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (visible || !node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return [ref, visible] as const;
};
