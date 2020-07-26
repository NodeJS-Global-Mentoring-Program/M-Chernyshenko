import csvtojson from 'csvtojson';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';

const dirPath = path.resolve('csv');
const csvFileName = 'nodejs-hw1-ex1.csv';
const jsonFileName = 'nodejs-hw1-ex1.txt';

const readStream = fs.createReadStream(path.join(dirPath, csvFileName));
const writeStream = fs.createWriteStream(path.join(dirPath, jsonFileName));

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
