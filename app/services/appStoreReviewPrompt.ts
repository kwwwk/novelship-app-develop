import { i18n } from '@lingui/core';
import * as StoreReviewPrompt from 'react-native-store-review';
import { LB } from 'common/constants';
import { Alert } from 'react-native';
import { t } from '@lingui/macro';
import { cacheGet, cacheSet } from './asyncStorage';

let isAppStorePromptedLocalCheck = false;

function AppStoreReviewPrompt(mode?: 'List' | 'Sale' | 'Offer' | 'Purchase' | 'Consignment') {
  if (isAppStorePromptedLocalCheck) return;
  isAppStorePromptedLocalCheck = true;

  cacheGet<boolean>('is_app_review_prompted').then((isAppReviewPrompted) => {
    if (isAppReviewPrompted) return;

    if (StoreReviewPrompt.isAvailable)
      Alert.alert(
        'Rate Novelship',
        mode
          ? i18n._(
              t`Congratulations on your ${mode}.${LB}Your app store review helps spread the word! Leave us a rating and let us know what you think of Novelship`
            )
          : i18n._(
              t`Thanks for using Novelship.${LB}Your app store review helps spread the word! Leave us a rating and let us know what you think of Novelship`
            ),
        [
          {
            text: i18n._(t`Rate Now`),
            style: 'default',
            onPress: () =>
              cacheSet('is_app_review_prompted', true, 30 * 24 * 60).then(() =>
                StoreReviewPrompt.requestReview()
              ),
          },
          { text: i18n._(t`No, Thanks`) },
        ],
        { cancelable: true }
      );
  });
}

export default AppStoreReviewPrompt;
