@chzip/generate
===============

Fast zip code and locality lookups for Switzerland with minimal
footprint.

Demo
----

A demo page for browsers can be found [here](https://znerol.github.io/chzip-js/).

Project repository with detailed instructions [here](https://github.com/znerol/chzip-js).

Usage
-----

Requires node 10 or better.

```javascript
const { generate } = require('@chzip/generate');

const main = async () => {
    await generate('./dist/data');
};

main();
```

Lookup data is sourced from the SwissPost opendata
[repository](https://swisspost.opendatasoft.com/explore/dataset/plz_verzeichnis_v2/information/)
(licenced under [CC-BY
4.0](https://creativecommons.org/licenses/by/4.0/)).

License
-------

All source code of chzip.js is free software subject to the [GPL-3 or
later](https://www.gnu.org/licenses/gpl-3.0.en.html). The zip code
dataset is sourced from the SwissPost opendata
[repository](https://swisspost.opendatasoft.com/explore/dataset/plz_verzeichnis_v2/information/)
licenced under [CC-BY
4.0](https://creativecommons.org/licenses/by/4.0/).
