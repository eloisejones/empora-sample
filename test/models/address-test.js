import Address from '../../src/models/address';

const cases = {
  basicAllData: {},
  basicNoData: {},
};
Address.KEYS_ARRAY.forEach((f) => cases.basicAllData[f] = `any data ${f}`);

describe('Address', () => {
  describe('constructor', () => {
    it('handles a basic case with all data', () => {
      const address = new Address(cases.basicAllData);
      expect(address instanceof Address).toBe(true);

      Address.KEYS_ARRAY.forEach((f) => {
        expect(address.hasOwnProperty(f)).toBe(true);
        expect(address[f]).toBe(`any data ${f}`);
      });
    });

    it('handles a basic case with no data', () => {
      const address = new Address(cases.basicNoData);
      expect(address instanceof Address).toBe(true);

      Address.KEYS_ARRAY.forEach((f) => {
        expect(address.hasOwnProperty(f)).toBe(true);
        expect(address[f]).toBe(undefined);
      });
    });
  });

  describe('toString', () => {
    it('handles a basic case with all data', () => {
      const data = cases.basicAllData;
      const address = new Address(data);
      const s = Address.FIELD_DELIMITER;
      const expected = data.street + s + data.city + s + data.postalCode;
      expect(address.toString()).toBe(expected);
    });

    it('handles a basic case with all data', () => {
      const data = cases.basicNoData;
      const address = new Address(data);
      const s = Address.FIELD_DELIMITER;
      const expected = data.street + s + data.city + s + data.postalCode;
      expect(address.toString()).toBe(expected);
    });
  });

  describe('keys_array', () => {
    it('contains all keys in KEYS', () => {
      Object.keys(Address.KEYS).forEach((k) => {
        expect(Address.KEYS_ARRAY).toContain(k);
      });
    });

    it('contains only keys that exist in KEYS', () => {
      Address.KEYS_ARRAY.forEach((k) => {
        expect(Address.KEYS).toHaveProperty(k);
      });
    });

  });
});