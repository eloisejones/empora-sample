#!/usr/bin/node

import AddressValidatorService from './services/address-validator-service.js';
import AddressesFileParserService from './services/addresses-file-parser-service.js';
import url from 'url'

export default class AppEntry {
  static async run() {
    try {
      AppEntry.processInput();
    } catch(e) {
      console.error(e);
    }
  }

  static processInput() {
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', AppEntry.processData);
  }

  static async processData(data) {
    const addresses = AddressesFileParserService.parse(data);
    const finalOutput = await AppEntry.validateAddresses(addresses);
  
    console.log(finalOutput);
  }

  static validateAddresses(addresses) {
    return new Promise(async (resolve, reject) => {
      try {
        const finalOutput = [];
        for (const i in addresses) {
          const formattedAddressStr = await AddressValidatorService.validate(addresses[i]);
          finalOutput.push(addresses[i].toString() + ' -> ' + formattedAddressStr);
        }
        resolve(finalOutput.join('\n'));
      } catch(e) {
        reject(e);
      }
    });
  }
}

var isCalledDirectly = url.fileURLToPath(import.meta.url) === process.argv[1];
if (isCalledDirectly) {
  AppEntry.run();
}
