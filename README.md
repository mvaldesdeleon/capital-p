# capital-p

Because why the fuck not?

```JS
var P = require('capital-p');

var a = P((res, rej) => {
    setTimeout(() = { res('hello'); }, 1000);
});

var b = a.then(hello => `${hello}` world);

b.then(console.log.bind(console));
// Profit
```

# install
with [npm](https://npmjs.org) do:

```
npm install capital-p
```

# license

MIT
