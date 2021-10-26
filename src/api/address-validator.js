import https from 'https';
import environment from '../config/index.js';
import AddressValidatorParams from '../models/address-validator-params.js';

export async function getValidatedAddress(address, processResponse) {
  return new Promise((resolve, reject) => {
    const requestUrl = buildAddressValidatorUrl(address);

    https.get(requestUrl, (resp) => {
      let data = '';
      resp.on('data', (chunk) => data += chunk);
      resp.on('end', () => {
        resolve(JSON.parse(data));
      });

    }).on("error", (err) => { 
      reject((err.message));
    });
  });
}

export function buildAddressValidatorUrl(address) {
  const validatorUrl = new URL(environment.addressValidator.endpoint);
  validatorUrl.search = AddressValidatorParams.buildParamsFromAddress(address);
  return validatorUrl;
}
