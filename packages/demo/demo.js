import { Lookup } from "@chzip/lookup";

const chzip = new Lookup();

addEventListener('DOMContentLoaded', () => {
  const zip = document.getElementById('zip');
  const city = document.getElementById('city');
  const canton = document.getElementById('canton');
  const hits = document.getElementById('hits');
  const reset = document.getElementById('reset');

  const clear = () => {
    hits.innerHTML = '';
    hits.classList.remove('hits-visible');
  };

  const choose = (record) => {
    zip.value = record.zip;
    city.value = record.cty;
    canton.value = record.reg;
    clear();
  };

  const show = (result) => {
    hits.innerHTML = '';
    hits.append(...result.map((record) => {
      const item = document.createElement('li');
      item.innerText = `${record.zip} ${record.cty} | ${record.reg}`;
      item.addEventListener('click', () => choose(record));
      return item;
    }));
    if (result.length > 0) {
        hits.classList.add('hits-visible');
    }
    else {
        hits.classList.remove('hits-visible');
    }
  };

  zip.addEventListener('input', async () => {
    const result = await chzip.lookup('zip', zip.value);
    show(result);
  });

  city.addEventListener('input', async () => {
    const result = await chzip.lookup('cty', city.value);
    show(result);
  });

  reset.addEventListener('click', () => {
      zip.value = '';
      city.value = '';
      canton.value = '';
      clear();
  });
});
