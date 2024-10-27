import { streamInput } from './stream';
import {
  ICustomFormmatters,
  PrettyOption,
  PrettyPrefixPart,
} from './stream/prettify';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type Config<CustomFormatters extends ICustomFormmatters = {}> = {
  prefix?: {
    override?: (PrettyPrefixPart | keyof CustomFormatters)[];
    append?: (PrettyPrefixPart | keyof CustomFormatters)[];
    formatters?: CustomFormatters;
  };
  ignoreFormatFields?: Record<string, boolean>;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const createConfig = <CustomFormatters extends ICustomFormmatters = {}>(
  config: Config<CustomFormatters>,
) => config;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const runPinoGrove = async <Conf extends Config<any>>({
  configs = [],
}: {
  configs?: Conf[];
} = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pretty: PrettyOption<any> = configs.reduce(
    (acc, config) => {
      if (config.prefix) {
        if (config.prefix.override) {
          acc.prefix.parts = config.prefix.override;
        }
        if (config.prefix.append) {
          acc.prefix.parts = [...acc.prefix.parts, ...config.prefix.append];
        }
        if (config.prefix.formatters) {
          acc.prefix.formatters = {
            ...acc.prefix.formatters,
            ...config.prefix.formatters,
          };
        }
      }
      if (config.ignoreFormatFields) {
        acc.ignoreFormatFields = {
          ...acc.ignoreFormatFields,
          ...config.ignoreFormatFields,
        };
      }
      return acc;
    },
    {
      prefix: {
        parts: ['level', 'time', 'time-delta'],
        formatters: {},
      },
      ignoreFormatFields: {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as PrettyOption<any>,
  );

  await streamInput(process.stdin, pretty);
};
