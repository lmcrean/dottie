import { useState } from 'react';
import { PainLevel } from '../../context/types';

/**
 * Custom hook to manage pain level state
 */
export const usePainLevel = () => {
  const [painLevel, setPainLevel] = useState<PainLevel | undefined>(undefined);

  return {
    painLevel,
    setPainLevel
  };
};

export default usePainLevel;
