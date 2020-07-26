const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const babel = require('@babel/core');

const distDir = 'dist';

const inputFile = process.argv[2];
const inputFilename = inputFile.split('/').pop();
const outDir = path.resolve(distDir);
const outFileName = inputFilename.split('.').slice(0, -1) + '.js';
const outFilePath = path.join(outDir, outFileName);
const transformResult = babel.transformFileSync(inputFile, {
  presets: ['@babel/preset-typescript', '@babel/env'],
});
fs.writeFileSync(outFilePath, transformResult.code);
const child = childProcess.execFile(
  `node`,
  [path.join(distDir, outFileName)],
  (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
  }
);
child.stdout.pipe(process.stdout);
process.stdin.pipe(child.stdin);
child.on('close', () => {
  process.exit();
});
