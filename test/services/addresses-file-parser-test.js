import { expect, it } from '@jest/globals';
import fs from 'fs';
import AddressesFileParser from '../../src/services/addresses-file-parser';
import Address from '../../src/models/address';

const example2Results = [
  {
    [Address.KEYS.street]: '123 e Maine Street',
    [Address.KEYS.city]: 'Columbus',
    [Address.KEYS.postalCode]: '43215',
  },
  {
    [Address.KEYS.street]: '1 Empora St',
    [Address.KEYS.city]: 'Title',
    [Address.KEYS.postalCode]: '11111',
  },
  {
    [Address.KEYS.street]: '80 e rich',
    [Address.KEYS.city]: 'columbus',
    [Address.KEYS.postalCode]: '43215',
  },
];

describe('AddressesFileParser', () => {
  describe('.parse', () => {
    it('handles a basic case with all valid data', () => {
      const file = fs.readFileSync('./test/assets/example2-data.csv', 'utf8');
      const result = AddressesFileParser.parse(file);

      expect(result.length).toBe(3);
      result.forEach((a, i) => {
        expect(a instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(a[f]).toBe(example2Results[i][f])
        })
      });
    });

    it('errors when the header is not valid', () => {
      const origFile = fs.readFileSync('./test/assets/example2-data.csv', 'utf8');
      const newFile = origFile.replace('S', 'NO');

      let error;
      try {
        AddressesFileParser.parse(newFile);
      } catch(e) { error = e; }


      expect(error).toBe('File header is not valid. Aborting.');
    });
  });
});