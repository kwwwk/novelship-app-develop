import { useEffect, useState } from 'react';
import { Platform, AppState } from 'react-native';

import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// this hook can only have one instance
const useTrackingPermission = () => {
  const defaultPermission = Platform.OS === 'ios' ? 'blocked' : 'granted';

  if (defaultPermission === 'granted') return 'granted';

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [trackingPermission, setTrackingPermission] = useState<'blocked' | 'granted'>(
    defaultPermission
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const requestPermission = (status: typeof AppState.currentState) => {
      if (status !== 'active') return;

      check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then((currentPermission) => {
        switch (currentPermission) {
          case RESULTS.GRANTED:
          case RESULTS.LIMITED:
          case RESULTS.UNAVAILABLE:
            setTrackingPermission(RESULTS.GRANTED);
            break;
          case RESULTS.BLOCKED:
            setTrackingPermission(RESULTS.BLOCKED);
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY).then((givenPermission) => {
              switch (givenPermission) {
                case RESULTS.GRANTED:
                case RESULTS.LIMITED:
                case RESULTS.UNAVAILABLE:
                  setTrackingPermission(RESULTS.GRANTED);
                  break;
                case RESULTS.BLOCKED:
                case RESULTS.DENIED:
                  setTrackingPermission(RESULTS.BLOCKED);
                  break;
                default:
                  break;
              }
            });
            break;
          default:
            break;
        }
      });
    };

    const listener = AppState.addEventListener('change', requestPermission);
    return () => listener.remove();
  }, []);

  return trackingPermission;
};

export default useTrackingPermission;
