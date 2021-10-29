import Address from '../../src/models/address.js';
import AddressValidatorParams from '../../src/models/address-validator-params.js';
import environment from '../../src/config/index.js';
import { getValidatedAddressMock } from '../../src/api/address-validator-mock.js';
import { getValidatedAddress, buildAddressValidatorUrl } from '../../src/api/address-validator.js';
import { inputCases, outputCases } from '../assets/address-validator-api-real-io.js';

describe('AddressValidatorParams', () => {
  describe('.buildAddressFromUrl', () => {
    it('handles a basic case with all data', () => {
      const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
      const requestUrl = buildAddressValidatorUrl(address);
      const result = AddressValidatorParams.buildAddressFromUrl(requestUrl);

      expect(result instanceof Address).toBe(true);
      Address.KEYS_ARRAY.forEach((f) => {
        expect(result[f]).toBe(address[f]);
      });
    });

    it('handles a basic case with no data', () => {
      const address = new Address({});
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
      const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
      const result = AddressValidatorParams.buildParamsFromAddress(address);

      expect(result instanceof URLSearchParams).toBe(true);
      expect(result.get(AddressValidatorParams.KEYS_REQ.apiKey)).toBe(environment.addressValidator.apiKey);
      expect(result.get(AddressValidatorParams.KEYS_REQ.countryCode)).toBe('us');
      Address.KEYS_ARRAY.forEach((f) => {
        expect(result.get(AddressValidatorParams.KEYS_REQ[f])).toBe(inputCases[AddressValidatorParams.STATUSES.valid][f]);
      });
    });

    it('handles a basic case with no data', () => {
      const address = new Address({});
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
    describe('with asset response data', () => {
      Object.keys(AddressValidatorParams.STATUSES).forEach((statusK) => {
        const status = AddressValidatorParams.STATUSES[statusK];

        it(`handles a ${status} response`, () => {
          const response = outputCases[status];
          const result = AddressValidatorParams.buildAddressFromResponse(response);

          expect(result instanceof Address).toBe(true);
          Address.KEYS_ARRAY.forEach((f) => {
            expect(result[f]).toBe(response[AddressValidatorParams.KEYS_RESP[f]]);
          });
        });
      });
    });

    describe('with responses from AddressValidator API', () => {
      it('handles a valid response', async () => {
        const outputData = outputCases[AddressValidatorParams.STATUSES.valid];
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
        const response = await getValidatedAddress(address);
        const result = AddressValidatorParams.buildAddressFromResponse(response);

        expect(result instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(result[f]).toBe(outputData[AddressValidatorParams.KEYS_RESP[f]]);
        });
      });
    });

    describe('with responses from AddressValidatorMock API', () => {
      it('handles a valid response', async () => {
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
        const response = await getValidatedAddressMock(address);
        const result = AddressValidatorParams.buildAddressFromResponse(response);

        expect(result instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(result[f]).toBe(address[f].toUpperCase());
        });
      });

      it('handles an invalid response', async () => {
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
        address[Address.KEYS.street] = 'this is INVALID';

        const response = await getValidatedAddressMock(address);
        const result = AddressValidatorParams.buildAddressFromResponse(response);

        expect(result instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(result[f]).toBe(address[f]);
        });
      });

      it('handles a suspect response', async () => {
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
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