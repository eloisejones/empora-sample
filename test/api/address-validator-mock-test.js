import Address from '../../src/models/address';
import AddressValidatorParams from '../../src/models/address-validator-params.js';
import { getValidatedAddress } from '../../src/api/address-validator.js';
import { getValidatedAddressMock } from '../../src/api/address-validator-mock.js';
import { inputCases } from '../assets/address-validator-api-real-io';

describe('getValidatedAddressMock', () => {
  it('returns response object with only keys that exist in real API response', async () => {
    const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
    const responseReal = await getValidatedAddress(address);
    const responseMock = await getValidatedAddressMock(address);

    Object.keys(responseMock).forEach((k) => {
      expect(responseReal).toHaveProperty(k);
    });
  });

  it('handles a valid response', async () => {
    const address = new Address(inputCases[AddressValidatorParams.STATUSES.valid]);
    const result = await getValidatedAddressMock(address);

    expect(result[AddressValidatorParams.KEYS_RESP.status]).toBe(AddressValidatorParams.STATUSES.valid);
    Address.KEYS_ARRAY.forEach((f) => {
      expect(result[AddressValidatorParams.KEYS_RESP[f]]).toBe(address[f].toUpperCase());
    });
  });

  it('handles an invalid response', async () => {
    const address = new Address(inputCases[AddressValidatorParams.STATUSES.invalid]);
    address[Address.KEYS.street] = 'this is INVALID';

    const result = await getValidatedAddressMock(address);

    expect(result[AddressValidatorParams.KEYS_RESP.status]).toBe(AddressValidatorParams.STATUSES.invalid);
    Address.KEYS_ARRAY.forEach((f) => {
      expect(result[AddressValidatorParams.KEYS_RESP[f]]).toBe(address[f]);
    });
  });

  it('handles a suspect response', async () => {
    const address = new Address(inputCases[AddressValidatorParams.STATUSES.suspect]);
    address[Address.KEYS.street] = 'this is SUSPECT';

    const result = await getValidatedAddressMock(address);

    expect(result[AddressValidatorParams.KEYS_RESP.status]).toBe(AddressValidatorParams.STATUSES.suspect);
    Address.KEYS_ARRAY.forEach((f) => {
      expect(result[AddressValidatorParams.KEYS_RESP[f]]).toBe(address[f].toUpperCase());
    });
  });
});