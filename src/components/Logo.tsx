import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <img src="/logo-without-background.png" className="h-10 w-10 text-blue-600 dark:text-blue-400 transition-colors duration-300" alt="blueOceanWhale Logo" />
      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">BlueOceanWhale</span>
    </div>
  );
}
