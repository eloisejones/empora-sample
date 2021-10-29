import Address from '../../src/models/address.js';
import AddressValidatorParams from '../../src/models/address-validator-params';

export const inputCases = {
  [AddressValidatorParams.STATUSES.valid]: {
    [Address.KEYS.street]: '10079 whipple tree ln',
    [Address.KEYS.city]: 'clarkston',
    [Address.KEYS.postalCode]: '48348',
  },
  [AddressValidatorParams.STATUSES.suspect]: {
    [Address.KEYS.street]: '123 e Maine Street',
    [Address.KEYS.city]: 'Columbus',
    [Address.KEYS.postalCode]: '43215',
  },
  [AddressValidatorParams.STATUSES.invalid]: {
    [Address.KEYS.street]: 'this is just not',
    [Address.KEYS.city]: 'really not',
    [Address.KEYS.postalCode]: 'an address',
  },
}

export const responseAddressValidatorValid = {
  status: 'VALID',
  formattedaddress: '10079 Whipple Tree Ln,Clarkston MI 48348-2055',
  addressline1: '10079 Whipple Tree Ln',
  addresslinelast: 'Clarkston MI 48348-2055',
  street: 'Whipple Tree Ln',
  streetnumber: '10079',
  postalcode: '48348-2055',
  city: 'Clarkston',
  state: 'MI',
  country: 'US',
  county: 'Oakland',
  rdi: 'R',
  type: 'S'
};

export const responseAddressValidatorSuspect = {
  status: 'SUSPECT',
  ratelimit_remain: 95,
  ratelimit_seconds: 181,
  cost: 1,
  formattedaddress: '123 E Main St,Columbus OH 43215-5207',
  addressline1: '123 E Main St',
  addresslinelast: 'Columbus OH 43215-5207',
  street: 'E Main St',
  streetnumber: '123',
  postalcode: '43215-5207',
  city: 'Columbus',
  state: 'OH',
  country: 'US',
  county: 'Franklin',
  type: 'S'
};

export const responseAddressValidatorInvalid = {
  status: 'INVALID',
  ratelimit_remain: 93,
  ratelimit_seconds: 100,
  cost: 1,
  formattedaddress: 'This Is Just Not,Really Not an Address',
  addressline1: 'This Is Just Not',
  addresslinelast: 'Really Not an Address',
  street: 'This Is Just Not',
  city: 'Really Not an Address',
  country: 'US'
};

export const outputCases = {
  [AddressValidatorParams.STATUSES.valid]: responseAddressValidatorValid,
  [AddressValidatorParams.STATUSES.suspect]: responseAddressValidatorSuspect,
  [AddressValidatorParams.STATUSES.invalid]: responseAddressValidatorInvalid,
};