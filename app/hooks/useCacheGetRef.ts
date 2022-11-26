import { cacheGet, CacheKeyType } from 'app/services/asyncStorage';
import { useEffect, useRef } from 'react';

const useCacheGetRef = <T>(key: CacheKeyType, callback?: (data: any) => void): T | undefined => {
  const cached = useRef<T | undefined>(undefined);

  useEffect(() => {
    cacheGet<T>(key).then((d) => {
      cached.current = d;
      if (callback) {
        callback(d);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return cached.current;
};

export default useCacheGetRef;
