'use client';

import { motion } from 'framer-motion';

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

interface IntroSceneProps {
  timeOfDay: TimeOfDay;
  onSkip: () => void;
}

export default function IntroScene({ timeOfDay, onSkip }: IntroSceneProps) {
  const getSkyGradient = () => {
    switch (timeOfDay) {
      case 'morning': return 'from-[#FFB7B2] via-[#FFDAB9] to-[#E0F7FA]';
      case 'day':     return 'from-[#4CA1AF] via-[#87CEEB] to-[#E0F7FA]';
      case 'evening': return 'from-[#FF7E5F] via-[#FEB47B] to-[#7B2CBF]';
      case 'night':   return 'from-[#0F2027] via-[#203A43] to-[#2C5364]';
    }
  };

  const getCloudClass = () => `cloud cloud-${timeOfDay}`;
  const isDark = timeOfDay === 'night' || timeOfDay === 'evening';

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', opacity: 0, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
      className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer bg-gradient-to-b ${getSkyGradient()} overflow-hidden`}
      onClick={onSkip}
      data-testid="intro-scene"
    >
      {/* Night: stars + moon */}
      {timeOfDay === 'night' && (
        <>
          <div className="absolute top-1/4 right-1/4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white opacity-80 shadow-[0_0_40px_10px_rgba(255,255,255,0.5)]" />
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full"
              style={{ top: `${(i * 37 + 7) % 100}%`, left: `${(i * 53 + 11) % 100}%` }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: (i % 5) * 0.4 }}
            />
          ))}
        </>
      )}

      {/* Morning / Day: sun */}
      {(timeOfDay === 'morning' || timeOfDay === 'day') && (
        <div className="absolute top-[20%] left-[20%] w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-[#FFDF00] opacity-90 shadow-[0_0_60px_20px_rgba(255,223,0,0.6)]" />
      )}

      {/* Evening: setting sun */}
      {timeOfDay === 'evening' && (
        <div className="absolute top-1/2 left-[15%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-[#FF4500] opacity-90 shadow-[0_0_80px_20px_rgba(255,69,0,0.6)]" />
      )}

      {/* Clouds */}
      <motion.div
        className={`${getCloudClass()} w-20 h-7 sm:w-28 sm:h-9 md:w-32 md:h-10`}
        style={{ top: '18%', left: '-200px' }}
        animate={{ x: ['0px', '120vw'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className={`${getCloudClass()} w-28 h-9 sm:w-36 sm:h-12 md:w-48 md:h-16`}
        style={{ top: '38%', left: '-300px' }}
        animate={{ x: ['0px', '120vw'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear', delay: 5 }}
      />
      <motion.div
        className={`${getCloudClass()} w-16 h-5 sm:w-20 sm:h-7 md:w-24 md:h-8 opacity-70`}
        style={{ top: '60%', left: '-150px' }}
        animate={{ x: ['0px', '120vw'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear', delay: 15 }}
      />

      {/* Centered text */}
      <div className="relative z-10 text-center flex flex-col items-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          className={`text-4xl sm:text-5xl md:text-7xl font-serif font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'} drop-shadow-lg`}
          data-testid="intro-restaurant-name"
        >
          Urban Coffee
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.0 }}
          className={`mt-2 sm:mt-3 text-sm sm:text-base font-serif italic ${isDark ? 'text-white/70' : 'text-slate-700/80'}`}
        >
          More Than Coffee
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className={`mt-4 sm:mt-5 text-xs sm:text-sm tracking-[0.3em] uppercase ${isDark ? 'text-white/80' : 'text-slate-800/80'}`}
        >
          Tap to view menu
        </motion.p>
      </div>
    </motion.div>
  );
}
