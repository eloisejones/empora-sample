import fs from 'fs';
import environment from '../src/config/index.js';
import { exec } from 'child_process';

process.env.ADDRESS_VALIDATOR_REAL_API_ENABLED = "true";
environment.addressValidator.realApiEnabled = true;

const results = {
  example1Real: fs.readFileSync(`./test/assets/example1-result-real.txt`, 'utf8'),
  example2Real: fs.readFileSync(`./test/assets/example2-result-real.txt`, 'utf8'),
  example1Mock: fs.readFileSync(`./test/assets/example1-result-mock.txt`, 'utf8'),
  example2Mock: fs.readFileSync(`./test/assets/example2-result-mock.txt`, 'utf8'),
}

const removeStdoutHeaders = (stdout, expectedResults) => {
  const stdoutArray = stdout.split('\n');
  const addressCount = expectedResults.match(/\n/g).length;
  return stdoutArray.slice(stdoutArray.length-addressCount-1).join('\n');
}

const handleErrors = (done, error, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    done();
  }
  if (stderr) {
    console.error(`exec stderr: ${stderr}`);
    done();
  }
};

// Run-time environment cannot be affected by changes at this level. Change the .env file
// directly to change which API communicator strategy to use.

describe('appEntry', () => {
  describe('using real API strategy', () => {
    const command = 'start';
    describe('example data provided in instructions', () => {
      it('returns correct results', (done) => {
        const filePath = './test/assets/example1-data.csv';
        const expectedResults = results.example1Real;

        const script = `cat ${filePath} | npm run ${command}`;

        exec(script, (error, stdout, stderr) => {
          handleErrors(done, error, stderr);

          const addressOnlyOutput = removeStdoutHeaders(stdout, expectedResults);
          expect(addressOnlyOutput).toBe(expectedResults);      
          done();
        });
      });
    });

    describe('custom example data', () => {
      it('returns correct results', (done) => {
        const filePath = './test/assets/example2-data.csv';
        const expectedResults = results.example2Real;
        
        const script = `cat ${filePath} | npm run ${command}`;

        exec(script, (error, stdout, stderr) => {
          handleErrors(done, error, stderr);

          const addressOnlyOutput = removeStdoutHeaders(stdout, expectedResults);
          expect(addressOnlyOutput).toBe(expectedResults);      
          done();
        });
      });
    });
  });

  describe('using mock API strategy', () => {
    const command = 'start-dev';

    describe('example data provided in instructions', () => {
      it('returns correct results', (done) => {
        const filePath = './test/assets/example1-data.csv';
        const expectedResults = results.example1Mock;
        
        const script = `cat ${filePath} | npm run ${command}`;

        exec(script, (error, stdout, stderr) => {
          handleErrors(done, error, stderr);

          const addressOnlyOutput = removeStdoutHeaders(stdout, expectedResults);
          expect(addressOnlyOutput).toBe(expectedResults);      
          done();
        });
      });
    });

    describe('custom example data', () => {
      it('returns correct results', (done) => {
        const filePath = './test/assets/example2-data.csv';
        const expectedResults = results.example2Mock;
        
        const script = `cat ${filePath} | npm run ${command}`;

        exec(script, (error, stdout, stderr) => {
          handleErrors(done, error, stderr);

          const addressOnlyOutput = removeStdoutHeaders(stdout, expectedResults);
          expect(addressOnlyOutput).toBe(expectedResults);      
          done();
        });
      });
    });
  });
});