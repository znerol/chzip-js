Welcome to chzip.js
===================

Fast zip code and locality lookups for Switzerland with minimal
footprint.

Demo
----

A demo page for browsers can be found [here](https://github.com/znerol/chzip-js).


Datasource
----------

Lookup data is sourced from the SwissPost opendata
[repository](https://swisspost.opendatasoft.com/explore/dataset/plz_verzeichnis_v2/information/)
(licenced under [CC-BY
4.0](https://creativecommons.org/licenses/by/4.0/)). The whole data set
is slimmed down and sliced up for prefix matching at regular intervals
using `@chzip/generate` package. The result is published automatically
on github pages. The `@chzip/generate` package can be used to prepare
datasets for self-hosting as well.

In order to minimize the amount of data downloaded to the client during
a search, the dataset is subdivided into 9 zip code sets
(`zip-1.json to zip-9.json`) and 24 city sets
(`cty-a.json to cty-z.json`).

Lookup
------

In order to find relevant entries, a string prefix matching is applied.
A hit is returned when every entered keyword matches at least one word
in the subject (i.e. the locality name). All words are normalized to
lower case and diacritics are removed before a matching is attempted. A
very minimal lookup client is implemented in `@chzip/lookup`.

License
-------

All source code of chzip.js is free software subject to the [GPL-3 or
later](https://www.gnu.org/licenses/gpl-3.0.en.html). The zip code
dataset is sourced from the SwissPost opendata
[repository](https://swisspost.opendatasoft.com/explore/dataset/plz_verzeichnis_v2/information/)
licenced under [CC-BY
4.0](https://creativecommons.org/licenses/by/4.0/).
