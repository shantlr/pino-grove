import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';
import split2 from 'split2';
import { ICustomFormmatters, prettify, PrettyOption } from './prettify';

const parseLine = () =>
  split2((line: string) => {
    try {
      const obj = JSON.parse(line);
      return obj;
    } catch {
      return {
        level: 30,
        time: Date.now(),
        msg: line,
      };
    }
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const format = (options?: PrettyOption<any>) => {
  const pretiffier = prettify(options);
  return new Transform({
    objectMode: true,
    transform(chunk, enc, done) {
      this.push(pretiffier(chunk));
      done();
    },
  });
};

export const streamInput = async <CustomFormatters extends ICustomFormmatters>(
  source: Readable,
  options?: PrettyOption<CustomFormatters>,
) => {
  await pipeline(source, parseLine(), format(options), process.stdout);
};
