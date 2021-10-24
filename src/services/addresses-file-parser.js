import AddressesFile from '../models/addresses-file.js';

export default class AddressesFileParser {
  static parse(file) {
    const lines = file.split('\n');

    const header = lines.shift();
    if (!AddressesFile.isHeaderValid(header)) {
      throw('File header is not valid. Aborting.');
    }

    return lines.map((l) => AddressesFile.buildAddressFromFileLine(l));
  }
}