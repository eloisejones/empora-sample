export default class Address {
  constructor(data) {
    Address.KEYS_ARRAY.forEach((k) => this[k] = data[k]);
  }

  static FIELD_DELIMITER = ', ';

  toString() {
    const fd = Address.FIELD_DELIMITER;
    let s = '';

    Address.KEYS_ARRAY.forEach((k) => {
      if (this[k] && this[k].toLowerCase() !== 'undefined') {
        if (s) { s += fd; }
        s += this[k];
      }
    })
    
    return s;
  }

  static KEYS = {
    street: "street",
    city: "city",
    postalCode: "postalCode",
  };

  static KEYS_ARRAY = Object.keys(Address.KEYS);
}
