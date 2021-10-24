import Address from './address.js';

export default class AddressesFile {
  static validHeader = "Street Address, City, Postal Code";

  static buildAddressFromFileLine(line) {
    const [street, city, postalCode] = line.split(', ');
    return new Address({street, city, postalCode});
  }

  static isHeaderValid(header) {
    return header === AddressesFile.validHeader;
  }
}