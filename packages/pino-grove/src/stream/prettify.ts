import pc from 'picocolors';

const LEVELS = {
  10: {
    label: pc.gray('TRC'),
  },
  20: {
    label: pc.gray('DBG'),
  },
  30: {
    label: pc.green('INF'),
  },
  40: {
    label: pc.yellow('WAR'),
  },
  50: {
    label: pc.red('ERR'),
  },
  60: {
    label: pc.bgRed(pc.white('FAT')),
  },
} satisfies Record<
  string | number,
  {
    label: string;
  }
>;
const DELTA_PAD = 4;

const padLeft = (str: string | number, len: number, filler: string = ' ') => {
  const s = String(str);
  if (s.length >= len) {
    return str;
  }
  return `${filler.repeat(len - s.length)}${s}`;
};

const formatDate = (date: Date) => {
  const formatted = `${padLeft(date.getHours(), 2, '0')}:${padLeft(date.getMinutes(), 2, '0')}:${padLeft(date.getSeconds(), 2, '0')}`;
  return pc.gray(formatted);
};
const formatDateDelta = (deltaMs: number | null) => {
  if (deltaMs == null) {
    return ' '.repeat(DELTA_PAD);
  }
  if (deltaMs < 1000) {
    return padLeft(`+${deltaMs}`, DELTA_PAD);
  }
  if (deltaMs < 1000 * 60) {
    return padLeft(`+${Math.floor(deltaMs / 1000)}s`, DELTA_PAD);
  }
  if (deltaMs < 1000 * 60 * 60) {
    return padLeft(`+${Math.floor(deltaMs / 1000 / 60)}m`, DELTA_PAD);
  }

  return ' '.repeat(DELTA_PAD);
};

const IGNORED_FIELDS = {
  time: true,
  level: true,
  msg: true,
  hostname: true,
  name: true,
  pid: true,
};

const formatFieldName = pc.blue;
const formatString = (value: string) => `'${pc.green(value)}'`;
const formatNumber = (value: number) => `${pc.yellow(value)}`;
const formatBoolean = (value: boolean) => pc.blueBright(String(value));
const FIELD_INDENT = '  ';
const NESTED_INDENT = pc.gray('..');
const formatField = (value: unknown, prefix = '', indent = FIELD_INDENT) => {
  switch (typeof value) {
    case 'number': {
      return `${indent}${prefix} ${formatNumber(value)}`;
    }
    case 'string': {
      return `${indent}${prefix} ${formatString(value)}`;
    }
    case 'boolean': {
      return `${indent}${prefix} ${formatBoolean(value)}`;
    }
  }
  if (value == null) {
    return `${indent}${prefix} ${pc.gray(String(value))}`;
  }

  if (Array.isArray(value)) {
    const res: string[] = [`${indent}${prefix}`];

    value.forEach((value) => {
      res.push(formatField(value, '-', `${indent}${NESTED_INDENT}`));
    });

    return res.join('\n');
  }

  const res: string[] = [`${indent}${prefix}`];
  for (const [key, fieldValue] of Object.entries(value)) {
    res.push(
      formatField(
        fieldValue,
        `${formatFieldName(key)}:`,
        `${indent}${NESTED_INDENT}`,
      ),
    );
  }
  return res.join('\n');
};

export const prettify = () => {
  let lastLogTimestamp: number = null;
  return (logObj: Record<string, unknown>): string => {
    const res: string[] = [];
    const mainLine: string[] = [];

    mainLine.push(
      LEVELS[logObj.level as keyof typeof LEVELS]?.label ?? pc.gray('???'),
    );

    if ('time' in logObj && typeof logObj.time === 'number') {
      const date = new Date(logObj.time);
      mainLine.push(`${formatDate(date)}`);
      const delta = lastLogTimestamp ? date.getTime() - lastLogTimestamp : null;
      lastLogTimestamp = logObj.time;
      mainLine.push(pc.gray(formatDateDelta(delta)));
    }

    if (
      'msg' in logObj &&
      typeof logObj.msg === 'string' &&
      logObj.msg.length
    ) {
      mainLine.push(logObj.msg as string);
    } else {
      mainLine.push(pc.gray('{empty message}'));
    }

    for (const [key, value] of Object.entries(logObj)) {
      if (key in IGNORED_FIELDS) {
        continue;
      }
      res.push(formatField(value, `${formatFieldName(key)}:`, '  '));
    }

    res.push(mainLine.join(' '));
    return res.join('\n') + '\n';
  };
};
