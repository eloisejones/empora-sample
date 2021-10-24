import environment from '../config/index.js';
import AddressValidatorParams from '../models/address-validator-params.js';
import { getValidatedAddress } from '../api/address-validator.js';
import { getValidatedAddressMock } from '../api/address-validator-mock.js';

export default class AddressValidator {
  static validate(address) {
    const handler = environment.addressValidator.realApiEnabled
                  ? getValidatedAddress
                  : getValidatedAddressMock;
    handler(address, AddressValidator.processResponse);
  }

  static processResponse(origAddress, response) {
    const formattedAddressStr = AddressValidator.getFormattedAddressStrFromResponse(response);
    console.log(origAddress.toString() + ' -> ' + formattedAddressStr);
  }

  static getFormattedAddressStrFromResponse(response) {
    if (response.status == AddressValidatorParams.STATUSES.invalid) { 
      return 'Invalid Address';
    }

    const address = AddressValidatorParams.buildAddressFromResponse(response);
    return address.toString();
  }
}
