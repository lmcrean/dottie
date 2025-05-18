import { useState } from 'react';
import { FlowHeaviness } from '../../context/types';

/**
 * Custom hook to manage flow heaviness state
 */
export const useFlowHeaviness = () => {
  const [flowHeaviness, setFlowHeaviness] = useState<FlowHeaviness | undefined>(undefined);

  return {
    flowHeaviness,
    setFlowHeaviness
  };
};

export default useFlowHeaviness;
