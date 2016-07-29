# anthology [![Build Status](https://secure.travis-ci.org/dylang/anthology.png)](http://travis-ci.org/dylang/anthology)

Find anthology node modules

## Getting Started
Install the module with: `npm install anthology`

```javascript
var anthology = require('anthology');
anthology.forUser(username, filter)  // returns promise
  .then(data);
```

## CLI

Install the module globally: `npm install -g anthology`. The CLI is
available as `npm-anthology`.

<!-- BEGIN-EVAL echo '```';node lib/cli.js -h;echo '```' -->
```
Usage: npm-anthology [--username USER] [repo...]

Examples:

    npm-anthology --username dylang anthology
    npm-anthology --username dylang *
```

<!-- END-EVAL -->

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_Work in progress_

## License
Copyright (c) 2013-2014 Dylan Greene
Licensed under the MIT license.
