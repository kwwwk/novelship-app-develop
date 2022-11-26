import React from 'react';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

import { sentryCapture } from 'app/services/sentry';

class ErrorBoundary extends React.Component<Record<string, unknown>, { hasError: boolean }> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) {
      return;
    }

    sentryCapture(error);
    Alert.alert(
      '',
      'An unexpected error has occurred. Please restart to continue.',
      [
        {
          text: 'Restart',
          onPress: () => RNRestart.Restart(),
        },
      ],
      { cancelable: false }
    );
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return null;
    }

    return children;
  }
}

export default ErrorBoundary;
