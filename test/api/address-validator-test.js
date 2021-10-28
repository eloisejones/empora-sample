import Address from '../../src/models/address';
import AddressValidatorParams from '../../src/models/address-validator-params.js';
import environment from '../../src/config/index.js';
import { describe, expect, it, jest } from '@jest/globals';
import { getValidatedAddress, buildAddressValidatorUrl } from '../../src/api/address-validator.js';

const cases = {
  basicAllData: {},
  validAddress: {
    input: {
      [Address.KEYS.street]: '10079 whipple tree ln',
      [Address.KEYS.city]: 'clarkston',
      [Address.KEYS.postalCode]: '48348',
    },
    output: {
      [Address.KEYS.street]: '10079 Whipple Tree Ln',
      [Address.KEYS.city]: 'Clarkston',
      [Address.KEYS.postalCode]: '48348-2055',
    },
  },
  suspectAddress: {
    input: {
      [Address.KEYS.street]: '123 e Maine Street',
      [Address.KEYS.city]: 'Columbus',
      [Address.KEYS.postalCode]: '43215',
    },
    output: {
      [Address.KEYS.street]: '123 E Main St',
      [Address.KEYS.city]: 'Columbus',
      [Address.KEYS.postalCode]: '43215-5207',
    },
  },
};
Address.KEYS_ARRAY.forEach((f) => cases.basicAllData[f] = `any data ${f}`);

describe('AddressValidator API', () => {
  describe('.getValidatedAddress', () => {
    it('handles a valid response', async () => {
      const address = new Address(cases.validAddress.input);
      const result = await getValidatedAddress(address);
  
      expect(result[AddressValidatorParams.KEYS_RESP.status]).toBe(AddressValidatorParams.STATUSES.valid);
      Address.KEYS_ARRAY.forEach((f) => {
        expect(result[AddressValidatorParams.KEYS_RESP[f]]).toBe(cases.validAddress.output[f]);
      });
    });
  
    it('handles a suspect response', async () => {
      const address = new Address(cases.suspectAddress.input);
      const result = await getValidatedAddress(address);
  
      expect(result[AddressValidatorParams.KEYS_RESP.status]).toBe(AddressValidatorParams.STATUSES.suspect);
      Address.KEYS_ARRAY.forEach((f) => {
        expect(result[AddressValidatorParams.KEYS_RESP[f]]).toBe(cases.suspectAddress.output[f]);
      });
    });
  
    it('handles an invalid response', async () => {
      const address = new Address(cases.basicAllData);  
      const result = await getValidatedAddress(address);
  
      expect(result[AddressValidatorParams.KEYS_RESP.status]).toBe(AddressValidatorParams.STATUSES.invalid);
    });
  });

  describe('.buildAddressValidatorUrl', () => {
    it('handles a basic case', () => {
      const address = new Address(cases.basicAllData);
      const result = buildAddressValidatorUrl(address);

      expect(result instanceof URL).toBe(true);
      expect(result.href).toMatch(environment.addressValidator.endpoint);
    });
  });
});