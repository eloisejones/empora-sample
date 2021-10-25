#!/usr/bin/node

import AddressValidator from './services/address-validator.js';
import AddressesFileParser from './services/addresses-file-parser.js';
import url from 'url'

export default function appEntry() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (data) => {
    const addresses = AddressesFileParser.parse(data);
    addresses.forEach((a) => AddressValidator.validate(a));
  });
}

var runningAsScript = import.meta.url === url.pathToFileURL(process.argv[1]).href;
if (runningAsScript) {
  appEntry();
}
