import React, { useEffect, useState } from 'react';
import { useLinkTo } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps, TransitionPresets } from '@react-navigation/stack';

import { useStoreState } from 'app/store';
import { AppHeader } from 'app/components/layout';
import { UserType } from 'types/resources/user';
import { AuthRoutes, RootRoutes } from 'types/navigation';

import { navigateBackOrGoToHome } from 'app/services/navigation';
import { EmailLoginRequest } from 'app/store/resources/user';
import ForgotPassword from './ForgotPassword';
import SocialCallback from './SocialCallback';
import LogIn from './LogIn';
import SignUp from './SignUp';
import AuthContext from './context';
import ResetPassword from './ResetPassword';
import LoginOTP from './LoginOTP';

const AuthStack = createStackNavigator<AuthRoutes>();

const AuthNavigator = ({ navigation, route }: StackScreenProps<RootRoutes, 'AuthStack'>) => {
  const userId = useStoreState((s) => s.user.user.id);
  const [signupValues, setSignupValues] = useState<Partial<UserType>>({});
  const [loginValues, setLoginValues] = useState<Partial<EmailLoginRequest>>({});

  const linkTo = useLinkTo();

  useEffect(() => {
    const redirectPath = route.params?.redirectTo;
    if (userId) {
      if (redirectPath) {
        navigation.pop();
        linkTo(redirectPath);
      } else {
        navigateBackOrGoToHome(navigation);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <AuthContext.Provider value={{ signupValues, setSignupValues, loginValues, setLoginValues }}>
      <AuthStack.Navigator
        screenOptions={{
          // @ts-ignore rn-navigation not supporting proper types
          header: (props) => <AppHeader {...props} />,
          headerMode: 'float',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <AuthStack.Screen name="LogIn" component={LogIn} options={{ animationEnabled: false }} />
        <AuthStack.Screen name="SignUp" component={SignUp} options={{ animationEnabled: false }} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />
        <AuthStack.Screen name="ResetPassword" component={ResetPassword} />
        <AuthStack.Screen name="LoginOTP" component={LoginOTP} />
        <AuthStack.Screen
          name="SocialCallback"
          component={SocialCallback}
          options={{ headerShown: false, animationEnabled: false }}
        />
        <AuthStack.Screen
          name="SocialCallbackWeb"
          component={SocialCallback}
          options={{ headerShown: false, animationEnabled: false }}
        />
      </AuthStack.Navigator>
    </AuthContext.Provider>
  );
};

export default AuthNavigator;
