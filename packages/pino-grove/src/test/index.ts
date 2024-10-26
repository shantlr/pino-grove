import pino from 'pino';

const main = () => {
  const logger = pino({
    name: 'test',
  });

  logger.info(`Hello, world!`);
  logger.trace(`trace`);
  logger.info(`Hello\nworld!`);
  logger.debug(`debug`);
  logger.error(`This is an error`);
  logger.fatal(`fatal error`);
  logger.info('');
  logger.info({
    string: 'HELLO world',
    number: 42,
    true: true,
    false: false,
    date: new Date(),
    null: null,
    array: [
      1,
      2,
      'hello',
      {
        test: 1234,
      },
      [3, 4, 5],
      6,
      7,
    ],
    nested: {
      key: 'value',
    },
  });
};

main();
