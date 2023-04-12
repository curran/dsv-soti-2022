import fs from 'fs';
import { tsvParse, csvFormat } from 'd3-dsv';

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

processDictionary();
