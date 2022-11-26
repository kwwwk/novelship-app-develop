import { EmailLoginRequest } from 'app/store/resources/user';
import { createContext } from 'react';
import { UserType } from 'types/resources/user';

export type AuthContextType = {
  signupValues: Partial<UserType>;
  setSignupValues: (s: Partial<UserType>) => void;
  loginValues: Partial<EmailLoginRequest>;
  setLoginValues: (s: Partial<EmailLoginRequest>) => void;
};

const AuthContext = createContext<AuthContextType>({
  signupValues: {},
  setSignupValues: () => {},
  loginValues: {},
  setLoginValues: () => {},
});

export default AuthContext;
