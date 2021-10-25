import Address from './address.js';

export default class AddressesFile {
  static FIELD_DELIMITER = ', ';

  static VALID_HEADER = 'Street Address, City, Postal Code';

  static FIELD_ORDER = [
    Address.KEYS.street,
    Address.KEYS.city,
    Address.KEYS.postalCode,
  ]

  static buildAddressFromFileLine(line) {
    if (!AddressesFile.isLineValid(line)) {
      throw(`Address line is an invalid format. Exactly ${AddressesFile.FIELD_ORDER.length} fields required. Line: '${line}'`);
    }

    const s = AddressesFile.FIELD_DELIMITER;
    const lineAsArray = line.includes(s) && line.split(s) || [];

    const data = {};
    AddressesFile.FIELD_ORDER.forEach((f) => data[f] = lineAsArray.shift());

    return new Address(data);
  }

  static isLineValid(line) {
    const delimiterRegEx = new RegExp(AddressesFile.FIELD_DELIMITER, 'g');
    const matches = line.match(delimiterRegEx);
    return matches !== null && matches.length === AddressesFile.FIELD_ORDER.length - 1;
  }

  static isHeaderValid(header) {
    return header === AddressesFile.VALID_HEADER;
  }
}