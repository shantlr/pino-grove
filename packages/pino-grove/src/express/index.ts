import { RequestHandler } from 'express';
import { Logger } from 'pino';
import { createConfig } from '..';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      logger?: Logger;
    }
  }
}

export const addLogger = <L extends Logger>(logger: L): RequestHandler => {
  const maxInt = 2147483647;
  let nextReqId = 0;

  function genId() {
    return (nextReqId = (nextReqId + 1) & maxInt);
  }

  return (req, res, next) => {
    const start = Date.now();
    req.logger = logger.child({
      'req.id': genId(),
      'req.method': req.method,
      'req.path': req.originalUrl,
    });

    req.logger.info(`request started`);

    const onFinish = () => {
      const end = Date.now();
      res.removeListener('finish', onFinish);
      res.removeListener('close', onFinish);
      res.removeListener('error', onFinish);

      req.logger.info(
        {
          'req.method': req.method,
          'req.path': req.originalUrl,
          'req.duration': end - start,
          'res.status': res.statusCode,
        },
        `request completed`,
      );
    };
    res.addListener('finish', onFinish);
    res.addListener('close', onFinish);
    res.addListener('error', onFinish);

    next();
    //
  };
};

export const expressConfig = createConfig({
  prefix: {
    append: ['express-req'],
    formatters: {
      'express-req': (logObj, { pc }) => {
        if (logObj['req.id'] && logObj['req.method']) {
          return `[${logObj['req.id']}] ${logObj['req.method']} ${pc.gray(logObj['req.path'] as string)}${logObj['req.status'] ? ` {${logObj['req.status']}}` : ''}`;
        }
      },
    },
  },
  ignoreFormatFields: {
    'req.id': true,
    'req.method': true,
    'req.path': true,
    'req.duration': true,
    'res.status': true,
  },
});
