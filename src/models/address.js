export default class Address {
  constructor(data) {
    Object.keys(Address.KEYS).forEach(k => this[k] = data[k]);
  }

  toString() {
    const s = ', ';
    return this.street + s + this.city + s + this.postalCode;
  }

  static KEYS = {
    street: "street",
    city: "city",
    postalCode: "postalCode",
  };

  static KEYS_ARRAY = Object.keys(Address.KEYS);

}

// Address.prototype.toString = () => {
//   const s = ', ';
//   return this.street + s + this.city + s + this.postalCode;
// }