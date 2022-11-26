import { cacheGet, cacheSet } from 'app/services/asyncStorage';
import PushNotification from 'app/services/pushNotification';
import API from 'common/api';

const signupDropOffTracking = ({
  shortcode,
  language,
}: {
  shortcode: string;
  language: string;
}) => {
  cacheGet<boolean>('signup_dropoff_tracking').then((isTracked) => {
    if (isTracked) return;

    return PushNotification.getStatus().then((state) => {
      if (state?.userId) {
        API.post('misc/signup-dropoff-track', { player_id: state.userId, shortcode, language })
          .then(() => cacheSet('signup_dropoff_tracking', true, 5 * 24 * 60))
          .catch((e) => console.log(e));
      }
    });
  });
};

export { signupDropOffTracking };
