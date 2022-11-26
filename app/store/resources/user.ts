import { UserType, anonymousUser, InterestType } from 'types/resources/user';
import { action, thunk, computed, Computed, Thunk, Action } from 'easy-peasy';
import API from 'common/api';
import { cacheGet, cacheRemove, cacheSet } from 'app/services/asyncStorage';
import envConstants from 'app/config';
import Analytics from 'app/services/analytics';
import PushNotification from 'app/services/pushNotification';
import UserViewedProductService from 'app/services/userViewedProduct';

const updateCachedToken = (token: string) => {
  if (token) {
    cacheSet('token', token);
  } else {
    cacheRemove('token');
  }
};

const onUserLogin = (user: UserType) => {
  Analytics.login(user, 'email');
  UserViewedProductService.syncAll();

  // partner code validation
  cacheGet<string>('partner_code').then((partnercode) => {
    if (partnercode && !user.groups.includes(partnercode)) {
      API.post('me/partner_promotion/validate', {
        code: partnercode,
        country_id: user.shipping_country_id || user.country_id,
      }).catch((err) => console.log(err));
    }
  });
  return user;
};

export type EmailLoginRequest = {
  email: string;
  password: string;
  otp?: string;
  csrf?: string;
};

type SignupResponseType = { otpSent?: boolean };
type LoginResponseType = { token: string } & SignupResponseType;
export interface UserStoreType {
  token: string;
  setToken: Action<UserStoreType, string>;
  setTokenFromCache: Thunk<UserStoreType>;
  user: UserType;
  isAuthToken: Computed<UserStoreType, boolean>;
  set: Action<UserStoreType, UserType>;
  fetch: Thunk<UserStoreType, void, void, never, Promise<UserType>>;
  update: Thunk<UserStoreType, Partial<UserType>, void, never, Promise<UserType>>;
  signup: Thunk<
    UserStoreType,
    Partial<UserType & EmailLoginRequest>,
    void,
    never,
    Promise<UserType>
  >;
  login: Thunk<UserStoreType, Partial<EmailLoginRequest & { csrf?: string | null }>>;
  authorize: Thunk<UserStoreType, string, void, never, Promise<UserType>>;
  onAuthorize: Thunk<UserStoreType, LoginResponseType, void, never, Promise<UserType>>;
  logout: Thunk<UserStoreType>;
}

const UserStore: UserStoreType = {
  token: '',
  setToken: action((store, token) => {
    updateCachedToken(token);
    store.token = token;
  }),
  setTokenFromCache: thunk((actions) =>
    cacheGet<string>('token').then((token) => actions.setToken(token || ''))
  ),
  isAuthToken: computed((store) => !!store.token),
  user: anonymousUser,
  set: action((store, user) => {
    // deprecated field interests
    user.interests = user.interests || anonymousUser.interests;
    user.size_preferences = user.size_preferences || anonymousUser.size_preferences;
    user.stripe_buyer = user.stripe_buyer || anonymousUser.stripe_buyer;
    user.stripe_seller = user.stripe_seller || anonymousUser.stripe_seller;
    user.payout_info = user.payout_info || anonymousUser.payout_info;
    user.selling_fee = user.selling_fee || anonymousUser.selling_fee;
    user.country = user.country || anonymousUser.country;
    user.billing_country = user.billing_country || anonymousUser.country;
    user.selling_country = user.selling_country || anonymousUser.country;
    user.shipping_country = user.shipping_country || anonymousUser.country;

    user.address = user.address || anonymousUser.address;
    user.shipping_stats = user.shipping_stats || anonymousUser.shipping_stats;
    user.billing_address = user.billing_address || anonymousUser.billing_address;
    user.selling_address = user.selling_address || anonymousUser.selling_address;
    user.shipping_address = user.shipping_address || anonymousUser.shipping_address;
    user.notification_preferences =
      user.notification_preferences || anonymousUser.notification_preferences;
    // deprecated field mappedInterests
    user.mappedInterests = user.interests.reduce((obj, interest: InterestType) => {
      obj[interest.name] = interest.size || true;
      return obj;
    }, {} as UserType['mappedInterests']);

    // client only fields
    user.hasBuyCardAndEnabled = user.hasBuyCard && !user.buying_card_disabled;
    user.firstTimePromocodeEligible = !user.points;
    user.refereeEligible = user.groups.includes('referee') && user.firstTimePromocodeEligible;
    user.isAdmin = user.role === 'admin';
    user.showPowerSellerFeature =
      !!user.selling_fee.power_features || user.groups.includes('power-features');
    user.sneakerSize = user.size_preferences.Sneakers
      ? `${user.size_preferences.Sneakers.unit} ${user.size_preferences.Sneakers.size}${
          user.size_preferences.Sneakers.category === 'men' &&
          user.size_preferences.Sneakers.unit === 'US'
            ? 'M'
            : ''
        }`
      : '';
    user.teeSize = user.size_preferences.Apparel?.size || '';

    store.user = user;
  }),
  fetch: thunk((actions) =>
    API.fetch<UserType>('me')
      .catch((err: Error) => Promise.reject(err))
      .then((user: UserType) => {
        actions.set(user);
        return user;
      })
      .catch(() => envConstants.RELEASE !== 'development' && actions.logout())
  ),
  update: thunk((actions, payload) =>
    API.put<UserType & { otpSent?: boolean }>('me', payload).then((data) =>
      data?.otpSent ? data : actions.fetch()
    )
  ),
  onAuthorize: thunk((actions, { token }) => {
    actions.setToken(token);
    return actions.fetch().then(onUserLogin);
  }),
  login: thunk((actions, payload) =>
    API.post<LoginResponseType>('auth/login', payload).then((resp: LoginResponseType | UserType) =>
      resp.otpSent ? resp : actions.onAuthorize(resp as LoginResponseType)
    )
  ),
  authorize: thunk((actions, shortToken) => {
    actions.setToken(shortToken);
    return API.post<LoginResponseType>('auth/authorize').then(actions.onAuthorize);
  }),
  signup: thunk((actions, payload) =>
    API.post<EmailLoginRequest & SignupResponseType>('auth/signup', payload).then(
      (_payload: SignupResponseType) =>
        _payload.otpSent
          ? _payload
          : actions.login({ email: payload.email, password: payload.password })
    )
  ),
  logout: thunk((actions) => {
    cacheRemove('token');
    actions.setToken('');
    Analytics.logout();
    PushNotification.logout();
    actions.set(anonymousUser);
  }),
};

export default UserStore;
