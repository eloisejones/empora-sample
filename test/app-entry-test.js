import appEntry from '../src/app-entry';
import mockProcess from 'jest-mock-process';
import { jest } from '@jest/globals';

const avMock = jest.mock('../src/services/address-validator', () => () => ({
  parse: () => {},
}));
const afpMock = jest.mock('../src/services/addresses-file-parser', () => () => ({
  validate: () => {},
}));

describe('appEntry', () => {
  test('always true', () => {
    appEntry();
    console.log(avMock.mock);
    // expect(avMock.mock.calls.length).toBe(12);
    // expect(afpMock.mock.calls.length).toBe(12);
  })
})