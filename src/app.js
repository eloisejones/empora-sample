#!/usr/bin/node

import AddressValidator from './services/address-validator.js';
import AddressesFileParser from './services/addresses-file-parser.js';

export default function appEntry() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (data) => {
    const addresses = AddressesFileParser.parse(data);
    addresses.forEach((a) => AddressValidator.validate(a));
  });
}

appEntry();