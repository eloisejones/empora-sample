import Address from '../models/address.js';

export default class FileParser {
  static validHeader = "Street Address, City, Postal Code";

  static parse(file) {
    const lines = file.split('\n');
    const header = lines.shift();

    if (header !== this.validHeader) {
      throw("File header is invalid");
    }

    return lines.map((l) => Address.buildFromFileLine(l));
  }
}