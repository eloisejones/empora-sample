import environment from '../../src/config/index.js';
import Address from '../../src/models/address';
import AddressValidatorService from '../../src/services/address-validator.js';
import AddressValidatorParams from '../../src/models/address-validator-params';
import { getValidatedAddress } from '../../src/api/address-validator.js';
import { getValidatedAddressMock } from '../../src/api/address-validator-mock.js';
import { inputCases, outputCases } from '../assets/address-validator-api-real-io.js';

const rejectFn = (result) => {
  console.error('AddressValidatorService unexpectedly errored: '+result);
};

describe('AddressValidatorService', () => {
  const origRealApiEnabled = environment.addressValidator.realApiEnabled;

  afterEach(() => {
    environment.addressValidator.realApiEnabled = origRealApiEnabled;
  });

  describe('.validate', () => {
    describe('with responses from AddressValidatorService API', () => {
      it('handles a basic case with all data', () => {
        environment.addressValidator.realApiEnabled = true;
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
        const resolveFn = (result) => {
          expect(result).toBe('10079 Whipple Tree Ln, Clarkston, 48348-2055');
        };

        return AddressValidatorService.validate(address)
          .then(resolveFn)
          .catch(rejectFn);
      });
    });

    describe('with responses from AddressValidatorMock API', () => {
      it('handles a basic case with all data', () => {
        environment.addressValidator.realApiEnabled = false;
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
        const resolveFn = (result) => {
          expect(result).toBe(address.toString().toUpperCase());
        };

        return AddressValidatorService.validate(address)
          .then(resolveFn)
          .catch(rejectFn);
      });

      it('handles a basic case with no data', () => {
        environment.addressValidator.realApiEnabled = false;
        const address = new Address({});
        const resolveFn = (result) => {
          expect(result).toBe(address.toString().toUpperCase());
        };

        return AddressValidatorService.validate(address)
          .then(resolveFn)
          .catch(rejectFn);
      });
    });
  });

  describe('.processResponse', () => {
    // Tests here are covered by tests for the next method
  });

  describe('.getFormattedAddressStrFromResponse', () => {
    describe('with asset response data', () => {
      it('handles a valid response', () => {
        const result = AddressValidatorService.getFormattedAddressStrFromResponse(outputCases[AddressValidatorParams.STATUSES.valid]);
        expect(result).toBe('10079 Whipple Tree Ln, Clarkston, 48348-2055');
      });

      it('handles a suspect response', () => {
        const result = AddressValidatorService.getFormattedAddressStrFromResponse(outputCases[AddressValidatorParams.STATUSES.suspect]);
        expect(result).toBe('123 E Main St, Columbus, 43215-5207');
      });

      it('handles an invalid response', () => {
        const result = AddressValidatorService.getFormattedAddressStrFromResponse(outputCases[AddressValidatorParams.STATUSES.invalid]);
        expect(result).toBe(AddressValidatorService.INVALID_ADDRESS_STRING);
      });
    });

    describe('with responses from AddressValidatorService API', () => {
      it('handles a valid response', async () => {
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
        const response = await getValidatedAddress(address);
        const result = AddressValidatorService.getFormattedAddressStrFromResponse(response);

        expect(result).toBe('10079 Whipple Tree Ln, Clarkston, 48348-2055');
      });
    });

    describe('with responses from AddressValidatorMock API', () => {
      it('handles a valid response', async () => {
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
        const response = await getValidatedAddressMock(address);
        const result = AddressValidatorService.getFormattedAddressStrFromResponse(response);

        expect(result).toBe(address.toString().toUpperCase());
      });

      it('handles an invalid response', async () => {
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
        address[Address.KEYS.street] = 'this is INVALID';

        const response = await getValidatedAddressMock(address);
        const result = AddressValidatorService.getFormattedAddressStrFromResponse(response);

        expect(result).toBe(AddressValidatorService.INVALID_ADDRESS_STRING);
      });

      it('handles a suspect response', async () => {
        const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
        address[Address.KEYS.street] = 'this is SUSPECT';

        const response = await getValidatedAddressMock(address);
        const result = AddressValidatorService.getFormattedAddressStrFromResponse(response);

        expect(result).toBe(address.toString().toUpperCase());
      });
    });
  });
});