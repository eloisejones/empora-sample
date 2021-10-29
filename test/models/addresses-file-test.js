import Address from '../../src/models/address.js';
import AddressesFile from '../../src/models/addresses-file.js';

describe(('AddressFile'), () => {
  describe('.FIELD_ORDER', () => {
    it('contains only keys that exist in KEYS', () => {
      AddressesFile.FIELD_ORDER.forEach((k) => {
        expect(Address.KEYS).toHaveProperty(k);
      });
    });
  });

  describe('.buildAddressFromFileLine', () => {
    it('handles a basic case with all data', () => {
      const line = '123 My Street, Appledale, 12345';
      const result = AddressesFile.buildAddressFromFileLine(line);

      expect(result instanceof Address).toBe(true);
      expect(result[Address.KEYS.street]).toBe('123 My Street');
      expect(result[Address.KEYS.city]).toBe('Appledale');
      expect(result[Address.KEYS.postalCode]).toBe('12345');
    });

    it('handles a basic case with no data', () => {
      const line = ', , ';
      const result = AddressesFile.buildAddressFromFileLine(line);

      expect(result instanceof Address).toBe(true);
      expect(result[Address.KEYS.street]).toBe('');
      expect(result[Address.KEYS.city]).toBe('');
      expect(result[Address.KEYS.postalCode]).toBe('');
    });

    it('errors when a line has no fields', () => {
      const line = '';
      const expectedError = `Address line is an invalid format. Exactly ${AddressesFile.FIELD_ORDER.length} fields required. Line: '${line}'`;
      let result;

      try {
        result = AddressesFile.buildAddressFromFileLine(line);
      } catch(e) {
        expect(e).toBe(expectedError);
      }
    });

    it('errors when a line has fewer fields', () => {
      const line = ', ';
      const expectedError = `Address line is an invalid format. Exactly ${AddressesFile.FIELD_ORDER.length} fields required. Line: '${line}'`;
      let result;

      try {
        result = AddressesFile.buildAddressFromFileLine(line);
      } catch(e) {
        expect(e).toBe(expectedError);
      }
    });
    
    it('errors when a line has extra fields', () => {
      const line = '123 My Street, Appledale, 12345, extra1, extra2';
      const expectedError = `Address line is an invalid format. Exactly ${AddressesFile.FIELD_ORDER.length} fields required. Line: '${line}'`;
      let result;

      try {
        result = AddressesFile.buildAddressFromFileLine(line);
      } catch(e) {
        expect(e).toBe(expectedError);
      }
    });
  });

  describe('.isLineValid', () => {
    it('returns true for a basic case with all data', () => {
      const line = '123 My Street, Appledale, 12345';
      const result = AddressesFile.isLineValid(line);

      expect(result).toBe(true);
    });

    it('returns true for a basic case with no data', () => {
      const line = ', , ';
      const result = AddressesFile.isLineValid(line);

      expect(result).toBe(true);
    });

    it('returns false for a line has no fields', () => {
      const line = '';
      const result = AddressesFile.isLineValid(line);

      expect(result).toBe(false);
    });

    it('returns false for a line has fewer fields', () => {
      const line = ', ';
      const result = AddressesFile.isLineValid(line);

      expect(result).toBe(false);
    });
    
    it('returns false for a line has extra fields', () => {
      const line = '123 My Street, Appledale, 12345, extra1, extra2';
      const expectedError = `Address line is an invalid format. Exactly ${AddressesFile.FIELD_ORDER.length} fields required. Line: '${line}'`;
      const result = AddressesFile.isLineValid(line);

      expect(result).toBe(false);
    });
  });

  describe('isHeaderValid', () => {
    it('returns true when header is correct', () => {
      const result = AddressesFile.isHeaderValid(AddressesFile.VALID_HEADER);
      expect(result).toBe(true);
    });

    it('returns false when header is blank', () => {
      const result = AddressesFile.isHeaderValid('');
      expect(result).toBe(false);
    });

    it('returns false when a portion of the header is correct', () => {
      const result = AddressesFile.isHeaderValid(AddressesFile.VALID_HEADER.substr(1));
      expect(result).toBe(false);
    });
  });
});
