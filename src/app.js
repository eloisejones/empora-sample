#!/usr/bin/node

import fs from 'fs'; 
import parse from 'csv-parse';
import AddressValidator from './api/address-validator.js';
import FileParser from './services/file-parser.js';
import child from 'child_process';

export default function appEntry() {
  const csvData = [];

  // fs.createReadStream('./src/assets/sampledata.csv')
  //   .pipe(parse({delimiter: ':'}))
  //   .on('data', (csvrow) => csvData.push(csvrow))
  //   .on('end', () => console.log(csvData));
  

  AddressValidator.validate();

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (data) => {
    console.log(FileParser.parse(data));
  });
}

appEntry();