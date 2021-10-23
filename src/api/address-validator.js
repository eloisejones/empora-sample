import environment from '../config/index.js';

export const ADDRESS_FIELDS = {
  street: "street",
  city: "city",
  postalCode: "postalCode",
};

export default class AddressValidator {
  static API_FIELDS = {
    street: "StreetAddress",
    city: "City",
    postalCode: "PostalCode",
    apiKey: "APIKey",
  }

  static validate(address) {
    if (environment.addressValidator.realApiEnabled) {
      console.log("Real API Enabled");
      return;
    }

    AddressValidator.fakeApi(address);
  }

  static fakeApi(address) {
    console.log(address);
  }

  static buildUrlParams(address) {

  }
}