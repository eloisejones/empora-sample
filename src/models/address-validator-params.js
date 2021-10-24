import environment from '../config/index.js';
import Address from './address.js';

export default class AddressValidatorParams {
  static KEYS_REQ = {
    [Address.KEYS.street]: "StreetAddress",
    [Address.KEYS.city]: "City",
    [Address.KEYS.postalCode]: "PostalCode",
    apiKey: "APIKey",
    countryCode: "CountryCode",
  }

  static KEYS_RESP = {
    status: "status",
    [Address.KEYS.street]: "addressline1",
    [Address.KEYS.city]: "city",
    [Address.KEYS.postalCode]: "postalcode",
  }

  static STATUSES = {
    invalid: "INVALID",
    suspect: "SUSPECT",
    valid: "VALID",
  }

  static buildAddressFromUrl(requestUrl) {
    const searchParams = requestUrl.searchParams;

    const addressParams = {};
    Address.KEYS_ARRAY.forEach(k => {
      addressParams[k] = searchParams.get(AddressValidatorParams.KEYS_REQ[k])
    });

    return new Address(addressParams)
  }

  static buildParamsFromAddress(address) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set(AddressValidatorParams.KEYS_REQ.apiKey, environment.addressValidator.apiKey);
    urlSearchParams.set(AddressValidatorParams.KEYS_REQ.countryCode, 'us');

    Address.KEYS_ARRAY.forEach((f) => urlSearchParams.set(AddressValidatorParams.KEYS_REQ[f], address[f]));
    return urlSearchParams;
  }

  static buildAddressFromResponse(response) {
    const addressParams = {};
    Address.KEYS_ARRAY.forEach((k) => addressParams[k] = response[AddressValidatorParams.KEYS_RESP[k]]);
    return new Address(addressParams);
  }
}

//curl https://api.address-validator.net/api/verify?APIKey=av-02cd7b26ba12f90948ce6bafc39549bd&StreetAddress=658%20s%20grant%20ave&City=columbus&PostalCode=43206&CountryCode=us