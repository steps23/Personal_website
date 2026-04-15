import React, { useState, useEffect } from 'react';
import { useScroll, useTransform } from 'motion/react';

export const useSectionBackgroundColor = (
  sectionRef: React.RefObject<HTMLElement>,
  getColors: (isDark: boolean) => { start: string; mid: string; end: string },
  colorStops: number[] = [0, 0.18, 0.82, 1]
) => {
  const [isDark, setIsDark] = useState(() => 
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 92%', 'end 8%'],
  });

  const { start, mid, end } = getColors(isDark);

  return useTransform(
    scrollYProgress,
    colorStops,
    [start, mid, mid, end]
  );
};
