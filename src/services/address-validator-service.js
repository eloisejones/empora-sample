import environment from '../config/index.js';
import AddressValidatorParams from '../models/address-validator-params.js';
import { getValidatedAddress } from '../api/address-validator.js';
import { getValidatedAddressMock } from '../api/address-validator-mock.js';

export default class AddressValidatorService {
  static INVALID_ADDRESS_STRING = 'Invalid Address';

  static async validate(address) {
    const handler = environment.addressValidator.realApiEnabled
                  ? getValidatedAddress
                  : getValidatedAddressMock;
    const response = await handler(address);
    
    return AddressValidatorService.processResponse(response);
  }

  static processResponse(response) {
    return AddressValidatorService.getFormattedAddressStrFromResponse(response);
  }

  static getFormattedAddressStrFromResponse(response) {
    if (response.status == AddressValidatorParams.STATUSES.invalid) { 
      return AddressValidatorService.INVALID_ADDRESS_STRING;
    }

    const address = AddressValidatorParams.buildAddressFromResponse(response);
    return address.toString();
  }
}
