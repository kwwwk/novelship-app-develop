import { useEffect, useState } from 'react';
import PushNotification from 'app/services/pushNotification';
import { AppState } from 'react-native';

function usePushState() {
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(false);

  const syncPushState = () => PushNotification.isPushEnabled().then(setIsPushEnabled);
  const onAppStateChange = () => syncPushState().then(() => setTimeout(syncPushState, 1e3));

  const onPushSettingChanged = () =>
    PushNotification.pushEnable(!isPushEnabled).then(setIsPushEnabled);

  useEffect(() => {
    syncPushState();
    const listener = AppState.addEventListener('change', onAppStateChange);
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isPushEnabled, onPushSettingChanged };
}

export default usePushState;
