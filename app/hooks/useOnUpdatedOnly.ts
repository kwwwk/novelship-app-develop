import { EffectCallback, useEffect, useRef } from 'react';

// Doesn't run on first mount, then behaves as useEffect
const useOnUpdatedOnly = (callback: EffectCallback, dependencies: React.DependencyList) => {
  const ref = useRef<boolean>();
  useEffect(() => {
    if (ref.current) {
      return callback();
    }
    ref.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useOnUpdatedOnly;
