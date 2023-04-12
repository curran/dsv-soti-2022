import { useState, useEffect } from 'react';
import { csv } from 'd3-fetch';
export const useDataset = () => {
  const [dataset, setDataset] = useState(null);

  useEffect(() => {
    csv('./main.csv').then((data) => console.log(data));
  }, []);

  return dataset;
};
