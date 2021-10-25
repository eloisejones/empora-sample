import fs from 'fs';
import { exec } from 'child_process';
import environment from '../src/config/index.js';

describe('Integration Testing', () => {
  const resultType = environment.addressValidator.realApiEnabled ? 'real' : 'fake';
  const expectedResults = {
    header: [
      '',
      '> empora-sample@1.0.0 start /Users/eloisemaun/empora-sample',
      '> node src/app-entry.js',
      '',
    ],
    fake: [
      '123 e Maine Street, Columbus, 43215 -> 123 E MAINE STREET, COLUMBUS, 43215',
      '1 Empora St, Title, 11111 -> 1 EMPORA ST, TITLE, 11111',
    ],
    real: [
      '1 Empora St, Title, 11111 -> Invalid Address',
      '123 e Maine Street, Columbus, 43215 -> 123 E Main St, Columbus, 43215-5207'
    ]
  };

  // beforeAll(() => {
    // const resultType = environment.addressValidator.realApiEnabled ? 'real' : 'fake';
    // expectedResults.example1 = fs.readFileSync(`./test/assets/results/example1-result-${resultType}.txt`, 'utf8');
  // });

  it(`returns correct result for ${resultType} Address Validator`, (done) => {
    const script = `cat ./test/assets/example1-data.csv | npm start`;

    exec(script, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        done();
      }
      if (stderr) {
        console.error(`exec stderr: ${stderr}`);
        done();
      }

      // Because the address results can come back in different orders, we cannot use just
      // a large text blob. Handling the expectation this way is more flexible.
      const outputLines = stdout.split('\n');
      expectedResults.header.forEach((headerLine) => {
        expect(outputLines.shift()).toBe(headerLine);
      });
      expect(outputLines.pop()).toBe('');

      expectedResults[resultType].forEach((addressLine) => {
        expect(outputLines).toContain(addressLine);
      });
      
      done();
    })
  })
})

