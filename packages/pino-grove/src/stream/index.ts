import { Readable, Transform } from 'stream';
import { pipeline } from 'stream/promises';
import split2 from 'split2';
import { prettify } from './prettify';

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

const format = () => {
  const pretiffier = prettify();
  return new Transform({
    objectMode: true,
    transform(chunk, enc, done) {
      this.push(pretiffier(chunk));
      done();
    },
  });
};

export const streamInput = async (source: Readable) => {
  await pipeline(source, parseLine(), format(), process.stdout);
};
