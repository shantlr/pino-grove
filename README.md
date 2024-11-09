# pino-grove

Lightweight pino log prettier

## Usage

### CLI

```sh
node index.js | pino-grove
```

### Customize formatting

You customize formatting programatically

```ts
// log-pretty.js
import { runPinoGrove } from "pino-grove";

runPinoGrove({
  configs: [
    {
      prefix: {
        // override default log prefix formatting
        overide: ["level", "time", "time-delta"], // this match the default format
      },
    },
    {
      // customize log header
      prefix: {
        append: ["trace_id"], // append elements to the prefix format, this should match keys of custom `formatters` or built-in formatters
        formatters: {
          trace_id: (logObj, { pc }) => {
            if (typeof logObj["trace_id"] === "string") {
              return pc.cyan(logObj["trace_id"]); // pc from library 'picocolors'
            }
          },
        },
      },
    },
  ],
});
```

```sh
node index.js | node log-pretty.js
```

### Express

```ts
// index.js
// ...
import { addLogger } from "pino-grove/express";

//...
const logger = pino();
const app = express();
app.use(addLogger(logger)); // add logger as express middleware
//...
```

```ts
// log-prettier.js
import { runPinoGrove } from "pino-grove";
import { expressConfig } from "pino-grove/express"; // format request metadata

runPinoGrove({
  configs: [expressConfig],
});
```

```sh
node index.js | node log-prettier.js
```
