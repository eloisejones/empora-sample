import environment from '../../src/config/index.js';
import Address from '../../src/models/address';
import AddressValidator from '../../src/services/address-validator.js';
import { getValidatedAddress } from '../../src/api/address-validator.js';
import { getValidatedAddressMock } from '../../src/api/address-validator-mock.js';
import { responseAddressValidatorValid } from '../assets/response-address-validator-valid.js';

const cases = {
  basicAllData: {},
  basicNoData: {},
  realAddress: {
    input: {
      [Address.KEYS.street]: '123 e Maine Street',
      [Address.KEYS.city]: 'Columbus',
      [Address.KEYS.postalCode]: '43215',
    },
    output: '123 E Main St, Columbus, 43215-5207',
  },
};
Address.KEYS_ARRAY.forEach((f) => cases.basicAllData[f] = `any data ${f}`);

const rejectFn = (result) => {
  console.error('AddressValidator unexpectedly errored: '+result);
};

describe('AddressValidator', () => {
  const origRealApiEnabled = environment.addressValidator.realApiEnabled;

  afterEach(() => {
    environment.addressValidator.realApiEnabled = origRealApiEnabled;
  });

  describe('.validate', () => {
    describe('with responses from AddressValidator API', () => {
      it('handles a basic case with all data', () => {
        environment.addressValidator.realApiEnabled = true;
        const address = new Address(cases.realAddress.input);
        const resolveFn = (result) => {
          expect(result).toBe(cases.realAddress.output);
        };

        return AddressValidator.validate(address)
          .then(resolveFn)
          .catch(rejectFn);
      });
    });

    describe('with responses from AddressValidatorMock API', () => {
      it('handles a basic case with all data', () => {
        environment.addressValidator.realApiEnabled = false;
        const address = new Address(cases.basicAllData);
        const resolveFn = (result) => {
          expect(result).toBe(address.toString().toUpperCase());
        };

        return AddressValidator.validate(address)
          .then(resolveFn)
          .catch(rejectFn);
      });

      it('handles a basic case with no data', () => {
        environment.addressValidator.realApiEnabled = false;
        const address = new Address(cases.basicNoData);
        const resolveFn = (result) => {
          expect(result).toBe(address.toString().toUpperCase());
        };

        return AddressValidator.validate(address)
          .then(resolveFn)
          .catch(rejectFn);
      });
    });
  });

  describe('.processResponse', () => {
    // Tests here are covered by tests for the next method
  });

  describe('.getFormattedAddressStrFromResponse', () => {
    describe('with manually generated response data', () => {
      it('handles a valid response', () => {
        const result = AddressValidator.getFormattedAddressStrFromResponse(responseAddressValidatorValid);
        expect(result).toBe('1234 S Colorado Ave, Columbus, 43206-1219');
      });
    });

    describe('with responses from AddressValidator API', () => {
      it('handles a valid response', async () => {
        const address = new Address(cases.realAddress.input);
        const response = await getValidatedAddress(address);
        const result = AddressValidator.getFormattedAddressStrFromResponse(response);

        expect(result).toBe(cases.realAddress.output);
      });
    });

    describe('with responses from AddressValidatorMock API', () => {
      it('handles a valid response', async () => {
        const address = new Address(cases.basicAllData);
        const response = await getValidatedAddressMock(address);
        const result = AddressValidator.getFormattedAddressStrFromResponse(response);

        expect(result).toBe(address.toString().toUpperCase());
      });

      it('handles an invalid response', async () => {
        const address = new Address(cases.basicAllData);
        address[Address.KEYS.street] = 'this is INVALID';

        const response = await getValidatedAddressMock(address);
        const result = AddressValidator.getFormattedAddressStrFromResponse(response);

        expect(result).toBe(AddressValidator.INVALID_ADDRESS_STRING);
      });

      it('handles a suspect response', async () => {
        const address = new Address(cases.basicAllData);
        address[Address.KEYS.street] = 'this is SUSPECT';

        const response = await getValidatedAddressMock(address);
        const result = AddressValidator.getFormattedAddressStrFromResponse(response);

        expect(result).toBe(address.toString().toUpperCase());
      });
    });
  });
});