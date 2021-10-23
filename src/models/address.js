export default class Address {
  static buildFromFileLine(line) {
    const [street, city, postalCode] = line.split(', ');
    return {street, city, postalCode};
  }
}