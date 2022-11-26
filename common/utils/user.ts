import { cacheMapGet } from 'app/services/asyncStorage';
import { AddressType, UserType } from 'types/resources/user';

function getUserSignupAndLoginMethodName(user: UserType) {
  if (user.google) {
    return 'google';
  }
  if (user.facebook) {
    return 'facebook';
  }
  if (user.apple) {
    return 'apple';
  }
  return 'email';
}

const userAddressMap: AddressType = {
  firstname: 'firstname2',
  lastname: 'lastname2',
  line_1: 'line_4',
  line_2: 'line_5',
  line_3: 'line_6',
  city: 'city2',
  state: 'state2',
  zip: 'zip2',
  phone: 'phone2',
  country_code: 'country_code2',
};

const isAuthenticated = () => !!cacheMapGet('token');

const mapSecondAddress = (values: AddressType) =>
  Object.keys(userAddressMap).reduce((address, key) => {
    // @ts-ignore override
    address[key] = values[userAddressMap[key]];
    return address;
  }, {} as AddressType);

export { getUserSignupAndLoginMethodName, mapSecondAddress, userAddressMap, isAuthenticated };
