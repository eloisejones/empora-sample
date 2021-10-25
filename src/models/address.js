export default class Address {
  constructor(data) {
    Address.KEYS_ARRAY.forEach((k) => this[k] = data[k]);
  }

  static FIELD_DELIMITER = ', ';

  toString() {
    const s = Address.FIELD_DELIMITER;
    return this.street + s + this.city + s + this.postalCode;
  }

  static KEYS = {
    street: "street",
    city: "city",
    postalCode: "postalCode",
  };

  static KEYS_ARRAY = Object.keys(Address.KEYS);
}
