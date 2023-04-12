import { useState, useCallback } from 'react';
import { descending } from 'd3-array';
import { QuestionViz } from './QuestionViz';

// A sentinel value representing that the answer was not chosen.
const notChosen = '[^not chosen]';
const unasked = '[\\unasked]';
const unfinished = '[\\unfinished]';

const hasData = (value) =>
  value !== notChosen && value !== unasked && value !== unfinished;

export const Viz = ({ dataset }) => {
  const [filters, setFilters] = useState([]);

  const handleAnswerToggle = useCallback(
    (column) => {
      const existingFilter = filters.includes(column);

      // If the filter was already applied, remove it.
      if (existingFilter) {
        setFilters(filters.filter((filter) => filter !== column));
      } else {
        // Otherwise add it.
        setFilters([...filters, column]);
      }
    },
    [filters]
  );

  //console.log(JSON.stringify(questions, null, 2));
  const { multipleChoiceQuestions, dictionaryMap } = dataset;

  const data = dataset.main;
  const includedInFilters = (d) => {
    let included = true;
    for (const column of filters) {
      if (!hasData(d[column])) {
        included = false;
      }
    }
    return included;
  };

  for (const question of multipleChoiceQuestions) {
    const columns = question.answerColumns;

    // Calculate counts for each answer.
    const counts = new Map(columns.map((column) => [column, 0]));
    const countsFiltered = new Map(columns.map((column) => [column, 0]));
    for (const d of data) {
      for (const column of columns) {
        if (hasData(d[column])) {
          counts.set(column, counts.get(column) + 1);
          if (includedInFilters(d)) {
            countsFiltered.set(column, countsFiltered.get(column) + 1);
          }
        }
      }
    }

    question.answers = Array.from(counts.entries())
      .map(([column, count]) => ({
        column,
        answer: dictionaryMap.get(column).qrText_2022,
        count,
        countFiltered: countsFiltered.get(column),
      }))
      .sort((a, b) => descending(a.count, b.count));
  }

  return multipleChoiceQuestions.map((question) => (
    <div className="question" key={question.questionColumn}>
      <div className="question-text">{question.text}</div>
      <QuestionViz
        question={question}
        handleAnswerToggle={handleAnswerToggle}
        filters={filters}
      />
    </div>
  ));
};
