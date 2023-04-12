import { useState, useCallback } from 'react';
import { descending } from 'd3-array';
import { QuestionViz } from './QuestionViz';
import { MatrixViz } from './MatrixViz';
import { hasData } from './hasData';
import { key } from './key';

const computePossibleMatrixAnswers = (columns, matrixAnswers) => {
  const possibleAnswers = [];
  for (const column of columns) {
    for (const answer of matrixAnswers) {
      possibleAnswers.push(key(column, answer));
    }
  }
  return possibleAnswers;
};

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
    const possibleAnswers = question.isMatrix
      ? computePossibleMatrixAnswers(columns, question.matrixAnswers)
      : columns;
    const counts = new Map(possibleAnswers.map((column) => [column, 0]));
    const countsFiltered = new Map(
      possibleAnswers.map((column) => [column, 0])
    );
    //    const answersSet = new Set();
    for (const d of data) {
      for (const column of columns) {
        if (hasData(d[column])) {
          //         answersSet.add(d[column]);
          // TODO count by combination of column and answer.
          const answerKey = question.isMatrix ? key(column, d[column]) : column;
          counts.set(answerKey, counts.get(answerKey) + 1);
          if (includedInFilters(d)) {
            countsFiltered.set(answerKey, countsFiltered.get(answerKey) + 1);
          }
        }
      }
    }

    question.counts = counts;
    question.answers = Array.from(counts.entries())
      .map(([answerKey, count]) => ({
        answerKey,
        answer: question.isMatrix
          ? undefined
          : dictionaryMap.get(answerKey).qrText_2022,
        count,
        countFiltered: countsFiltered.get(answerKey),
      }))
      .sort((a, b) => descending(a.count, b.count));
  }

  return multipleChoiceQuestions.map((question) => (
    <div className="question" key={question.questionColumn}>
      <div className="question-text">{question.text}</div>
      {question.isMatrix ? (
        <MatrixViz
          question={question}
          handleAnswerToggle={handleAnswerToggle}
          filters={filters}
        />
      ) : (
        <QuestionViz
          question={question}
          handleAnswerToggle={handleAnswerToggle}
          filters={filters}
        />
      )}
    </div>
  ));
};
