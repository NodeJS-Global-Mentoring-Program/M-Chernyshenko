const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const dirPath = path.resolve('csv');
const inputFileName = 'nodejs-hw1-ex1.csv';
const outputFileName = 'nodejs-hw1-ex1.txt';

const readStream = fs.createReadStream(path.join(dirPath, inputFileName));
const writeStream = fs.createWriteStream(path.join(dirPath, outputFileName));

const onError = (error: NodeJS.ErrnoException | null): void => {
  if (error) {
    return console.error(`Something went wrong: ${error.message}`);
  }
  console.log('Convertation success');
};
pipeline([readStream, csvtojson(), writeStream], onError);

// In pipe by hand way we need add error handler after every step
// readStream
//   .on('error', onError)
//   .pipe(csvtojson())
//   .on('error', onError)
//   .pipe(writeStream)
//   .on('error', onError)
//   .on('finish', () => {
//     return console.log('Convertation success');
//   });
