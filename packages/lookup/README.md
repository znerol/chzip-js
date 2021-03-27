@chzip/lookup
=============

Fast zip code and locality lookups for Switzerland with minimal
footprint.

Demo
----

A demo page for browsers can be found [here](https://znerol.github.io/chzip-js/).

Project repository with detailed instructions [here](https://github.com/znerol/chzip-js).

Usage
-----

```javascript
import { Lookup } from "@chzip/lookup";

const baseurl = 'https://znerol.github.io/chzip-js/data'
const chzip = new Lookup(baseurl);

// Lookup zip code (string prefix search)
console.log(await chzip.lookup('zip', 42));

// Lookup city (string prefix search)
console.log(await chzip.lookup('cty', 'bad'));
```

License
-------

All source code of chzip.js is free software subject to the [GPL-3 or
later](https://www.gnu.org/licenses/gpl-3.0.en.html). 
