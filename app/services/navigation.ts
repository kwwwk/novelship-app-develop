import { StackNavigationProp } from '@react-navigation/stack';
import { RootRoutes } from 'types/navigation';

const navigateBackOrGoToHome = (navigation: StackNavigationProp<RootRoutes>) =>
  navigation.canGoBack()
    ? navigation.goBack()
    : navigation.replace('BottomNavStack', {
        screen: 'HomeStack',
        params: { screen: 'Sneakers' },
      });

export { navigateBackOrGoToHome };
