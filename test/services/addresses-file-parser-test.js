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
  {
    [Address.KEYS.street]: 'definitely',
    [Address.KEYS.city]: 'not an',
    [Address.KEYS.postalCode]: 'Address',
  },
  {
    [Address.KEYS.street]: '10079 whipple tree lane',
    [Address.KEYS.city]: 'clarkston',
    [Address.KEYS.postalCode]: '48348',
  },
];

describe('AddressesFileParser', () => {
  describe('.parse', () => {
    it('handles a basic case with all valid data', () => {
      const file = fs.readFileSync('./test/assets/example2-data.csv', 'utf8');
      const result = AddressesFileParser.parse(file);

      expect(result.length).toBe(example2Results.length);
      result.forEach((a, i) => {
        expect(a instanceof Address).toBe(true);
        Address.KEYS_ARRAY.forEach((f) => {
          expect(a[f]).toBe(example2Results[i][f])
        })
      });
    });

    it('handles when there is a header but no data', () => {
      const origFile = fs.readFileSync('./test/assets/example2-data.csv', 'utf8');
      const matches = origFile.match(/^[^\n]+/);
      const newFile = matches[0];
      const result = AddressesFileParser.parse(newFile);

      expect(result.length).toBe(0);
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

    it('errors when the header is absent', () => {
      const origFile = fs.readFileSync('./test/assets/example2-data.csv', 'utf8');
      const newFile = origFile.replace(/^.*?\n/, '');

      let error;
      try {
        AddressesFileParser.parse(newFile);
      } catch(e) { error = e; }


      expect(error).toBe('File header is not valid. Aborting.');
    });
  });
});