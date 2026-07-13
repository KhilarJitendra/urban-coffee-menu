'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroScene from '@/components/IntroScene';
import Menu from '@/components/Menu';

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');

  useEffect(() => {
    const seen = sessionStorage.getItem('intro_seen');
    if (!seen) {
      setShowIntro(true);
    }

    const hour = new Date().getHours();
    let current: TimeOfDay = 'day';
    if (hour >= 6 && hour < 11) current = 'morning';
    else if (hour >= 11 && hour < 17) current = 'day';
    else if (hour >= 17 && hour < 20) current = 'evening';
    else current = 'night';

    setTimeOfDay(current);

    if (current === 'night' || current === 'evening') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-background">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScene
            key="intro"
            timeOfDay={timeOfDay}
            onSkip={() => { sessionStorage.setItem('intro_seen', '1'); setShowIntro(false); }}
          />
        ) : (
          <Menu key="menu" timeOfDay={timeOfDay} />
        )}
      </AnimatePresence>
    </div>
  );
}
