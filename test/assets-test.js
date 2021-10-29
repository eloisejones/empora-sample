import Address from '../src/models/address.js';
import AddressValidatorParams from '../src/models/address-validator-params.js';
import { getValidatedAddress, buildAddressValidatorUrl } from '../src/api/address-validator.js';
import { inputCases, outputCases } from './assets/address-validator-api-real-io';

describe('Assets', () => {
  describe('inputCases and outputCases', () => {
    it('asset data matches real output for valid address', async () => {
      const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
      const result = await getValidatedAddress(address);
      const expectedResult = {
        ...outputCases[AddressValidatorParams.STATUSES.valid],
        ratelimit_remain: result.ratelimit_remain,
        ratelimit_seconds: result.ratelimit_seconds,
      };

      expect(result).toMatchObject(expectedResult);
    });

    it('asset data matches real output for suspect address', async () => {
      const address = new Address(inputCases[AddressValidatorParams.STATUSES.suspect]);
      const result = await getValidatedAddress(address);
      const expectedResult = {
        ...outputCases[AddressValidatorParams.STATUSES.suspect],
        ratelimit_remain: result.ratelimit_remain,
        ratelimit_seconds: result.ratelimit_seconds,
      };

      expect(result).toMatchObject(expectedResult);
    });

    it('asset data matches real output for invalid address', async () => {
      const address = new Address(inputCases[AddressValidatorParams.STATUSES.invalid]);
      const result = await getValidatedAddress(address);
      const expectedResult = {
        ...outputCases[AddressValidatorParams.STATUSES.invalid],
        ratelimit_remain: result.ratelimit_remain,
        ratelimit_seconds: result.ratelimit_seconds,
      };

      expect(result).toMatchObject(expectedResult);
    });
  });
});
