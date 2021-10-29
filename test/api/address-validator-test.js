import Address from '../../src/models/address';
import AddressValidatorParams from '../../src/models/address-validator-params.js';
import environment from '../../src/config/index.js';
import { getValidatedAddress, buildAddressValidatorUrl } from '../../src/api/address-validator.js';
import { inputCases, outputCases } from '../assets/address-validator-api-real-io';

describe('AddressValidatorService API', () => {
  describe('.getValidatedAddress', () => {
    Object.keys(AddressValidatorParams.STATUSES).forEach((statusK) => {
      const status = AddressValidatorParams.STATUSES[statusK];

      it(`handles a ${status} response`, async () => {
        const inputData = inputCases[status];
        const outputData = outputCases[status];
        const address = new Address(inputData);
        const result = await getValidatedAddress(address);
    
        expect(result[AddressValidatorParams.KEYS_RESP.status]).toBe(status);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(result[AddressValidatorParams.KEYS_RESP[f]]).toBe(outputData[AddressValidatorParams.KEYS_RESP[f]]);
        });
      });
    });
  });

  describe('.buildAddressValidatorUrl', () => {
    it('handles a basic case', () => {
      const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
      const result = buildAddressValidatorUrl(address);

      expect(result instanceof URL).toBe(true);
      expect(result.href).toMatch(environment.addressValidator.endpoint);
    });
  });
});