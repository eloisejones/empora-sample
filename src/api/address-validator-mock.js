import AddressValidatorParams from "../models/address-validator-params.js";
import Address from "../models/address.js";
import { buildAddressValidatorUrl } from './address-validator.js';

const TESTS = [
  {
    regex: /INVALID/,
    status: AddressValidatorParams.STATUSES.invalid,
    addressTransformFn: (a) => a,
  },
  {
    regex: /SUSPECT/,
    status: AddressValidatorParams.STATUSES.suspect,
    addressTransformFn: (a) => a && typeof(a) === 'string' && a.toUpperCase(),
  },
  {
    regex: /.*/,
    status: AddressValidatorParams.STATUSES.valid,
    addressTransformFn: (a) => a && typeof(a) === 'string' && a.toUpperCase(),
  },
];

export function getValidatedAddressMock(address, processResponse) {
  // const requestUrl = buildAddressValidatorUrl(address);
  // const requestAddress = AddressValidatorParams.buildAddressFromUrl(requestUrl);

  const response = {};
  TESTS.find((test) => {
    if (test.regex.test(address.street)) {
      response.status = test.status;
      Address.KEYS_ARRAY.forEach((addressKey) => {
        const respKey = AddressValidatorParams.KEYS_RESP[addressKey];
        response[respKey] = test.addressTransformFn(address[addressKey]);
      })
      return true;
    }
  })
  
  processResponse(address, response);
}