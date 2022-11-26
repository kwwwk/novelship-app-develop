import * as Sentry from '@sentry/react-native';

const sentryCapture = (err: any) => (__DEV__ ? console.log(err) : Sentry.captureException(err));

export { sentryCapture };
