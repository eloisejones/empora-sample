import environment from '../config/index.js';

export default class AddressValidator {
  static validate(address) {
    console.log(environment.addressValidator.realApiEnabled);
  }
}