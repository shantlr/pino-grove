import { createConfig, runPinoGrove } from '..';

const defaultConfig = createConfig({
  prefix: {
    override: ['level', 'time', 'time-delta', 'scope'],
    formatters: {
      scope: (logObj, { pc }) => {
        if ('scope' in logObj && typeof logObj.scope === 'string') {
          return pc.yellow(logObj.scope);
        }
        return '';
      },
    },
  },
  ignoreFormatFields: {
    scope: true,
  },
});

runPinoGrove({
  configs: [defaultConfig],
});
