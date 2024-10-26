import { streamInput } from './stream';
import { ICustomFormmatters, PrettyOption } from './stream/prettify';

export const runPinoGrove = async <
  CustomFormatters extends ICustomFormmatters,
>({
  pretty,
}: {
  pretty?: PrettyOption<CustomFormatters>;
} = {}) => {
  await streamInput(process.stdin, pretty);
};
