const fs = require('fs');
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');

const axios = require('axios');

const { chain } = require('stream-chain');

const { disassembler } = require('stream-json/Disassembler');
const { parser } = require('stream-json/Parser');
const { streamArray } = require('stream-json/streamers/StreamArray');
const { stringer } = require('stream-json/Stringer');

const url = 'https://swisspost.opendatasoft.com/explore/dataset/plz_verzeichnis_v2/download/?format=json';

const finished = promisify(stream.finished);

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

const prefixgroup = async (prop, pfx, outfile, infile) => {
    const process = chain([
        parser(),
        streamArray(),
        ({ value }) => {
            if (pfxmatch(value[prop].toString(), pfx)) {
                return value;
            }
        },
        disassembler(),
        stringer({ makeArray: true }),
    ]);

    const pipeline = fs.createReadStream(infile)
        .pipe(process)
        .pipe(fs.createWriteStream(outfile));

    await finished(pipeline);
};

const prefixgroups = async (outbase, infile) => {
    const zipgroups = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (const pfx of zipgroups) {
        const outfile = path.join(outbase, `zip-${pfx}.json`);
        await prefixgroup('zip', pfx, outfile, infile);
    }

    const ctygroups = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
        'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
        'z'];
    for (const pfx of ctygroups) {
        const outfile = path.join(outbase, `cty-${pfx}.json`);
        await prefixgroup('cty', pfx, outfile, infile);
    }
};

const download = async (outfile) => {
    const response = await axios({
        url,
        responseType: 'stream'
    });

    const process = chain([
        parser(),
        streamArray(),
        ({ value }) => {
            const { postleitzahl, ortbez27, kanton, plz_typ } = value.fields;
            if (plz_typ != 80) {
                return {
                    zip: postleitzahl,
                    cty: ortbez27,
                    reg: kanton,
                };
            }
        },
        disassembler(),
        stringer({ makeArray: true }),
    ]);

    const pipeline = response.data
        .pipe(process)
        .pipe(fs.createWriteStream(outfile));

    await finished(pipeline);
};

const generate = async (outdir) => {
    fs.mkdirSync(outdir, { recursive: true });

    const mainfile = path.join(outdir, 'all.json');
    if(!fs.existsSync(mainfile)) {
        await download(mainfile);
    }

    prefixgroups(outdir, mainfile);
};

module.exports = {
    download,
    prefixgroups,
    generate
};
