import { useState, useEffect } from 'react';
import { ascending } from 'd3-array';
import { csv } from 'd3-fetch';
import { hasData } from './hasData';

// Removes the irrelevant text after the "?".
const cleanQuestion = (str) => str.substring(0, str.indexOf('?') + 1);

const cleanAnswerMap = new Map([
  [
    'Performance issues (e.g. reliability, speed, lack of updates)',
    'Performance issues',
  ],
  ['Other (please specify)', 'Other'],
  ['[Other]', 'Other'],
]);
const cleanAnswer = (answer) => cleanAnswerMap.get(answer) || answer;

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
      // Clean up some of the answer labels.
      for (const d of dictionary) {
        d.qrText_2022 = cleanAnswer(d.qrText_2022);
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
        const dictionaryEntry = dictionaryMap.get(questionColumn);
        question.text = cleanQuestion(dictionaryEntry.qrText_2022);

        // In this case, a matrix viz is needed.
        question.isMatrix =
          dictionaryEntry.rSetup_2022 === 'Matrix from select all';

        question.answerColumns = main.columns.filter(
          (column) =>
            column.startsWith(questionColumn) &&
            column !== questionColumn &&
            !column.endsWith('_collapsed')
        );

        if (question.isMatrix) {
          // Assumption (which is true for all cases investigated):
          // These are the same for every answer of a given question.
          question.matrixAnswers = dictionaryMap
            .get(question.answerColumns[0])
            ['dataRange (rList_2022 + null markers)'].split(';')
            .map((str) => str.trim().replace(/'/g, ''))
            .filter(hasData);
        }
      }

      //multipleChoiceQuestions.sort((a, b) =>
      //  ascending(a.answerColumns.length, b.answerColumns.length)
      //);

      setDataset({ main, dictionary, multipleChoiceQuestions, dictionaryMap });
    });
  }, []);

  return dataset;
};
