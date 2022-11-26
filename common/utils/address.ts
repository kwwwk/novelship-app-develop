import { CountryType } from 'types/resources/country';
import { AddressType } from 'types/resources/user';

const addressString = (address: AddressType, country: { name: string }) =>
  `${address.line_1}, ${address.line_2}, ${address.city}, ${address.state}\n${country.name} ${address.zip}`;

const nsOfficeAddressString = (country: CountryType) =>
  `${country.ns_address_name}, ${[
    country.ns_address_line_1,
    country.ns_address_line_2,
    country.ns_address_line_3,
    country.ns_address_city,
    `${country.ns_address_state} ${country.ns_address_zip}`,
  ]
    .filter(Boolean)
    .join(', ')}`;

export { addressString, nsOfficeAddressString };
