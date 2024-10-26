import sade from 'sade';
import { streamInput } from '../stream';

export const prog = sade('pino-grov');

prog
  .command('parse', '', {
    default: true,
  })
  .action((options) => {
    streamInput(process.stdin);
  });
