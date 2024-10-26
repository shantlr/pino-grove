import { runPinoGrove } from '..';

runPinoGrove({
  pretty: {
    prefix: {
      parts: ['level', 'time', 'time-delta', 'scope'],
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
  },
});
