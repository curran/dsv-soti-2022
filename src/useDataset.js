import { useState, useEffect } from 'react';
import { ascending } from 'd3-array';
import { csv } from 'd3-fetch';

// Removes the irrelevant text after the "?".
const cleanQuestion = (str) => str.substring(0, str.indexOf('?') + 1);

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

      // Calculate the questions.
      const dictionaryMap = new Map(dictionary.map((d) => [d.Variable, d]));

      const multipleChoiceQuestions = main.columns
        .filter(
          (column) =>
            column.endsWith('_') &&
            !column.endsWith('__') &&
            // This one uses a different format, so will be handled elsewhere.
            column !== 'RacEthHistUnderrep_'
        )

        .map((questionColumn) => ({
          questionColumn,
        }));

      for (const question of multipleChoiceQuestions) {
        const { questionColumn } = question;
        question.text = cleanQuestion(
          dictionaryMap.get(questionColumn).qrText_2022
        );
        question.answerColumns = main.columns.filter(
          (column) =>
            column.startsWith(questionColumn) &&
            column !== questionColumn &&
            !column.endsWith('_collapsed')
        );
      }

      multipleChoiceQuestions.sort((a, b) =>
        ascending(a.answerColumns.length, b.answerColumns.length)
      );

      setDataset({ main, dictionary, multipleChoiceQuestions });
    });
  }, []);

  return dataset;
};
