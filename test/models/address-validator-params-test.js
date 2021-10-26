import AddressValidatorParams from '../../src/models/address-validator-params.js';
import Address from '../../src/models/address.js';
import environment from '../../src/config/index.js';
import { expect, jest } from '@jest/globals';
import { getValidatedAddressMock } from '../../src/api/address-validator-mock.js';
import { getValidatedAddress, buildAddressValidatorUrl } from '../../src/api/address-validator.js';

const cases = {
  basicAllData: {},
  basicNoData: {},
  realAddress: {
    input: {
      [Address.KEYS.street]: '123 e Maine Street',
      [Address.KEYS.city]: 'Columbus',
      [Address.KEYS.postalCode]: '43215',
    },
    output: {
      [Address.KEYS.street]: '123 E Main St',
      [Address.KEYS.city]: 'Columbus',
      [Address.KEYS.postalCode]: '43215-5207',
    }
  },
  validResponse: {
    "status": "VALID",
    "ratelimit_remain": 98,
    "ratelimit_seconds": 25,
    "cost": 1.0,
    "formattedaddress": "1234 S Colorado Ave,Columbus OH 43206-1219",
    "addressline1": "1234 S Colorado Ave",
    "addresslinelast": "Columbus OH 43206-1219",
    "street": "S Colorado Ave",
    "streetnumber": "1234",
    "postalcode": "43206-1219",
    "city": "Columbus",
    "state": "OH",
    "country": "US",
    "county": "Franklin",
    "rdi": "R",
    "type": "S",
  },
};
Address.KEYS_ARRAY.forEach((f) => cases.basicAllData[f] = `any data ${f}`);

describe('AddressValidatorParams', () => {
  describe.only('.buildAddressFromUrl', () => {
    it('handles a basic case with all data', () => {
      const address = new Address(cases.basicAllData);
      const requestUrl = buildAddressValidatorUrl(address);
      const result = AddressValidatorParams.buildAddressFromUrl(requestUrl);

      expect(result instanceof Address).toBe(true);
      Address.KEYS_ARRAY.forEach((f) => {
        expect(result[f]).toBe(address[f]);
      });
    });

    it('handles a basic case with no data', () => {
      const address = new Address(cases.basicNoData);
      const requestUrl = buildAddressValidatorUrl(address);
      const result = AddressValidatorParams.buildAddressFromUrl(requestUrl);

      expect(result instanceof Address).toBe(true);
      Address.KEYS_ARRAY.forEach((f) => {
        expect(result[f]).toBe('undefined');
      });
    });
  });

  describe('.buildParamsFromAddress', () => {
    it('handles a basic case with all data', () => {
      const address = new Address(cases.basicAllData);
      const result = AddressValidatorParams.buildParamsFromAddress(address);

      expect(result instanceof URLSearchParams).toBe(true);
      expect(result.get(AddressValidatorParams.KEYS_REQ.apiKey)).toBe(environment.addressValidator.apiKey);
      expect(result.get(AddressValidatorParams.KEYS_REQ.countryCode)).toBe('us');
      Address.KEYS_ARRAY.forEach((f) => {
        expect(result.get(AddressValidatorParams.KEYS_REQ[f])).toBe(`any data ${f}`);
      });
    });

    it('handles a basic case with no data', () => {
      const address = new Address(cases.basicNoData);
      const result = AddressValidatorParams.buildParamsFromAddress(address);

      expect(result instanceof URLSearchParams).toBe(true);
      expect(result.get(AddressValidatorParams.KEYS_REQ.apiKey)).toBe(environment.addressValidator.apiKey);
      expect(result.get(AddressValidatorParams.KEYS_REQ.countryCode)).toBe('us');
      Address.KEYS_ARRAY.forEach((f) => {
        expect(result.get(AddressValidatorParams.KEYS_REQ[f])).toBe('undefined');
      });
    });

    it('throws an error if address is not an instance of Address', () => {
      try {
        AddressValidatorParams.buildParamsFromAddress('not an Address');
      } catch(e) {
        expect(e).toBe('Parameter \'address\' must be of type Address');
      }
    });
  });

  describe('.buildAddressFromResponse', () => {
    describe('with manually generated response data', () => {
      it('handles a valid response', () => {
        const result = AddressValidatorParams.buildAddressFromResponse(cases.validResponse);

        expect(result instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(result[f]).toBe(cases.validResponse[AddressValidatorParams.KEYS_RESP[f]]);
        });
      });
    });

    describe('with responses from AddressValidator API', () => {
      it('handles a valid response', async () => {
        const address = new Address(cases.realAddress.input);
        const response = await getValidatedAddress(address);
        const result = AddressValidatorParams.buildAddressFromResponse(response);

        expect(result instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(result[f]).toBe(cases.realAddress.output[f]);
        });
      });
    });

    describe('with responses from AddressValidatorMock API', () => {
      it('handles a valid response', async () => {
        const address = new Address(cases.basicAllData);
        const response = await getValidatedAddressMock(address);
        const result = AddressValidatorParams.buildAddressFromResponse(response);

        expect(result instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(result[f]).toBe(address[f].toUpperCase());
        });
      });

      it('handles an invalid response', async () => {
        const address = new Address(cases.basicAllData);
        address[Address.KEYS.street] = 'this is INVALID';

        const response = await getValidatedAddressMock(address);
        const result = AddressValidatorParams.buildAddressFromResponse(response);

        expect(result instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(result[f]).toBe(address[f]);
        });
      });

      it('handles a suspect response', async () => {
        const address = new Address(cases.basicAllData);
        address[Address.KEYS.street] = 'this is SUSPECT';

        const response = await getValidatedAddressMock(address);
        const result = AddressValidatorParams.buildAddressFromResponse(response);

        expect(result instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(result[f]).toBe(address[f].toUpperCase());
        });
      });
    });
  });
});