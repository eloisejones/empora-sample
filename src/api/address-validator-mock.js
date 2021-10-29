import Address from '../models/address.js';
import AddressValidatorParams from '../models/address-validator-params.js';

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

export async function getValidatedAddressMock(address) {
  return new Promise((resolve, reject) => {
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
    });

    resolve(response);
  });
}