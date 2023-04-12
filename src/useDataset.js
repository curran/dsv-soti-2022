import { useState, useEffect } from 'react';
import { csv } from 'd3-fetch';
export const useDataset = () => {
  const [dataset, setDataset] = useState(null);

  useEffect(() => {
    Promise.all([
      csv('./main.csv'),
      csv('./values.csv'),
      csv('./dictionary.csv'),
    ]).then(([main, values, dictionary]) => {
      const valuesMap = new Map(values.map(({ key, value }) => [key, value]));

      // Decompress the main dataset by filling in values.
      for (const d of main) {
        for (const column of main.columns) {
          d[column] = valuesMap.get(d[column]);
        }
      }

      setDataset({ main, dictionary });
    });
  }, []);

  return dataset;
};
