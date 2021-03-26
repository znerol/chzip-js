const normalize = (str) => {
    return str.toLocaleLowerCase()
        .replace(/[äàâ]/u, 'a')
        .replace(/[ç]/u, 'c')
        .replace(/[éèêë]/u, 'e')
        .replace(/[îï]/u, 'i')
        .replace(/[öô]/u, 'o')
        .replace(/[üùû]/u, 'u')
        .replace(/[ÿ]/u, 'y');
};

const words = (subject) => {
    return subject.split(/[^\p{L}\p{N}]/u).map(word => normalize(word.trim()));
};

const pfxmatch = (subject, prefix) => {
    // Every word in prefix must match some word in subject.
    return words(prefix).every(pfx => {
        return words(subject).some(word => word.startsWith(pfx));
    });
};

export class Lookup {
    constructor(baseurl = 'https://znerol.github.io/chzip-js/data', options = {}) {
        this.baseurl = baseurl;
        this.cache = {
            id: '',
            data: [],
        };
        this.warn = options.warn || console.warn.bind(console);
        this.fetch = options.fetch || window.fetch.bind(window);
    }

    async lookup(prop, pfx) {
        if (pfx.length == 0) {
            this.warn('chzip pfx must be at least one character.');
            return [];
        }

        const dataset = `${prop}-${normalize(pfx[0])}`;
        if (this.cache.id !== dataset) {
            const url = `${this.baseurl}/${dataset}.json`;
            const result = await this.fetch(url);

            if (!result.ok) {
                this.warn('chzip request was not successful.');
                return [];
            }

            const data = await result.json();
            if (!Array.isArray(data)) {
                this.warn('chzip response was not an array.');
                return [];
            }

            this.cache.data = data;
            this.cache.id = dataset;
        }

        // Filter data by prefix matching.
        const result = this.cache.data.filter(record => {
            return pfxmatch(record[prop].toString(), pfx);
        });

        // First order results by city name, then by zip code.
        result.sort((a, b) => {
            return a['cty'].localeCompare(b['cty']) || a['zip'] - b['zip'];
        });

        return result;
    }
}
