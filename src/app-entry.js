#!/usr/bin/node

import AddressValidator from './services/address-validator.js';
import AddressesFileParser from './services/addresses-file-parser.js';
import url from 'url'

export default async function appEntry() {
  try {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', async (data) => {
      const addresses = AddressesFileParser.parse(data);

      const finalOutput = await getFinalOutput(addresses);
      console.log(finalOutput);
    });
  } catch(e) {
    console.error(e);
  }
}

function getFinalOutput(addresses) {
  return new Promise(async (resolve, reject) => {
    const finalOutput = [];
    for (const i in addresses) {
      const formattedAddressStr = await AddressValidator.validate(addresses[i]);
      finalOutput.push(addresses[i].toString() + ' -> ' + formattedAddressStr);
    }
    resolve(finalOutput.join('\n'));
  });
}

var isCalledDirectly = url.fileURLToPath(import.meta.url) === process.argv[1];
if (isCalledDirectly) {
  appEntry();
}
