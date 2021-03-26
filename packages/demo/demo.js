import { Lookup } from "@chzip/lookup";

const chzip = new Lookup("data");

addEventListener('DOMContentLoaded', () => {
  const zip = document.getElementById('zip');
  const city = document.getElementById('city');
  const canton = document.getElementById('canton');
  const hits = document.getElementById('hits');

  const choose = (record) => {
    hits.innerHTML = '';
    zip.value = record.zip;
    city.value = record.cty;
    canton.value = record.reg;
  };

  const show = (result) => {
    hits.innerHTML = '';
    hits.append(...result.map((record) => {
      const item = document.createElement('li');
      item.innerText = `${record.zip} ${record.cty} | ${record.reg}`;
      item.addEventListener('click', () => choose(record));
      return item;
    }));
  };

  zip.addEventListener('input', async () => {
    const result = await chzip.lookup('zip', zip.value);
    show(result);
  });

  city.addEventListener('input', async () => {
    const result = await chzip.lookup('cty', city.value);
    show(result);
  });
});
