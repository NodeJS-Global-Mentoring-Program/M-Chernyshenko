const { EOL } = require('os');
const stdin = process.stdin;
const stdout = process.stdout;

stdout.write(
  'Print anything and it will be reversed. Print "exit" for program stop.\n'
);
stdin.on('error', (err) => {
  console.error(err.message);
});
const onMessage = (data: Buffer): void => {
  const message = data.toString().trim();
  if (message.length === 0) {
    return;
  } else if (message === 'exit') {
    process.exit();
  }
  stdout.write(message.split('').reverse().join(''));
  stdout.write(EOL.repeat(2));
};
stdin.on('data', onMessage);
