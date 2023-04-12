import fs from 'fs';
import { tsvParse, csvParse, csvFormat } from 'd3-dsv';

// This script processes the dirty raw data files
// into clean usable files.

const processDictionary = () => {
  const rawTSV = fs.readFileSync('./data/raw/dictionary2022main.tsv', 'utf-8');

  // This TSV has a bunch of non-TSV content before the data really starts,
  // which is at "Variable", the first column name.
  const validTSV = rawTSV.substring(rawTSV.indexOf('Variable'));

  // Parse the valid data.
  const data = tsvParse(validTSV);

  // Remove the blank column
  for (const d of data) {
    delete d[''];
  }

  // Generate a CSV file that's directly usable in client-side code.
  fs.writeFileSync('./data/dictionary2022main.csv', csvFormat(data));
};

const processMain = () => {
  // This file is much too large at 8MB.
  // The following logic compresses the file by creating a
  // data dictionary mapping numbers to strings.
  const rawCSV = fs.readFileSync('./data/raw/data2022main.csv', 'utf-8');
  const data = csvParse(rawCSV);

  // This will be the new key that we store.
  let i = 0;

  const valueToKey = new Map();

  for (const d of data) {
    for (const column of data.columns) {
      const value = d[column];
      let key = valueToKey.get(value);

      // If this value does is not yet indexed,
      if (!key) {
        // mint a new key for it and index it.
        key = i++ + '';
        valueToKey.set(value, key);
      }
      // Replace the long string with the short key.
      d[column] = key;
    }
  }

  const values = Array.from(valueToKey.entries()).map(([value, key]) => ({ key, value }));

  // Generate a CSV file that's directly usable in client-side code.
  fs.writeFileSync('./data/main.csv', csvFormat(data));
  fs.writeFileSync('./data/mainValues.csv', csvFormat(values));
};

processDictionary();
processMain();
